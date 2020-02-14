const User = require('../models/user');
const fs = require('fs-extra');
const pet = require('../models/pet');
const Photo = require('../models/photo');
const AlbumService = require('./album-service');

class UserServices {

    async add (body) {
        const user = new User(body);
        await user.save();
        await fs.ensureDir(`public/${user._id}`);
        const token = await user.generateAuthToken();
        user.avatar = await AlbumService.add({title: 'Фотографии с профиля', description: '', owner: user.id});
        const startPhoto = {
            url: 'files/NoAvatar.jpg',
            album: user.avatar,
            owner: user._id,
        };
        const photo = new Photo (startPhoto);
        await photo.save();

        await user.save();
        return {user, token}
    }

    async login (login , password){
        const user = await User.findByCredentials(login, password);
        const token = await user.generateAuthToken();
        return {user, token}
    }

    async logout (req){
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        return "Logout"
    }
    
    async update (req){
        return await User.findOneAndUpdate({login: req.user.login}, req.body);
    }

    async updateByAdmin (req){
        return await User.findOneAndUpdate({login: req.params.id}, req.body);
    }
    
    async del(req){
        if (req.user.login === req.params.id){
            const user = await User.findOne({login : req.params.id});
            await pet.deleteMany({owner: user._id.toString()});
            if (!await fs.pathExists(`public/${user._id}`)){
                await fs.remove(`public/${user._id}`);
            }
            await User.deleteOne({login: req.params.id});
            return "deleted"
        } throw new Error('YOU SHELL NOT PASS');
    }

    async getUser (login) {
        return await User.aggregate([
            {
                $match: {$or: [ { name: {$regex: `^${login}\.*`, $options: 'i' } },
                        { surname: {$regex: `^${login}\.*`, $options: 'i' } } ]}
            },
            {
                $lookup: {
                    from: "photos",
                    localField: 'avatar',
                    foreignField: "album",
                    as: "photos"
                }
            },
            { $unset: ["tokens", "__v", "password"] }
        ]);

    }
    
    async getAllUsers (){

    return await User.aggregate([
                             {
                                 $match: {}
                             },
                             {
                                 $lookup: {
                                     from: "photos",
                                     localField: 'avatar',
                                     foreignField: "album",
                                     as: "photos"
                                 }
                             },
                             { $unset: ["tokens", "__v", "password"] }
                         ]);
    }


    async getUserAll(login){

        return await User.aggregate([
            {
                $match: { login: login }
            },
            {
                $lookup: {
                    from: "pets",
                    localField: '_id',
                    foreignField: "owner",
                    as: "pets"
                }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: 'avatar',
                    foreignField: "album",
                    as: "photos"
                }
            },
            { $unset: ["tokens", "__v", "password"] }
        ]);

    }

    async getAllUsersHavePets() {
        return await User.aggregate([
            {
                $lookup:
                    {
                        from: "pets",
                        localField: '_id',
                        foreignField: "owner",
                        as: "pets"
                    }
            },
            { $match: { pets: {$ne: []} } }
        ]);
    }

}

module.exports = new UserServices;

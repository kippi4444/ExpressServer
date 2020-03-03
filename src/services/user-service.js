const User = require('../models/user');
const fs = require('fs-extra');
const pet = require('../models/pet');
const Photo = require('../models/photo');
const Album = require('../models/album');
const AlbumService = require('./album-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class UserServices {

    async add (body) {
        const user = new User(body);
        await user.save();
        await fs.ensureDir(`public/${user._id}`);
        const token = await user.generateAuthToken();
        user.avatar = await AlbumService.add({title: 'Фотографии с профиля', description: '', owner: user.id});
        await AlbumService.add({title: 'Фотографии со стены', description: '', owner: user.id});
        fs.copyFile('public/NoAvatar.jpg', `${__dirname}`+`../../../public/${user._id}/NoAvatar.jpg`,
            (err) => {if (err) return console.error(err);}
            );
        const startPhoto = {
            url: `files/${user._id}/NoAvatar.jpg`,
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
    }
    
    async update (req){
        return await User.findOneAndUpdate({login: req.user.login}, req.body);
    }

    async changeStatus (body){
        return await User.findOneAndUpdate({_id: ObjectId(body.id)}, {online: body.online} );
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
            await Photo.deleteMany({owner: user._id.toString()});
            await Album.deleteMany({owner: user._id.toString()});
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
            {
                $lookup: {
                    from: "friends",
                    localField: '_id',
                    foreignField: 'owner',
                    as: "friends"
                }
            },
            {
                $lookup: {
                    from: "requests",
                    localField: '_id',
                    foreignField: 'owner',
                    as: "requests"
                }
            },
            { $unset: ["tokens", "__v", "password"] }
        ]);
    }
    
    async getAllUsers (req){
        if (!req.query.limit) {
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
                     {
                        $lookup: {
                            from: "friends",
                            localField: '_id',
                            foreignField: 'owner',
                            as: "friends"
                        }
                     },
                    {
                        $lookup: {
                            from: "requests",
                            localField: '_id',
                            foreignField: 'owner',
                            as: "requests"
                        }
                    },
                    // { $addFields:
                    //         { isRequest:
                    //                 {
                    //                     $cond: [{
                    //                         $size: {
                    //                             $filter: { input: "$requests", as: "friend", cond:  {
                    //                                 $ne: [ "$$friend", req.user._id ] }
                    //                             }
                    //                         }
                    //                     }, true, false ]
                    //                 }
                    //         }
                    // },
                    // { $addFields:
                    //         { isFriend:
                    //                 {
                    //                     $cond: [{
                    //                         $size: {
                    //                             $filter: { input: "$friends", as: "friend", cond:  {
                    //                                     $ne: [ "$$friend", req.user._id ] }
                    //                             }
                    //                         }
                    //                     }, true, false ]
                    //                 }
                    //         }
                    // },

                     { $unset: ["tokens", "__v", "password" ] }
                 ]);
        } else
        {

        let skip = 0;
        if(req.query.page > 1){
            skip = req.query.page*req.query.limit;
        }
        const limit = + req.query.limit;

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
                {
                    $lookup: {
                        from: "friends",
                        localField: '_id',
                        foreignField: 'owner',
                        as: "friends"
                    }
                },
                {
                    $lookup: {
                        from: "requests",
                        localField: '_id',
                        foreignField: 'owner',
                        as: "requests"
                    }
                },
                // { $addFields:
                //         { isRequest:
                //                 {
                //                     $cond: [{
                //                         $size: {
                //                             $filter: { input: "$requests", as: "friend", cond:  {
                //                                 $ne: [ "$$friend", req.user._id ] }
                //                             }
                //                         }
                //                     }, true, false ]
                //                 }
                //         }
                // },
                // { $addFields:
                //         { isFriend:
                //                 {
                //                     $cond: [{
                //                         $size: {
                //                             $filter: { input: "$friends", as: "friend", cond:  {
                //                                     $ne: [ "$$friend", req.user._id ] }
                //                             }
                //                         }
                //                     }, true, false ]
                //                 }
                //         }
                // },
                { $sort : {_id: 1} },
                { $skip : skip },
                { $limit : limit },
                { $unset: ["tokens", "__v", "password" ] }
            ]);


        }
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
            {
                $lookup: {
                    from: "friends",
                    localField: '_id',
                    foreignField: 'owner',
                    as: "friends"
                }
            },
            {
                $lookup: {
                    from: "requests",
                    localField: '_id',
                    foreignField: 'owner',
                    as: "requests"
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

const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const pet = require('../models/pet');

class Services {

    async add (body) {
        const user = new User({
            login: body.login,
            password: body.password,
            name: body.name,
            surname: body.surname,
            number: body.number,
            email: body.email
        });
        await user.save();
        const token = await user.generateAuthToken();
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
        await User.updateOne({login: req.params.id}, req.body);
        return "updated";
    }
    
    async del(login){
        const user = await User.findOne({login});
        await pet.deleteMany({owner: user._id.toString()});
        await User.deleteOne({login});
        return "deleted"
    }

    async getUser (login) {
        return await User.find({login});
    }
    
    async getAllUsers (){
        return await User.find({});
    }

    async getUserPets (id){
        return await User.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            {
                $lookup: {
                    from: "pets",
                    localField: '_id',
                    foreignField: "owner",
                    as: "pets"
                }
            }
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

module.exports = new Services;

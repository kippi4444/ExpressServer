const Pet = require('../models/pet');
const User = require('../models/user');

class Services {

    async add (body) {
        const user = await  User.findOne({_id: body.owner});

        if (!user) {
            throw new Error("Owner not found!");
        }

        const pet = new Pet({
            name: body.name,
            species: body.species,
            owner: body.owner
        });

        await  pet.save();
        return "ok"
    }

    async update (req){
        await Pet.updateOne({name: req.params.id}, req.body);
        return "updated";
    }

    async del(name){
        await Pet.deleteOne({name});
        return "deleted"
    }

    async getPet (name) {
        return await Pet.find({name}).populate('owner').select('name');
    }

    async getAllPets (){
        return await Pet.find({}).populate('owner');
    }

}

module.exports = new Services;

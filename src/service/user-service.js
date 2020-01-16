const User = require('../model/user');

class Services {

    async add (body) {
        const user = new User({
            name: body.name,
            surname: body.surname,
            email: body.email
        });
        await  user.save();
        return "ok"
    }
    
    async update (req){
            return await User.findByIdAndUpdate(req.params.id, req.body);
    }
    
    async del(id){
        return await User.findByIdAndDelete(id);
    }
    
    async getUser (id) {
        return await User.findById(id);
    }
    
    async getAllUsers (){
        return await User.find({});
    }
}

module.exports = new Services;

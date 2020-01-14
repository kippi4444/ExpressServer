const User = require('../model/user');
const fs = require('fs');


class Services {
    constructor(){
        this.rawdata = fs.readFileSync('users/users.json');
        this.users = JSON.parse(this.rawdata);
    }

    async save () {
        let toJson = JSON.stringify(this.users);
        fs.writeFileSync('users/users.json', toJson);
    }
    
    async add (body) {
        const user = new User(body)
        this.users.push(user);
        this.save();
        return "ok"
    }
    
    async update (req){
        this.users.splice(req.params.id, 1, req.body)
        this.save();
        return "UPDATED"
    }
    
    async del(id){
        let kick = this.users.splice(id, 1);
        this.save();
        return `User ${JSON.stringify(kick)} was delited!`
    }
    
    async getUser (id) {
        if(this.users[id]) {
            return await this.users[id];
        }else  return "ERROR: USER NOT FOUND";
       
    }
    
    async getAllUsers (){
        const result = this.users;
        return result
    }
}

module.exports = new Services

class User {
    constructor(body){
        this.id = body.id;
        this.name = body.name;
        this.email = body.email;
        this.surname = body.surname;
    }

}

module.exports = User
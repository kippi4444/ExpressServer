const User = require('../model/user');
const fs = require('fs');

let rawdata = fs.readFileSync('users/users.json');
let users = JSON.parse(rawdata);



const add = async function (body) {
    const user = new User(body)
    users.push(user);
    let toJson = JSON.stringify(users);
    fs.writeFileSync('users/users.json', toJson);
    return {user}  
}

const update = async function(req){
    return await users[body.id]
}

const del = async function(id){
    let kick = users.splice(id, 1);
    let toJson = JSON.stringify(users);
    fs.writeFileSync('users/users.json', toJson);
    return await kick
}

const getUser = async function(id) {
    return await users[id]
}

const getAllUsers = async function(){

    
    const result = users;
    return result
}


module.exports = {
    add,
    update,
    del,
    getUser,
    getAllUsers
}
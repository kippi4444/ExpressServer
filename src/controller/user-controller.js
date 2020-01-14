const service = require('../service/user-service')
class UserController {
    constructor(){}
    addUser = async (req, res) => {
        try {
            const result = await service.add(req.body)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }
    deleteUser = async (req, res) => {
        try {
            const result = await service.del(req.params.id)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }
    updateUser = async (req, res) => {
        try {
            const result = await service.update(req.body)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getUser = async (req, res) => {
        try {
            console.log(req)
            const result = await service.getUser(req.params.id)
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }
    

    getAllUsers = async (req, res) => {           
        try {
            const result = await service.getAllUsers(req.body)
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }
    
}

module.exports = UserController;
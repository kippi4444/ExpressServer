const service = require('../services/user-service');
class UserController {

    addUser = async (req, res) => {
        try {

            const result = await service.add(req.body);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const result = await service.del(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    updateUser = async (req, res) => {
        try {
            const result = await service.update(req);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    updateUserByAdmin = async (req, res) => {
        try {
            const result = await service.updateByAdmin(req);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getUser = async (req, res) => {
        try {
            const result = await service.getUser(req);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getAllUsers = async (req, res) => {           
        try {
            const result = await service.getAllUsers(req);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getUserAll = async (req, res) => {
        try {
            const result = await service.getUserAll(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getMe = async (req, res) => {
        try {
            const result = await service.getUserAll(req.user.login);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    loginUser = async (req, res) => {
        try {
            const result = await service.login(req.body.login, req.body.password);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message);
        }
    };


    logoutUser = async (req, res) => {
        try {
            const result = await service.logout(req);
            res.status(200).send({responce: "successfully logout"});
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    };

    getAllUsersHavePets = async (req, res) => {
        try {
            const result = await service.getAllUsersHavePets();
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    };
    
}

module.exports = UserController;

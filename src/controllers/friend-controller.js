const service = require('../services/friend-service');
class FriendController {

    add = async (req, res) => {
        try {

            const result = await service.add(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    delReq = async (req, res) => {
        try {
            const result = await service.delReq(req.params.id);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    delFriend = async (req, res) => {
        try {
            const result = await service.delFriend(req.params.id);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    getAllReq = async (req, res) => {
        try {
            const result = await service.getAllReq(req.user);
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    getAllFriends = async (req, res) => {
        try {
            const result = await service.getAllFriends(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    };

}

module.exports = FriendController;

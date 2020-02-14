
const service = require('../services/photo-service');
class PhotoController {

    add = async (req, res) => {
        try {
            const result = await service.add(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };


    setAvatar = async (req, res) => {
        try {
            const result = await service.setAvatarUsers(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    delete = async (req, res) => {
        try {
            const result = await service.del(req.params.id);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    update = async (req, res) => {
        try {
            const result = await service.update(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    upload = async (req, res) => {
        try {

            const result = await service.upload(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    getPhoto = async (req, res) => {
        try {

            const result = await service.getPhoto(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    getAllPhotos = async (req, res) => {
        try {
            const result = await service.getAllPhotos(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    };

}

module.exports = PhotoController;

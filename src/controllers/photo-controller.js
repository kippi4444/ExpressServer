
const service = require('../services/photo-service');
class PhotoController {

    add = async (req, res) => {
        try {
            const result = await service.add(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    addWallPhoto = async (req, res) => {
        try {
            const result = await service.addWallPhoto(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };


    setAvatar = async (req, res) => {
        try {
            const result = await service.setAvatarUsers(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    changeAvatar = async (req, res) => {
        try {
            const result = await service.changeAvatarUser(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };


    delete = async (req, res) => {
        try {
            const result = await service.del(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    update = async (req, res) => {
        try {
            const result = await service.updPhoto(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    getPhoto = async (req, res) => {
        try {

            const result = await service.getPhoto(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    getAllPhotos = async (req, res) => {
        try {
            const result = await service.getAllPhotos(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

}

module.exports = PhotoController;

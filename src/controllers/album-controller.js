const service = require('../services/album-service');
class AlbumController {

    add = async (req, res) => {
        try {

            const result = await service.add(req.body);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    delete = async (req, res) => {
        try {
            const result = await service.del(req.params.id);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    update = async (req, res) => {
        try {
            const result = await service.update(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };


    getAlbum = async (req, res) => {
        try {

            const result = await service.getAlbum(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    getAllAlbums = async (req, res) => {
        try {
            const result = await service.getAllAlbums(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

}

module.exports = AlbumController;

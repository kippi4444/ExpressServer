const service = require('../services/pet-service');
class PetController {

    add = async (req, res) => {
        try {

            const result = await service.add(req.body);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    delete = async (req, res) => {
        try {
            const result = await service.del(req.params.id);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    update = async (req, res) => {
        try {
            const result = await service.update(req);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    };

    getPet = async (req, res) => {
        try {
            const result = await service.getPet(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

    getAllPets = async (req, res) => {
        try {
            const result = await service.getAllPets();
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    };

}

module.exports = PetController;

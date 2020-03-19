const service = require('../services/dialog-message-service');

class DialogController {

    addDialog = async (req, res) => {
        try {

            const result = await service.addDialog(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    addMes = async (req, res) => {
        try {

            const result = await service.addMes(req.body);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    deleteDialog = async (req, res) => {
        try {
            const result = await service.delDialog(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    deleteMes = async (req, res) => {
        try {
            const result = await service.delMes(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    updateDialog = async (req, res) => {
        try {

            const result = await service.editDialog(req);
            res.status(201).send(JSON.stringify(result))
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    updateMes = async (req, res) => {
        try {

            const result = await service.editMes(req.params.id);
            res.send(result)
        } catch (e) {
            res.status(400).send(e.message)
        }
    };

    getDialog = async (req, res) => {
        try {
            const result = await service.getDialog(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getAllDialogs = async (req, res) => {
        try {
            const result = await service.getDialogs(req.user._id);
            res.send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    };

    getAllMes = async (req, res) => {
        try {
            const result = await service.getMessages(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    };


}

module.exports = DialogController;

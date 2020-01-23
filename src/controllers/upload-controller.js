const service = require('../services/upload-service');

class uploadController {
    uploadFile = async (req, res) => {
        console.log(req)
        try {
            const result = await service.upload(req);
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    };

}

module.exports = uploadController;

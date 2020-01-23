const express = require('express');
const uploadController = require('../controllers/upload-controller');
const upload_Controller = new uploadController;
const multer  = require("../middleware/multerStorage");
const router = new express.Router();


router.post("/", multer, upload_Controller.uploadFile);

module.exports = router;

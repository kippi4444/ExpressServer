const express = require('express');
const uploadController = require('../controllers/upload-controller');
const upload_Controller = new uploadController;
const multer  = require("multer");
const router = new express.Router();

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public");
    },
    filename: (req, file, cb) =>{
        cb(null,  Date.now()+"-"+file.originalname);
    }
});

router.post("/",multer({storage:storageConfig}).single("filedata"), upload_Controller.uploadFile);

module.exports = router;

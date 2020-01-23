const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public");
    },
    filename: (req, file, cb) =>{
        cb(null,  Date.now()+"-"+file.originalname);
    }
});

module.exports = multer({storage:storageConfig}).single("filedata");


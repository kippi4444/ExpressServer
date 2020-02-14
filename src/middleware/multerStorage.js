const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{

        cb(null, `public/${req.user._id.toString()}`);
    },
    filename: (req, file, cb) =>{
        cb(null,  Date.now()+"-"+file.originalname);
    }
});

// const avatar = multer({storage:storageConfig}).single('avatar');
// const album = multer({storage:storageConfig}).single('album');
// multer({storage:storageConfig}).single('filedata');
module.exports = storageConfig;


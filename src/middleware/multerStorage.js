const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{

        cb(null, `public/${req.user._id.toString()}`);
    },
    filename: (req, file, cb) =>{
        cb(null,  Date.now()+"-"+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};

module.exports = {storageConfig, fileFilter};


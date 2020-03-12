const express = require('express');
const auth = require('../middleware/auth');
const photoController = require('../controllers/photo-controller');
const multer  = require('multer');
const storage  = require("../middleware/multerStorage");
const upload = multer({storage:storage.storageConfig, fileFilter: storage.fileFilter});
const photo_controller = new photoController();
const router = new express.Router();


router.get('/all/:id',  auth, photo_controller.getAllPhotos);
router.get('/:id',  auth, photo_controller.getPhoto);
router.post('/wall',  auth, upload.array(`uploadedImages`, 10), photo_controller.addWallPhoto);
router.post('/:id',  auth, upload.array(`uploadedImages`, 10), photo_controller.add);
router.delete('/:id', auth, photo_controller.delete);
router.put('/upd',  auth, photo_controller.update);
router.put('/avatar',  auth, upload.single('avatar'), photo_controller.setAvatar);
router.put('/change',  auth, photo_controller.changeAvatar);

module.exports = router;

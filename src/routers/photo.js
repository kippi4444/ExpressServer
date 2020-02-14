const express = require('express');
const auth = require('../middleware/auth');
const photoController = require('../controllers/photo-controller');
const multer  = require('multer');
const storage  = require("../middleware/multerStorage");
const upload = multer({storage:storage});
const photo_controller = new photoController();
const router = new express.Router();


router.get('/all/:id',  auth, photo_controller.getAllPhotos);
router.get('/:id',  auth, photo_controller.getPhoto);
router.post('/:id',  auth, upload.array(`uploadedImages`, 10), photo_controller.add);
router.put('/avatar',  auth, upload.single('avatar'), photo_controller.setAvatar);
router.delete('/:id', auth, photo_controller.delete);

module.exports = router;

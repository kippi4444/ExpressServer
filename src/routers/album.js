const express = require('express');
const auth = require('../middleware/auth');
const albumController = require('../controllers/album-controller');
const album_controller = new albumController();
const valid = require('../middleware/validations');
const schemes = require('../middleware/schemes');
const router = new express.Router();

router.get('/all/:id',  auth, album_controller.getAllAlbums);
router.get('/:id',  auth, album_controller.getAlbum);
router.post('/',  auth, valid(schemes.album), album_controller.add);
router.delete('/:id', auth, album_controller.delete);
router.put('/:id/photo', auth, album_controller.update);

module.exports = router;

const express = require('express');
const auth = require('../middleware/auth');
const valid = require('../middleware/validations');
const schemes = require('../middleware/schemes');
const UserController = require('../controllers/user-controller');
const multer  = require('multer');
const storage  = require("../middleware/multerStorage");
const upload = multer({storage:storage});
const user_controller = new UserController();
const router = new express.Router();



router.get('/',  user_controller.getAllUsers);
router.post('/',  valid(schemes.user),  user_controller.addUser);
router.get('/me', auth, user_controller.getMe);
router.get('/:id/all', auth, user_controller.getUserAll);
router.get('/pets', auth, user_controller.getAllUsersHavePets);
router.post('/login',  user_controller.loginUser);
router.get('/logout', auth, user_controller.logoutUser);
router.get('/:login', auth, user_controller.getUser);
router.put('/:id', auth, user_controller.updateUser);
router.put('/update/:id', auth, user_controller.updateUserByAdmin);
router.delete('/:id', auth, user_controller.deleteUser);

module.exports = router;

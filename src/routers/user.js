const express = require('express');
const auth = require('../middleware/auth');
const valid = require('../middleware/validations');
const schemes = require('../middleware/schemes');
const UserController = require('../controllers/user-controller');
const user_controller = new UserController();
const router = new express.Router();

router.get('/', auth, user_controller.getAllUsers);
router.get('/:id/pets', auth, user_controller.getUserPets);
router.get('/pets', auth, user_controller.getAllUsersHavePets);
router.post('/login',  user_controller.loginUser);
router.post('/logout', auth, user_controller.logoutUser);
router.get('/:login', auth, user_controller.getUser);
router.post('/',  valid(schemes.user),  user_controller.addUser);
router.put('/:id', auth, valid(schemes.user), user_controller.updateUser);
router.delete('/:id', user_controller.deleteUser);

module.exports = router;

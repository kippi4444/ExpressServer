const express = require('express');
const auth = require('../middleware/auth');
const FriendController = require('../controllers/friend-controller');
const friend_controller = new FriendController();
const router = new express.Router();

router.get('/requests',  auth, friend_controller.getAllReq);
router.get('/:id',  auth, friend_controller.getAllFriends);
router.post('/', auth, friend_controller.add);
router.delete('/:id',  auth,  friend_controller.delFriend);
router.delete('/requests/:id', auth, friend_controller.delReq);

module.exports = router;

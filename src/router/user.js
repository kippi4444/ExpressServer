const express = require('express')

const UserController = require('../controller/user-controller')
const user_controller = new UserController()

const router = new express.Router()

router.get('/users', user_controller.getAllUsers)
router.get('/users/:id', user_controller.getUser)
router.get('/', function (req, res) {res.send('Hello World!');})
router.post('/users', user_controller.addUser)
router.put('/users/:id', user_controller.updateUser)
router.delete('/users/:id', user_controller.deleteUser)
module.exports = router
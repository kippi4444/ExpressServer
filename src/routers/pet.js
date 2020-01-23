const express = require('express');
const auth = require('../middleware/auth');
const valid = require('../middleware/validations');
const schems = require('../middleware/schems');
const PetController = require('../controllers/pet-controller');
const pet_controller = new PetController();

const router = new express.Router();

router.get('/',  auth, pet_controller.getAllPets);
router.get('/:id',  auth, pet_controller.getPet);
router.post('/', valid(schems.pet), pet_controller.add);
router.put('/:id',  auth, valid(schems.pet), pet_controller.update);
router.delete('/:id', auth, pet_controller.delete);

module.exports = router;

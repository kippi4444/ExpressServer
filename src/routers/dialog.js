const express = require('express');
const auth = require('../middleware/auth');
const dialogController = require('../controllers/dialog-controller');
const dialog_controller = new dialogController();
const valid = require('../middleware/validations');
const schemes = require('../middleware/schemes');
const router = new express.Router();

router.get('/',  auth, dialog_controller.getAllDialogs);
router.get('/:id',  auth, dialog_controller.getDialog);
router.post('/',  auth, valid(schemes.dialog), dialog_controller.addDialog);
router.delete('/:id', auth, dialog_controller.deleteDialog);
router.put('/:id', auth, dialog_controller.updateDialog);

router.get('/mes/:id',  auth, dialog_controller.getAllMes);
router.post('/mes/',  auth, dialog_controller.addMes);
router.delete('/mes/:id', auth, dialog_controller.deleteMes);
router.put('/mes/:id', auth, dialog_controller.updateMes);

module.exports = router;

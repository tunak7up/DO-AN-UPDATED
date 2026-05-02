const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes cho User
router.get('/', userController.getAllUsers);
router.get('/technicians', userController.getTechnicians);
router.get('/shippers', userController.getShippers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/password', userController.changePassword); 

module.exports = router;
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/category/:categoryId', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);

module.exports = router;

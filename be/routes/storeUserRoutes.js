const express = require('express');
const router = express.Router();
const storeUserController = require('../controllers/storeUserController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const ADMIN_ROLES = ['ROLE_ADMIN', 'ROLE_DIRECTOR'];

router.get('/', protect, authorizeRoles(...ADMIN_ROLES, 'ROLE_WAREHOUSE_MANAGER'), storeUserController.getAllStoreUsers);
router.post('/', protect, authorizeRoles(...ADMIN_ROLES), storeUserController.assignUserToStore);
router.delete('/:id', protect, authorizeRoles(...ADMIN_ROLES), storeUserController.removeUserFromStore);

module.exports = router;

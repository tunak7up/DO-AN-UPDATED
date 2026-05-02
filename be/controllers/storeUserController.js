const { StoreUser, Store, User, Role } = require('../models');

const storeUserController = {
  // Lấy danh sách phân công (có thể kèm filter theo store hay user)
  getAllStoreUsers: async (req, res) => {
    try {
      const storeUsers = await StoreUser.findAll({
        include: [
          { model: Store, as: 'store' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
        ]
      });
      res.json({ success: true, data: storeUsers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Gán 1 Warehouse Manager vào 1 Store
  assignUserToStore: async (req, res) => {
    try {
      const { store_id, user_id } = req.body;
      
      const user = await User.findByPk(user_id, {
        include: [{ model: Role, as: 'roles' }]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
      }

      // Check role
      const isWarehouseManager = user.roles.some(r => r.name === 'ROLE_WAREHOUSE_MANAGER');
      if (!isWarehouseManager) {
        return res.status(400).json({ success: false, message: 'Người dùng này không phải là Quản lý kho (ROLE_WAREHOUSE_MANAGER)' });
      }

      const store = await Store.findByPk(store_id);
      if (!store) {
        return res.status(404).json({ success: false, message: 'Cửa hàng không tồn tại' });
      }

      // Check if already assigned
      const existing = await StoreUser.findOne({ where: { store_id, user_id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Người dùng này đã được phân công vào cửa hàng này rồi' });
      }

      const assigned = await StoreUser.create({ store_id, user_id });
      res.status(201).json({ success: true, message: 'Phân quyền phân kho thành công', data: assigned });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Xóa phân công
  removeUserFromStore: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await StoreUser.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin phân quyền' });
      }

      await assignment.destroy();
      res.json({ success: true, message: 'Xóa phân quyền thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = storeUserController;

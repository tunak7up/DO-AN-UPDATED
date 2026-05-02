const { Store, User, Role } = require('../models'); // Lấy Store, User, Role từ models/index.js

// Lấy tất cả cửa hàng
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json({ success: true, data: stores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy các cửa hàng mà user được cấp quyền
exports.getMyStores = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        { model: Role, as: 'roles' },
        { model: Store, as: 'managedStores', through: { attributes: [] } }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const roleNames = user.roles.map(r => r.name);

    // Nếu là Admin hoặc Director thì cho phép nhập vào tất cả các kho
    if (roleNames.includes('ROLE_ADMIN') || roleNames.includes('ROLE_DIRECTOR')) {
      const stores = await Store.findAll();
      return res.json({ success: true, data: stores });
    }

    // Ngược lại chỉ được nhập vào các kho được phân công trong bảng stores_users
    return res.json({ success: true, data: user.managedStores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
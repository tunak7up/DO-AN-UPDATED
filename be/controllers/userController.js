const { User, Role } = require("../models");
const crypto = require("crypto");

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { deleted: 0 },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["password"] },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách Shipper
exports.getShippers = async (req, res) => {
  try {
    const shippers = await User.findAll({
      where: { deleted: 0 },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "ROLE_SHIPPER" },
          attributes: [],
          through: { attributes: [] }
        }
      ],
      attributes: ["id", "name", "email", "phone"]
    });
    res.json({ success: true, data: shippers });
  } catch (error) {
    console.error("Lỗi lấy danh sách shipper:", error);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách người giao hàng." });
  }
};

// Lấy người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, deleted: 0 },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role_id } = req.body;

    // Hash mật khẩu bằng MD5 (giống database)
    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      deleted: 0,
      enabled: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (role_id) {
      const roleId = parseInt(role_id);
      const role = await Role.findByPk(roleId);
      if (role) {
        await user.setRoles([role]);
      }
    }

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findOne({
      where: { id: req.params.id, deleted: 0 },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    await user.update({
      name,
      email,
      phone,
      address,
      updated_at: new Date(),
    });

    // Cập nhật Role nếu có role_id
    if (req.body.role_id) {
      const roleId = parseInt(req.body.role_id);
      const role = await Role.findByPk(roleId);
      if (role) {
        // setRoles là method do Sequelize tự sinh cho quan hệ Many-to-Many
        await user.setRoles([role]);
      }
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa mềm người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, deleted: 0 },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    await user.update({ deleted: 1, updated_at: new Date() });

    res.json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    // 1. Kiểm tra mật khẩu cũ (MD5)
    const hashedOldPassword = crypto
      .createHash("md5")
      .update(oldPassword)
      .digest("hex");
    if (user.password !== hashedOldPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không chính xác" });
    }

    // 2. Hash mật khẩu mới và lưu
    const hashedNewPassword = crypto
      .createHash("md5")
      .update(newPassword)
      .digest("hex");
    await user.update({
      password: hashedNewPassword,
      updated_at: new Date(),
    });

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách kỹ thuật viên (ROLE_TECHNICAL_STAFF)
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.findAll({
      where: { deleted: 0, enabled: 1 },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "ROLE_TECHNICAL_STAFF" },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "name", "email", "phone"],
    });
    res.json({ success: true, data: technicians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

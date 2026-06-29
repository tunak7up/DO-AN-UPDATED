const { User, UserRole, Role } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản Khách hàng (Role ID = 1)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng" });
    }

    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại đã tồn tại" });
      }
    }

    // 2. Hash mật khẩu MD5
    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

    // 3. Tạo User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      deleted: 0,
      enabled: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 4. Lấy ID của ROLE_USER thay vì hardcode
    const defaultRole = await Role.findOne({ where: { name: 'ROLE_USER' } });
    if (defaultRole) {
      await UserRole.create({
        user_id: newUser.id,
        role_id: defaultRole.id,
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công", data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user kèm thông tin Role
    const user = await User.findOne({
      where: { email, deleted: 0, enabled: 1 },
      include: [
        {
          model: Role,
          as: "roles", // Phải khớp với quan hệ trong models/index.js
          through: { attributes: [] }, // Bỏ qua bảng trung gian
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    // 2. Kiểm tra mật khẩu (MD5)
    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    if (user.password !== hashedPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    // 3. Lấy role chính (Ưu tiên lấy ROLE_ADMIN nếu có)
    const roles = user.roles.map((r) => r.name);
    const mainRole = roles.includes("ROLE_ADMIN")
      ? "ROLE_ADMIN"
      : roles[0] || "ROLE_USER";
    const mainRoleId = user.roles.find((r) => r.name === mainRole)?.id;

    // 4. Tạo JWT Token
    const secretKey = process.env.JWT_SECRET || "TECHZONE_SECRET_KEY";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: mainRole },
      secretKey,
      { expiresIn: "24h" }
    );

    // Chuẩn bị data trả về
    const userData = user.toJSON();
    delete userData.password;
    delete userData.roles; // Xóa roles để gọn data
    userData.role_name = mainRole; // Trả về tên role (ROLE_ADMIN hoặc ROLE_USER)
    userData.role_id = mainRoleId;

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

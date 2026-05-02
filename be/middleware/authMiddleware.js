const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secretKey = process.env.JWT_SECRET || "TECHZONE_SECRET_KEY";
      const decoded = jwt.verify(token, secretKey);

      // Lấy thông tin user và vai trò (role) từ findByPk
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ, không tìm thấy người dùng' });
      }

      // Assign role extracted from JWT because Sequelize User model does not have role column
      req.user.role = decoded.role;

      next();
    } catch (error) {
      console.error('Error in protect middleware:', error.message, 'Token received:', token);
      res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Không tìm thấy token. Vui lòng đăng nhập.' });
  }
};

// Middleware kiểm tra quyền Admin (ROLE_ADMIN)
// Khoá mặc định cho Admin toàn quyền (Chỉ ROLE_ADMIN mới qua được)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ROLE_ADMIN') { 
    next();
  } else {
    res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập (Chỉ Admin)' });
  }
};

// Middleware kiểm tra quyền RBAC động
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
    }

    // Role Admin mặc định luôn có quyền vào tất cả các Route cấu hình RBAC (Trừ phân đoạn code chặn riêng)
    if (req.user.role === 'ROLE_ADMIN') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Vai trò của bạn không được phép sử dụng chức năng này' });
  };
};

module.exports = { protect, admin, authorizeRoles };
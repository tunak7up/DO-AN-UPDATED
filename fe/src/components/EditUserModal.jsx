import React, { useState, useEffect } from "react";

const ROLES = [
  { id: 2, name: "ROLE_CASHIER", desc: "Phụ trách thanh toán và hóa đơn" },
  {
    id: 3,
    name: "ROLE_WAREHOUSE_MANAGER",
    desc: "Quản lý hàng tồn kho và nhập xuất",
  },
  {
    id: 5,
    name: "ROLE_TECHNICAL_STAFF",
    desc: "Xử lý kỹ thuật và bảo trì thiết bị",
  },
  { id: 6, name: "ROLE_SHIPPER", desc: "Giao hàng đến khách" },
  { id: 7, name: "ROLE_SALES_STAFF", desc: "Tư vấn và bán sản phẩm cho khách" },
  {
    id: 8,
    name: "ROLE_CUSTOMER_SERVICE",
    desc: "Nhân viên chăm sóc khách hàng",
  },
  { id: 9, name: "ROLE_ADMIN", desc: "Quản trị hệ thống toàn quyền" },
  {
    id: 10,
    name: "ROLE_DIRECTOR",
    desc: "Quản lý toàn bộ hoạt động kinh doanh",
  },
  {
    id: 11,
    name: "ROLE_USER",
    desc: "Vai trò mặc định cho khách hàng",
  },
  {
    id: 12,
    name: "ROLE_ORDER_MANAGER",
    desc: "Người phụ trách quản lý đơn hàng chuyên sâu",
  },
];

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role_id: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        // Lấy role đầu tiên nếu có, hoặc mặc định
        role_id: user.roles && user.roles.length > 0 ? user.roles[0].id : 11,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user, // Giữ lại id
      ...formData,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Phân quyền / Sửa thông tin</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Vai trò (Role):</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            >
              {ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} - {role.desc}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

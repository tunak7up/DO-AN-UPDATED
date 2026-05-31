import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";



function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      // Gọi API update
      const res = await axios.put(`${API_URL}/users/${updatedUser.id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role_id: updatedUser.role_id, // Gửi role_id lên server
      });

      if (res.data.success) {
        alert("Cập nhật thành công!");
        setEditingUser(null);
        fetchUsers(); // Tải lại danh sách để cập nhật role hiển thị
      }
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <i className="fas fa-users-cog"></i> Quản Lý Phân Quyền Nhân Viên
        </h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò (Role)</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Đang tải...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không tìm thấy user nào.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.roles && user.roles.length > 0 ? (
                      <span className="role-badge">{user.roles[0].name}</span>
                    ) : (
                      <span style={{ color: "#999" }}>Chưa phân quyền</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit-details"
                      onClick={() => handleEditClick(user)}
                      title="Phân quyền / Sửa"
                    >
                      <i
                        className="fas fa-user-edit"
                        style={{ color: "#3498db" }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />
    </div>
  );
}

export default UserManagePage;

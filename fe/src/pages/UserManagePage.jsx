import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";
import AddUserModal from "../components/AddUserModal";

function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Staff"); // "Staff" or "Customer"

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

  // Filter users by tab and search
  const filteredUsers = users.filter((user) => {
    const isCustomer = user.roles && user.roles.some((r) => r.name === "ROLE_USER");
    if (activeTab === "Staff" && isCustomer) return false;
    if (activeTab === "Customer" && !isCustomer) return false;

    const searchMatch =
      user.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterSearch.toLowerCase());
    return searchMatch;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <i className="fas fa-users-cog"></i> Quản Lý Phân Quyền Nhân Viên
        </h1>
        <div className="header-actions" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
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
          <button 
            className="btn-add" 
            onClick={() => setIsAddingUser(true)}
            style={{ padding: "8px 15px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            <i className="fas fa-plus"></i> Tạo nhân viên mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setActiveTab("Staff")}
          style={{
            padding: "10px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "Staff" ? "3px solid #3498db" : "3px solid transparent",
            color: activeTab === "Staff" ? "#3498db" : "#666",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          Nhân viên
        </button>
        <button
          onClick={() => setActiveTab("Customer")}
          style={{
            padding: "10px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "Customer" ? "3px solid #3498db" : "3px solid transparent",
            color: activeTab === "Customer" ? "#3498db" : "#666",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          Khách hàng
        </button>
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

      <AddUserModal
        isOpen={isAddingUser}
        onClose={() => setIsAddingUser(false)}
        onSuccess={() => {
          setIsAddingUser(false);
          fetchUsers();
        }}
      />
    </div>
  );
}

export default UserManagePage;

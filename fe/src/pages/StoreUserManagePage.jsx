import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



function StoreUserManagePage() {
  const [storeUsers, setStoreUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const { token, user } = useAuth(); // Assume we get user to check if they have permission to view

  useEffect(() => {
    fetchData();
  }, []);

  const getHeaders = () => {
    const currentToken = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${currentToken}` } };
  };

  const fetchData = async () => {
    try {
      const [suRes, uRes, stRes] = await Promise.all([
        axios.get(`${API_URL}/store-users`, getHeaders()),
        axios.get(`${API_URL}/users`, getHeaders()), // You might need a specific endpoint to only fetch WAREHOUSE managers, but let's fetch all users for now and filter logically
        axios.get(`${API_URL}/stores`, getHeaders())
      ]);

      if (suRes.data.success) setStoreUsers(suRes.data.data);
      if (stRes.data.success) setStores(stRes.data.data);
      
      // Lọc ra những user có role ROLE_WAREHOUSE_MANAGER (Giả lập filter phía client, hoặc gọi API GET /api/users/warehouse)
      if (uRes.data.success) {
        // Tạm thời nếu user backend trả về roles thì ta filter:
        const whManagers = uRes.data.data.filter(u => u.roles?.some(r => r.name === 'ROLE_WAREHOUSE_MANAGER') || u.role_name === 'ROLE_WAREHOUSE_MANAGER');
        setUsers(whManagers.length > 0 ? whManagers : uRes.data.data); // Fallback to all if roles not fully populated in users
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedStore) return alert('Vui lòng chọn thủ kho và cửa hàng');

    try {
      await axios.post(`${API_URL}/store-users`, {
        user_id: selectedUser,
        store_id: selectedStore
      }, getHeaders());
      alert('Phân công thành công!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ phân công này?')) return;
    try {
      await axios.delete(`${API_URL}/store-users/${id}`, getHeaders());
      alert('Xoá phân quyền thành công!');
      fetchData();
    } catch (err) {
      alert('Lỗi xoá phân quyền');
    }
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1><i className="fas fa-warehouse"></i> Phân Quản Lý Kho</h1>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Thêm Phân Công Mới</h3>
        <form onSubmit={handleAssign} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Quản lý kho (Role WAREHOUSE_MANAGER)</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} style={{ width: '100%', padding: '10px' }} required>
              <option value="">-- Chọn quản lý --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Cơ sở (Store)</label>
            <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} style={{ width: '100%', padding: '10px' }} required>
              <option value="">-- Chọn cơ sở --</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.address}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              <i className="fas fa-plus"></i> Phân Công
            </button>
          </div>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID Phân công</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Cơ Sở (Store)</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nhân sự Quản lý</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {storeUsers.map(su => (
            <tr key={su.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{su.id}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{su.store?.name}</td>
              <td style={{ padding: '12px' }}>{su.user?.name} - {su.user?.phone}</td>
              <td style={{ padding: '12px' }}>
                <button 
                  onClick={() => handleRemove(su.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <i className="fas fa-trash"></i> Gỡ phân công
                </button>
              </td>
            </tr>
          ))}
          {storeUsers.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu phân công</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StoreUserManagePage;

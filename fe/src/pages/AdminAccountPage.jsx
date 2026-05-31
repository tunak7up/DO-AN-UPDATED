import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL, BASE_URL } from '../api.js';


function AdminAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State quản lý Tab đang chọn (profile, password)
  const [activeTab, setActiveTab] = useState('profile');
  
  // State dữ liệu
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  
  // State đổi mật khẩu
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Load dữ liệu khi vào trang
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    // Load thông tin mới nhất của user
    axios.get(`${API_URL}/users/${user.id}`, { headers })
      .then(res => {
        if(res.data.success) {
            const { name, email, phone, address } = res.data.data;
            setProfile({ name, email, phone, address });
        }
      })
      .catch(err => console.error(err));

  }, [user, navigate]);

  // --- XỬ LÝ CẬP NHẬT HỒ SƠ ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      // Gửi thông tin cần cập nhật (không gửi role)
      const res = await axios.put(`${API_URL}/users/${user.id}`, profile, { headers });
      if (res.data.success) {
        alert("Cập nhật thông tin thành công!");
        // Cập nhật lại localStorage để các trang khác nhận diện
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  // --- XỬ LÝ ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.put(`${API_URL}/users/${user.id}/password`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      }, { headers });
      
      if (res.data.success) {
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        logout(); 
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="account-layout">
        
        {/* --- SIDEBAR MENU --- */}
        <div className="account-sidebar">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#3498db', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 10px' }}>
              <i className="fas fa-user-shield"></i>
            </div>
            <h3 style={{ margin: 0 }}>{profile.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{user.role_name || user.role}</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li 
              onClick={() => setActiveTab('profile')}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', background: activeTab === 'profile' ? '#f0f9ff' : 'transparent', color: activeTab === 'profile' ? '#3498db' : '#333', marginBottom: '5px' }}
            >
              <i className="fas fa-id-card" style={{ width: '25px' }}></i> Thông tin tài khoản
            </li>
            <li 
              onClick={() => setActiveTab('password')}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', background: activeTab === 'password' ? '#f0f9ff' : 'transparent', color: activeTab === 'password' ? '#3498db' : '#333', marginBottom: '5px' }}
            >
              <i className="fas fa-key" style={{ width: '25px' }}></i> Đổi mật khẩu
            </li>
          </ul>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="account-content">
          
          {/* TAB 1: THÔNG TIN TÀI KHOẢN */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Thông tin tài khoản Admin</h2>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Họ và tên</label>
                <input 
                  type="text" className="form-control" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Email (Không thể thay đổi)</label>
                <input 
                  type="email" className="form-control" 
                  value={profile.email} disabled 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#f5f5f5' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Số điện thoại</label>
                <input 
                  type="text" className="form-control" 
                  value={profile.phone || ''} 
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Địa chỉ</label>
                <input 
                  type="text" className="form-control" 
                  value={profile.address || ''} 
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <button type="submit" className="btn-submit" style={{ padding: '10px 25px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Lưu thay đổi
              </button>
            </form>
          )}

          {/* TAB 2: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword}>
              <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Đổi mật khẩu</h2>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Mật khẩu hiện tại</label>
                <input 
                  type="password" required
                  value={passwords.oldPassword}
                  onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Mật khẩu mới</label>
                <input 
                  type="password" required minLength="6"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Xác nhận mật khẩu mới</label>
                <input 
                  type="password" required
                  value={passwords.confirmPassword}
                  onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <button type="submit" className="btn-submit" style={{ padding: '10px 25px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Cập nhật mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAccountPage;

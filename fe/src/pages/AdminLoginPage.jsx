import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi hàm login chung
      const result = await login(email, password);
      
      if (result.success) {
        // 2. KIỂM TRA QUYỀN ADMIN NGAY TẠI ĐÂY
        // Lấy user từ localStorage vì state context có thể chưa cập nhật kịp
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        // Cho phép các nhân sự có Role liên quan đến quản lý truy cập
        const adminRoles = [
          'ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_CASHIER', 
          'ROLE_WAREHOUSE_MANAGER', 'ROLE_ORDER_MANAGER', 
          'ROLE_TECHNICAL_STAFF', 'ROLE_SALES_STAFF', 'ROLE_CUSTOMER_SERVICE', 'ROLE_SHIPPER'
        ];
        
        if (storedUser && (adminRoles.includes(storedUser.role_name) || adminRoles.includes(storedUser.role))) {
          // Đúng là Nhân sự / Admin -> Vào trang quản trị
          const role = storedUser.role_name || storedUser.role;
          if (role === 'ROLE_SHIPPER') {
            navigate('/admin/shipper');
          } else {
            navigate('/admin'); 
          }
        } else {
          // Không phải Admin/Staff -> Đăng xuất ngay lập tức và báo lỗi
          logout(); 
          setError('Bạn không có quyền truy cập trang quản trị!');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', 
      background: '#2c3e50' // Màu nền tối cho Admin
    }}>
      <div style={{ 
        width: '100%', maxWidth: '400px', padding: '40px', 
        background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className="fas fa-user-shield" style={{ fontSize: '50px', color: '#2c3e50' }}></i>
          <h2 style={{ marginTop: '10px', color: '#333' }}>Admin Portal</h2>
          <p style={{ color: '#666' }}>Đăng nhập hệ thống quản trị</p>
        </div>
        
        {error && (
          <div style={{ 
            color: '#721c24', background: '#f8d7da', padding: '10px', 
            borderRadius: '4px', marginBottom: '20px', textAlign: 'center', border: '1px solid #f5c6cb' 
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#f9f9f9' }}>
              <i className="fas fa-envelope" style={{ color: '#888', marginRight: '10px' }}></i>
              <input 
                type="email" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techzone.vn"
                style={{ width: '100%', border: 'none', outline: 'none', padding: '12px 0', background: 'transparent' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mật khẩu</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#f9f9f9' }}>
              <i className="fas fa-lock" style={{ color: '#888', marginRight: '10px' }}></i>
              <input 
                type="password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={{ width: '100%', border: 'none', outline: 'none', padding: '12px 0', background: 'transparent' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: '#2c3e50', color: 'white', 
              border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '16px', fontWeight: 'bold', transition: '0.3s'
            }}
          >
            {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
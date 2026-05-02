import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp!');
    }
    if (formData.password.length < 6) {
      return setError('Mật khẩu phải có ít nhất 6 ký tự.');
    }

    setLoading(true);

    try {
      // Gọi hàm register từ Context
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });

      if (result.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
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
    <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
      <div className="auth-box" style={{ width: '100%', maxWidth: '500px', padding: '30px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', borderRadius: '8px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Đăng Ký Tài Khoản</h2>
        
        {error && <div className="alert-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Họ và tên</label>
            <input 
              type="text" name="name" required 
              placeholder="Nhập họ tên đầy đủ"
              value={formData.name} onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input 
              type="email" name="email" required 
              placeholder="Nhập địa chỉ email"
              value={formData.email} onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Số điện thoại</label>
            <input 
              type="tel" name="phone" required 
              placeholder="Nhập số điện thoại"
              value={formData.phone} onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Địa chỉ</label>
            <input 
              type="text" name="address" required 
              placeholder="Nhập địa chỉ nhận hàng mặc định"
              value={formData.address} onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: '15px', flex: 1 }}>
              <label>Mật khẩu</label>
              <input 
                type="password" name="password" required 
                placeholder="Tạo mật khẩu"
                value={formData.password} onChange={handleChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px', flex: 1 }}>
              <label>Nhập lại mật khẩu</label>
              <input 
                type="password" name="confirmPassword" required 
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword} onChange={handleChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '12px', background: '#3498db', color: 'white', 
              border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' 
            }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Đã có tài khoản? <Link to="/login" style={{ color: '#3498db', fontWeight: 'bold' }}>Đăng nhập ngay</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
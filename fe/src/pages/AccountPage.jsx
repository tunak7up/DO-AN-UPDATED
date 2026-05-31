import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



// Hàm format tiền tệ
const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State quản lý Tab đang chọn (profile, password, orders)
  const [activeTab, setActiveTab] = useState('profile');
  
  // State dữ liệu
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Quản lý modal chi tiết đơn
  
  // State đổi mật khẩu
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Load dữ liệu khi vào trang
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    // 1. Load thông tin mới nhất của user
    axios.get(`${API_URL}/users/${user.id}`, { headers })
      .then(res => {
        if(res.data.success) {
            const { name, email, phone, address } = res.data.data;
            setProfile({ name, email, phone, address });
        }
      })
      .catch(err => console.error(err));

    // 2. Load lịch sử đơn hàng
    axios.get(`${API_URL}/orders/user/${user.id}`, { headers })
      .then(res => {
        if(res.data.success) setOrders(res.data.data);
      })
      .catch(err => console.error(err));

  }, [user, navigate]);

  // --- XỬ LÝ CẬP NHẬT HỒ SƠ ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.put(`${API_URL}/users/${user.id}`, profile, { headers });
      if (res.data.success) {
        alert("Cập nhật thông tin thành công!");
        // Cập nhật lại localStorage để các trang khác nhận diện (nếu cần)
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  // --- XỬ LÝ HỦY ĐƠN HÀNG ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, { headers });
      if (res.data.success) {
        alert("Hủy đơn hàng thành công!");
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
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
        logout(); // Đăng xuất để user đăng nhập lại với pass mới
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* --- SIDEBAR MENU --- */}
        <div style={{ width: '250px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#3498db', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 10px' }}>
              <i className="fas fa-user"></i>
            </div>
            <h3 style={{ margin: 0 }}>{profile.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{profile.email}</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li 
              onClick={() => setActiveTab('profile')}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', background: activeTab === 'profile' ? '#f0f9ff' : 'transparent', color: activeTab === 'profile' ? '#3498db' : '#333', marginBottom: '5px' }}
            >
              <i className="fas fa-id-card" style={{ width: '25px' }}></i> Thông tin tài khoản
            </li>
            <li 
              onClick={() => setActiveTab('orders')}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', background: activeTab === 'orders' ? '#f0f9ff' : 'transparent', color: activeTab === 'orders' ? '#3498db' : '#333', marginBottom: '5px' }}
            >
              <i className="fas fa-clipboard-list" style={{ width: '25px' }}></i> Lịch sử đơn hàng
            </li>
            <li 
              onClick={() => setActiveTab('password')}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', background: activeTab === 'password' ? '#f0f9ff' : 'transparent', color: activeTab === 'password' ? '#3498db' : '#333', marginBottom: '5px' }}
            >
              <i className="fas fa-key" style={{ width: '25px' }}></i> Đổi mật khẩu
            </li>
            <li 
              onClick={logout}
              style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', color: '#e74c3c', marginTop: '10px', borderTop: '1px solid #eee' }}
            >
              <i className="fas fa-sign-out-alt" style={{ width: '25px' }}></i> Đăng xuất
            </li>
          </ul>
        </div>

        {/* --- CONTENT AREA --- */}
        <div style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          
          {/* TAB 1: THÔNG TIN TÀI KHOẢN */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Thông tin tài khoản</h2>
              
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

          {/* TAB 3: LỊCH SỬ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lịch sử đơn hàng</h2>
              {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                      <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Mã đơn</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Ngày đặt</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Tổng tiền</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Trạng thái</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>#{order.id}</td>
                        <td style={{ padding: '12px 10px' }}>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                        <td style={{ padding: '12px 10px', color: '#e74c3c', fontWeight: 'bold' }}>{formatCurrency(order.total_amount)}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                            background: order.status === 'Completed' ? '#eafaf1' : (order.status === 'Cancelled' ? '#fde2e2' : '#fff3cd'),
                            color: order.status === 'Completed' ? '#2ecc71' : (order.status === 'Cancelled' ? '#e74c3c' : '#f39c12')
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            style={{ padding: '5px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '5px' }}
                          >
                            Chi tiết
                          </button>
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              style={{ padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Hủy đơn
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '15px', fontSize: '14px' }}>
              <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.order_date).toLocaleString('vi-VN')}</p>
              <p><strong>Địa chỉ giao:</strong> {selectedOrder.shipping_address}</p>
              <p><strong>Ghi chú:</strong> {selectedOrder.notes || 'Không có'}</p>
              <p><strong>Tổng tiền:</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{formatCurrency(selectedOrder.total_amount)}</span></p>
            </div>

            <h4 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Sản phẩm đã mua:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {selectedOrder.items && selectedOrder.items.map((item, index) => (
                <li key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                  <img src={item.product?.thumbnail?.startsWith('http') ? item.product.thumbnail : `${BASE_URL}${item.product?.thumbnail}`} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }} />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>
                      <a href={`/product/${item.product?.id}`} target="_blank" rel="noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                        {item.product?.title || 'Sản phẩm'}
                      </a>
                    </h5>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '13px' }}>Đơn giá: {formatCurrency(item.price_at_order)}</p>
                    <p style={{ margin: 0, color: '#333', fontWeight: 'bold', fontSize: '13px' }}>Số lượng: x{item.quantity}</p>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                    {formatCurrency(item.price_at_order * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

export default AccountPage;
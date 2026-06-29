import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';



// Hàm format tiền tệ
const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

// Hàm lấy màu sắc cho trạng thái đơn hàng
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending": return "status-badge pending"; // Vàng
    case "Processing": return "status-badge in-progress"; // Xanh dương
    case "Shipping": return "status-badge shipping"; // Tím/Cam
    case "Completed": return "status-badge completed"; // Xanh lá
    case "Cancelled": return "status-badge cancelled"; // Đỏ
    default: return "status-badge";
  }
};

// Hàm lấy màu sắc cho trạng thái thanh toán
const getPaymentStatusBadgeClass = (status) => {
  return status === "Paid" ? "status-badge completed" : "status-badge pending";
};

function OrderManagePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  
  // State cho Modal xem chi tiết
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State tạm để cập nhật trong modal
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [orderHistories, setOrderHistories] = useState([]);
  
  // State quản lý Shipper
  const [shippers, setShippers] = useState([]);
  const [assigningShipper, setAssigningShipper] = useState("");

  const { user } = useAuth();
  const userRole = user?.role || user?.role_name || 'ROLE_ADMIN';

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  useEffect(() => {
    fetchOrders();
    fetchShippers();
  }, []);

  const fetchShippers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/shippers`, getHeaders());
      if (res.data.success) {
        setShippers(res.data.data);
      }
    } catch (err) {
      console.log("Lỗi tải shipper:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`, getHeaders());
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.payment_status);
    setAssigningShipper(order.shipper_id || "");
    setShowModal(true);
    
    // Gán history tạm rỗng khi mở loading
    setOrderHistories([]);
    try {
       const res = await axios.get(`${API_URL}/orders/${order.id}/history`, getHeaders());
       if (res.data.success) {
         setOrderHistories(res.data.data);
       }
    } catch(err) {
       console.log('Lỗi lấy lịch sử:', err);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      await axios.put(`${API_URL}/orders/${selectedOrder.id}`, {
        status: editStatus,
        payment_status: editPaymentStatus
      }, getHeaders());
      
      // Gán shipper nếu có thay đổi
      if (assigningShipper && assigningShipper !== selectedOrder.shipper_id) {
        await axios.put(`${API_URL}/orders/${selectedOrder.id}/assign`, {
          shipper_id: assigningShipper
        }, getHeaders());
      }
      
      alert("Cập nhật đơn hàng thành công!");
      fetchOrders(); // Tải lại danh sách
      
      // Tải lại lịch sử để cập nhật modal
      try {
        const res = await axios.get(`${API_URL}/orders/${selectedOrder.id}/history`, getHeaders());
        if (res.data.success) {
          setOrderHistories(res.data.data);
        }
      } catch(err) {
        console.log('Lỗi lấy lịch sử:', err);
      }
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => 
    filterStatus === "All" ? true : order.status === filterStatus
  );

  // Sử dụng trực tiếp OrderHistory
  const combinedHistories = [...orderHistories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-shopping-bag"></i> Quản Lý Đơn Hàng</h1>
        <div className="header-actions">
          <div className="filter-dropdown">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">Tất cả đơn hàng</option>
              <option value="Pending">Chờ xử lý (Pending)</option>
              <option value="Processing">Đang chuẩn bị (Processing)</option>
              <option value="Shipping">Đang giao (Shipping)</option>
              <option value="Completed">Hoàn thành (Completed)</option>
              <option value="Cancelled">Đã hủy (Cancelled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Tổng đơn hàng</div>
          <div className="stat-icon"><i className="fas fa-list"></i></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{orders.filter(o => o.status === 'Pending').length}</div>
          <div className="stat-label">Chờ xử lý</div>
          <div className="stat-icon pending"><i className="fas fa-clock"></i></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(orders.reduce((sum, o) => sum + o.total_amount, 0))}</div>
          <div className="stat-label">Doanh thu</div>
          <div className="stat-icon completed"><i className="fas fa-money-bill-wave"></i></div>
        </div>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Không tìm thấy đơn hàng nào.</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{fontWeight: '500'}}>{order.receiver_name}</div>
                    <div style={{fontSize: '12px', color: '#666'}}>{order.shipping_phone}</div>
                  </td>
                  <td style={{fontWeight: 'bold', color: '#e74c3c'}}>
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td>
                    <span className={getPaymentStatusBadgeClass(order.payment_status)}>
                      {order.payment_status === 'Paid' ? 'Đã thanh toán' : 'Chưa TT'}
                    </span>
                    <div style={{fontSize: '11px', marginTop: '2px'}}>{order.payment_method}</div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-detail" 
                      onClick={() => handleViewDetail(order)}
                      title="Xem chi tiết & Cập nhật"
                    >
                      <i className="fas fa-eye"></i> Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === MODAL CHI TIẾT ĐƠN HÀNG === */}
      {showModal && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ 
            background: 'white', padding: '25px', borderRadius: '8px', 
            width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' 
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}><i className="fas fa-times"></i></button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
              {/* Cột trái: Thông tin giao hàng */}
              <div>
                <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>
                  <i className="fas fa-truck"></i> Thông tin giao hàng
                </h3>
                <div style={{background: '#f9f9f9', padding: '15px', borderRadius: '5px', fontSize: '14px'}}>
                  <p><strong>Người nhận:</strong> {selectedOrder.receiver_name}</p>
                  <p><strong>SĐT:</strong> {selectedOrder.shipping_phone}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>
                  <p><strong>Khu vực:</strong> {selectedOrder.shipping_district}, {selectedOrder.shipping_city}</p>
                  <p><strong>Ghi chú:</strong> {selectedOrder.notes || 'Không có'}</p>
                </div>
              </div>

              {/* Cột phải: Cập nhật trạng thái */}
              <div>
                <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>
                  <i className="fas fa-edit"></i> Cập nhật trạng thái
                </h3>
                <div style={{background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '5px'}}>
                  <div className="form-group" style={{marginBottom: '10px'}}>
                    <label>Trạng thái đơn hàng:</label>
                    <select 
                      style={{width: '100%', padding: '8px', marginTop: '5px'}}
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      disabled={['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER'].includes(userRole)}
                    >
                      <option value="Pending">Pending (Chờ xử lý)</option>
                      <option value="Processing">Processing (Đang chuẩn bị)</option>
                      <option value="Shipping">Shipping (Đang giao)</option>
                      <option value="Completed">Completed (Hoàn thành)</option>
                      <option value="Cancelled">Cancelled (Đã hủy)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Thanh toán:</label>
                    <select 
                      style={{width: '100%', padding: '8px', marginTop: '5px'}}
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value)}
                      disabled={userRole === 'ROLE_WAREHOUSE_MANAGER'}
                    >
                      <option value="Unpaid">Unpaid (Chưa thanh toán)</option>
                      <option value="Paid">Paid (Đã thanh toán)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{marginTop: '10px'}}>
                    <label>Phân công Shipper:</label>
                    <select 
                      style={{width: '100%', padding: '8px', marginTop: '5px'}}
                      value={assigningShipper}
                      onChange={(e) => setAssigningShipper(e.target.value)}
                      disabled={['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER'].includes(userRole)}
                    >
                      <option value="">-- Chưa gán --</option>
                      {shippers.map(shipper => (
                        <option key={shipper.id} value={shipper.id}>{shipper.name || shipper.fullname} ({shipper.phone})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lịch sử cập nhật */}
            <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>
              <i className="fas fa-history"></i> Lịch sử cập nhật
            </h3>
            <div style={{background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px', maxHeight: '150px', overflowY: 'auto'}}>
              {combinedHistories.length === 0 ? (
                <p style={{fontSize: '13px', color: '#666'}}>Chưa có lịch sử cập nhật nào.</p>
              ) : (
                <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '13px'}}>
                  {combinedHistories.map((h, i) => (
                     <li key={i} style={{marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
                       <strong>{new Date(h.created_at).toLocaleString('vi-VN')}</strong> - 
                       <>
                         <span style={{color: '#0056b3'}}> {h.changer?.name || 'Hệ thống'}</span> cập nhật: <br/>
                         {h.old_status !== h.new_status && `Trạng thái: ${h.old_status || 'Trống'} ➡️ ${h.new_status} `}
                         {h.old_payment_status !== h.new_payment_status && `| Thanh toán: ${h.old_payment_status || 'Trống'} ➡️ ${h.new_payment_status} `}
                         {h.old_shipper_id !== h.new_shipper_id && `| Shipper: ${h.old_shipper?.name || 'Chưa gán'} ➡️ ${h.new_shipper?.name || 'Chưa gán'} `}
                         {h.note && <div><strong>Ghi chú:</strong> {h.note}</div>}
                       </>
                     </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Danh sách sản phẩm */}
            <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>
              <i className="fas fa-box-open"></i> Danh sách sản phẩm
            </h3>
            <table className="tasks-table" style={{marginBottom: '20px'}}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <img 
                        src={item.product?.thumbnail || 'https://via.placeholder.com/50'} 
                        alt="sp" 
                        style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                      />
                      {item.product ? (
                        <a href={`/product/${item.product.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500' }}>
                          {item.product.title}
                        </a>
                      ) : (
                        <span>Sản phẩm đã xóa</span>
                      )}
                    </td>
                    <td>{formatCurrency(item.price_at_order)}</td>
                    <td style={{textAlign: 'center'}}>{item.quantity}</td>
                    <td style={{fontWeight: 'bold'}}>{formatCurrency(item.price_at_order * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Tổng cộng:</td>
                  <td style={{fontWeight: 'bold', color: '#e74c3c', fontSize: '16px'}}>
                    {formatCurrency(selectedOrder.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <button onClick={() => setShowModal(false)} className="btn-cancel" style={{padding: '10px 20px'}}>Đóng</button>
              {userRole !== 'ROLE_WAREHOUSE_MANAGER' && (
                <button onClick={handleUpdateOrder} className="btn-submit" style={{padding: '10px 20px'}}>Lưu Thay Đổi</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagePage;
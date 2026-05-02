import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const API_URL = "http://localhost:3000/api";

const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending": return "status-badge pending";
    case "Processing": return "status-badge in-progress";
    case "Shipping": return "status-badge shipping";
    case "Completed": return "status-badge completed";
    case "Cancelled": return "status-badge cancelled";
    default: return "status-badge";
  }
};

function ShipperDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Assigned"); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [note, setNote] = useState("");

  const { user } = useAuth();

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shipping/my-orders`, getHeaders());
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách giao hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, action, reason = "") => {
    try {
      const res = await axios.put(`${API_URL}/shipping/${orderId}/status`, {
        action: action,
        note: reason
      }, getHeaders());

      if (res.data.success) {
        alert("Cập nhật trạng thái thành công!");
        setSelectedOrder(null);
        setNote("");
        fetchMyOrders();
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === "Assigned") {
      // Chỉ hiển thị các đơn có trạng thái Processing (Đang chuẩn bị hàng xong) mới cho Shipper đi lấy
      return orders.filter(o => o.status === "Processing");
    }
    if (activeTab === "Shipping") {
      return orders.filter(o => o.status === "Shipping" || 
        (o.shippingLogs && o.shippingLogs[0]?.action === "picked_up"));
    }
    if (activeTab === "History") {
      return orders.filter(o => o.status === "Completed" || o.status === "Cancelled" || 
        (o.shippingLogs && (o.shippingLogs[0]?.action === "delivered" || o.shippingLogs[0]?.action === "failed")));
    }
    return orders;
  };

  if (loading) {
    return <div className="container" style={{ padding: "20px", textAlign: "center" }}>Đang tải dữ liệu...</div>;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="container" style={{ padding: "15px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        <i className="fas fa-motorcycle" style={{ color: "#e67e22" }}></i> Xin chào, Shipper {user?.name || user?.fullname}
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
        <button 
          onClick={() => setActiveTab("Assigned")} 
          style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: activeTab === "Assigned" ? "#3498db" : "#f1f2f6", color: activeTab === "Assigned" ? "white" : "#333", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          Chờ lấy hàng
        </button>
        <button 
          onClick={() => setActiveTab("Shipping")} 
          style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: activeTab === "Shipping" ? "#e67e22" : "#f1f2f6", color: activeTab === "Shipping" ? "white" : "#333", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          Đang giao
        </button>
        <button 
          onClick={() => setActiveTab("History")} 
          style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: activeTab === "History" ? "#2ecc71" : "#f1f2f6", color: activeTab === "History" ? "white" : "#333", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          Lịch sử
        </button>
      </div>

      {/* Danh sách đơn */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredOrders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>Không có đơn hàng nào trong mục này.</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Đơn #{order.id}</span>
                <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
              </div>
              
              <div style={{ marginBottom: "15px", fontSize: "14px", lineHeight: "1.6" }}>
                <p><strong><i className="fas fa-user"></i> Khách hàng:</strong> {order.customer_name} ({order.customer_phone})</p>
                <p><strong><i className="fas fa-map-marker-alt"></i> Địa chỉ:</strong> {order.shipping_address}</p>
                <p><strong><i className="fas fa-money-bill-wave"></i> Thu tiền (COD):</strong> <span style={{ color: "red", fontWeight: "bold" }}>{order.payment_method === 'cod' ? formatCurrency(order.total_price) : '0 ₫ (Đã thanh toán)'}</span></p>
                {order.notes && <p><strong><i className="fas fa-comment"></i> Ghi chú:</strong> {order.notes}</p>}
              </div>

              {/* Nút hành động */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => setSelectedOrder(order)} 
                  style={{ flex: 1, padding: "10px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  <i className="fas fa-info-circle"></i> Chi tiết
                </button>

                {activeTab === "Assigned" && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, "picked_up", "Đã lấy hàng từ kho")} 
                    style={{ flex: 2, padding: "10px", background: "#e67e22", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    <i className="fas fa-box-open"></i> Đã lấy hàng
                  </button>
                )}

                {activeTab === "Shipping" && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, "delivered", "Giao hàng thành công")} 
                    style={{ flex: 2, padding: "10px", background: "#27ae60", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    <i className="fas fa-check-circle"></i> Giao thành công
                  </button>
                )}

                {activeTab === "Shipping" && (
                  <button 
                    onClick={() => {
                      const reason = window.prompt("Nhập lý do giao thất bại (VD: Khách không nghe máy):");
                      if (reason) handleUpdateStatus(order.id, "failed", reason);
                    }} 
                    style={{ flex: 1, padding: "10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    <i className="fas fa-times-circle"></i> Thất bại
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "400px", width: "95%", margin: "0 auto", padding: "20px" }}>
            <div className="modal-header">
              <h3>Chi tiết Đơn #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            
            <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "10px 0" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <li key={index} style={{ display: "flex", gap: "10px", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    <img src={item.product?.thumbnail?.startsWith('http') ? item.product.thumbnail : `http://localhost:3000${item.product?.thumbnail}`} alt="" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                    <div>
                      <h5 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{item.product?.title || 'Sản phẩm'}</h5>
                      <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>SL: {item.quantity} x {formatCurrency(item.price_at_order)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              {selectedOrder.shippingLogs && selectedOrder.shippingLogs.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h4 style={{ fontSize: "15px", marginBottom: "10px" }}>Lịch sử vận chuyển</h4>
                  <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "#555" }}>
                    {selectedOrder.shippingLogs.map(log => (
                      <li key={log.id} style={{ marginBottom: "8px" }}>
                        <strong>{new Date(log.created_at).toLocaleString('vi-VN')}</strong>: [{log.action}] {log.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShipperDashboard;

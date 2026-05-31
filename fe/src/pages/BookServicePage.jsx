import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL, BASE_URL } from '../api.js';


const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

function BookServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Require user to be logged in

  const [service, setService] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [storeId, setStoreId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // Nếu chưa đăng nhập, đá về trang đăng nhập
    if (user === null) {
        // user is null immediately if not logged in. Wait, useAuth might take time to load?
        // Let's assume user is null if not authenticated.
        alert("Vui lòng đăng nhập để đặt lịch dịch vụ!");
        navigate("/login");
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [serviceRes, storeRes] = await Promise.all([
          axios.get(`${API_URL}/services/${serviceId}`),
          axios.get(`${API_URL}/stores`)
        ]);

        if (serviceRes.data.success) {
          setService(serviceRes.data.data);
        }
        if (storeRes.data.success) {
          setStores(storeRes.data.data);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu dịch vụ hoặc cửa hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchData();
    }
  }, [serviceId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentTime) {
      alert("Vui lòng chọn ngày và giờ cho lịch hẹn.");
      return;
    }

    // Call API with auth token
    const token = localStorage.getItem('token'); // or sessionStorage based on AuthContext
    if (!token) {
        alert("Không tìm thấy thông tin đăng nhập, vui lòng đăng nhập lại.");
        navigate("/login");
        return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/appointments`,
        {
          service_id: serviceId,
          store_id: storeId || null,
          appointment_time: appointmentTime,
          note: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert("Đặt lịch thành công! Cửa hàng sẽ liên hệ lại qua điện thoại.");
        navigate("/"); 
      }
    } catch (err) {
        console.error("Lỗi đặt lịch:", err);
        alert("Có lỗi xảy ra khi đặt lịch: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="container"><p>Đang tải...</p></div>;
  if (error || !service) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          <i className="fas fa-calendar-alt"></i> Đặt lịch hẹn
        </h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f7fa', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{service.name}</h3>
          <p style={{ margin: '0 0 5px 0', color: '#666' }}>Giá tham khảo: <strong style={{ color: '#d93025' }}>{formatCurrency(service.price)}</strong></p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Khách hàng: <strong>{user?.name || user?.username}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Chọn cửa hàng (Cơ sở)
            </label>
            <select 
              value={storeId} 
              onChange={(e) => setStoreId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Làm tại nhà hoặc Cửa hàng sắp xếp</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name} - {store.address}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Thời gian dự kiến <span style={{ color: 'red' }}>*</span>
            </label>
            <input 
              type="datetime-local" 
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Ghi chú thêm (Tình trạng thiết bị...)
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="4"
              placeholder="VD: Máy tôi bị sọc màn hình, pin ảo..."
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '12px', background: '#eab308', color: '#000', 
              border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            Xác nhận Đặt lịch
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookServicePage;

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, BASE_URL } from '../api.js';


const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

function ServiceDetailPage() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { serviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/services/${serviceId}`);

        if (response.data.success) {
          setService(response.data.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải chi tiết dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  if (loading)
    return (
      <div className="container">
        <p style={{ padding: "40px 0" }}>Đang tải...</p>
      </div>
    );
    
  if (error || !service)
    return (
      <div className="container">
        <p style={{ padding: "40px 0", color: "red" }}>Không tìm thấy dịch vụ hoặc đã có lỗi ({error}).</p>
      </div>
    );

  const currentPrice = service.price || 0;

  return (
    <>
      <section className="breadcrumb">
        <div className="container">
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><i className="fas fa-angle-right"></i></li>
            <li><Link to="/services">Dịch vụ</Link></li>
            <li><i className="fas fa-angle-right"></i></li>
            <li>
              <Link to={`/services/category/${service.category?.id}`}>
                {service.category?.name}
              </Link>
            </li>
            <li><i className="fas fa-angle-right"></i></li>
            <li>{service.name}</li>
          </ul>
        </div>
      </section>

      <main className="product-detail-page">
        <div className="container">
          <div className="product-detail-container">
            {/* Ảnh dịch vụ */}
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={service.thumbnail || 'https://via.placeholder.com/600x400?text=Service'} 
                  alt={service.name} 
                  id="main-image" 
                />
              </div>
            </div>

            {/* Thông tin dịch vụ */}
            <div className="product-info">
              <h1 className="product-title">{service.name}</h1>
              
              <div className="product-meta">
                <div className="product-sku">
                  <span className="inventory-status in-stock">
                    Đang cung cấp
                  </span>
                </div>
              </div>

              <div className="product-price-box">
                <div className="current-price">
                  {formatCurrency(currentPrice)}
                </div>
              </div>

              <div className="promotion-info">
                <h3><i className="fas fa-gift"></i> Ưu đãi đặc biệt</h3>
                <ul>
                  <li>Hỗ trợ tư vấn miễn phí cho khách hàng mới</li>
                  <li>Dịch vụ chuyên nghiệp, tận tâm từ đội ngũ giàu kinh nghiệm</li>
                  <li>Cam kết hài lòng 100% về chất lượng</li>
                </ul>
              </div>

              <div className="product-actions" style={{ marginTop: '20px' }}>
                <button
                  className="add-to-cart-btn"
                  onClick={() => navigate(`/book-service/${serviceId}`)}
                >
                  <i className="fas fa-calendar-check"></i> Đặt lịch ngay
                </button>
              </div>
            </div>
          </div>

          <div className="product-tabs" style={{ marginTop: '40px' }}>
            <div className="tabs-header">
              <div className="tab-header active" data-tab="description">
                Chi tiết dịch vụ
              </div>
            </div>
            <div className="tabs-content">
              <div className="tab-content active" id="description">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {service.description || "Đang cập nhật mô tả chi tiết cho dịch vụ này..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ServiceDetailPage;

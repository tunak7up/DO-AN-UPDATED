import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    note: "",
  });

  // Hàm xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lưu thông tin vào localStorage để trang Payment sử dụng
    localStorage.setItem("shippingInfo", JSON.stringify(formData));
    // Chuyển sang trang thanh toán
    navigate("/payment");
  };

  return (
    <>
      {/* Checkout Progress */}
      <section className="checkout-progress">
        <div className="container">
          <div className="progress-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-title">Giỏ hàng</div>
            </div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-title">Thông tin giao hàng</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-title">Thanh toán</div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-title">Hoàn tất</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Checkout Content */}
      <section className="checkout-page">
        <div className="container">
          <h1 className="page-title">Thông tin giao hàng</h1>

          <div className="checkout-container">
            {/* Checkout Form */}
            <div className="checkout-form">
              <form id="checkoutForm" onSubmit={handleSubmit}>
                {/* Shipping Information */}
                <div className="form-section">
                  <h2 className="section-title">
                    <i className="fas fa-truck"></i> Thông tin giao hàng
                  </h2>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      Địa chỉ <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Số nhà, tên đường"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">
                        Tỉnh/Thành phố <span className="required">*</span>
                      </label>
                      <select
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                      >
                        <option value="">Chọn Tỉnh/TP</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                        <option value="dn">Đà Nẵng</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="district">
                        Quận/Huyện <span className="required">*</span>
                      </label>
                      <select
                        id="district"
                        name="district"
                        required
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        <option value="q1">Quận 1</option>
                        <option value="q2">Quận 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="note">Ghi chú đơn hàng</label>
                    <textarea
                      id="note"
                      name="note"
                      rows="3"
                      placeholder="Ghi chú về đơn hàng, địa chỉ giao hàng..."
                      value={formData.note}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>



                <button type="submit" className="checkout-btn">
                  Tiếp tục đến thanh toán
                </button>
              </form>
            </div>

            {/* Order Summary (Bên phải) */}
            <div className="order-summary">
              <div className="summary-box">
                <h3 className="summary-title">Đơn hàng của bạn</h3>
                {/* Bạn có thể lấy cart từ Context để hiển thị ở đây nếu muốn */}
                <div className="summary-divider"></div>
                <div className="shipping-info">
                  <h4>
                    <i className="fas fa-shield-alt"></i> Chính sách bảo mật
                  </h4>
                  <p>
                    Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục
                    đích giao hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Link to="/cart" className="back-link">
            ← Quay lại Giỏ hàng
          </Link>
        </div>
      </section>
    </>
  );
}

export default CheckoutPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router'

const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

function OrderConfirmationPage() {
  
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Checkout Progress - Step 4 Active */}
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
            <div className="step active">
              <div className="step-number">3</div>
              <div className="step-title">Thanh toán</div>
            </div>
            <div className="step active">
              <div className="step-number">4</div>
              <div className="step-title">Hoàn tất</div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Confirmation Content */}
      <section className="order-confirmation">
        <div className="container">
          <div className="confirmation-container">
            <div className="confirmation-box">
              <div className="confirmation-header">
                <i className="fas fa-check-circle"></i>
                <h1>Đặt hàng thành công!</h1>
                <p>Cảm ơn bạn đã mua hàng tại TechZone.</p>
              </div>
              
              <div className="confirmation-details">
                <div className="detail-row">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">#{order.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ngày đặt hàng:</span>
                  <span className="detail-value">
                    {new Date(order.order_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tổng thanh toán:</span>
                  <span className="detail-value total">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
               {/* ... Nút bấm giữ nguyên ... */}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-box">
                <h3 className="summary-title">Chi tiết đơn hàng</h3>
                <div className="order-items">
                  {/* Backend trả về items gồm thông tin product bên trong */}
                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <div className="item-info">
                        <div className="item-name">{item.product.title}</div>
                        <div className="item-quantity">x{item.quantity}</div>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.price_at_order * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span className="total-price">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Shipping Info - Lưu ý: dùng tên trường của Database */}
              <div className="shipping-info-box">
                <h4><i className="fas fa-truck"></i> Thông tin giao hàng</h4>
                <div className="shipping-details">
                  <p><strong>{order.receiver_name}</strong></p>
                  <p>{order.shipping_phone}</p>
                  <p>
                    {order.shipping_address}, {order.shipping_district}, {order.shipping_city}
                  </p>
                  <p className="shipping-method">
                    <i className="fas fa-shipping-fast"></i> {order.payment_method}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderConfirmationPage;
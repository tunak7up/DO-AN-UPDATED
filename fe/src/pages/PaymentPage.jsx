import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const USER_ID = 1; // Hardcode user_id

function PaymentPage() {
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { cart, cartTotal, fetchCart } = useCart(); 
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedInfo = localStorage.getItem('shippingInfo');
    if (savedInfo) {
      setShippingInfo(JSON.parse(savedInfo));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    if (isProcessing) return;
    
    // Kiểm tra an toàn: nếu cart chưa tải xong hoặc không có items
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    setIsProcessing(true);

    try {
      // Phí ship cố định (hoặc tính toán tùy logic)
      const shippingFee = 0;
      
      // Tổng tiền cuối cùng = Tổng tiền hàng + Phí ship
      // cartTotal lấy từ Context
      const finalTotal = cartTotal + shippingFee;

      const orderPayload = {
        user_id: user.id,
        items: cart.items, // 3. Bây giờ biến 'cart' đã được định nghĩa ở trên
        total_price: finalTotal, // Map với total_amount trong Controller
        shipping_fee: shippingFee,
        payment_method: paymentMethod,
        shipping_info: shippingInfo, 
        note: shippingInfo.note || ''
      };

      // Gọi API tạo đơn hàng
      const response = await axios.post(`${API_URL}/orders`, orderPayload);

      if (response.data.success) {
        alert("Đặt hàng thành công!");
        
        // Làm mới giỏ hàng (Context)
        await fetchCart();
        
        // Chuyển sang trang xác nhận
        navigate('/order-confirmation', { state: { order: response.data.data } });
      }

    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <section className="checkout-progress">
        <div className="container">
          <div className="progress-steps">
            <div className="step active"><div className="step-number">1</div><div className="step-title">Giỏ hàng</div></div>
            <div className="step active"><div className="step-number">2</div><div className="step-title">Thông tin giao hàng</div></div>
            <div className="step active"><div className="step-number">3</div><div className="step-title">Thanh toán</div></div>
            <div className="step"><div className="step-number">4</div><div className="step-title">Hoàn tất</div></div>
          </div>
        </div>
      </section>

      <div className="container">
        <h1 className="page-title">Thông Tin Thanh Toán</h1>

        {shippingInfo && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
            <h3>Giao tới:</h3>
            <p><strong>{shippingInfo.fullName}</strong> ({shippingInfo.phone})</p>
            <p>{shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city}</p>
          </div>
        )}

        <form className="form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
          <div className="form-section">
            <h2 className="section-title"><i className="fas fa-credit-card"></i> Chọn phương thức thanh toán</h2>
            <div className="payment-methods">
              <div className="payment-method">
                <input type="radio" id="codPayment" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)}/>
                <label htmlFor="codPayment">
                  <div className="method-icon"><i className="fas fa-money-bill-wave"></i></div>
                  <div className="method-info"><div className="method-name">Thanh toán khi nhận hàng (COD)</div></div>
                </label>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div className="payment-method">
                  <input type="radio" id="bankTransfer" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)}/>
                  <label htmlFor="bankTransfer">
                    <div className="method-icon"><i className="fas fa-university"></i></div>
                    <div className="method-info"><div className="method-name">Chuyển khoản ngân hàng</div></div>
                  </label>
                </div>
                {paymentMethod === 'bank' && (
                  <div className="bank-transfer-details" style={{ padding: '15px', marginTop: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ced4da' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <img src="/qr.jpg" alt="QR Code" style={{ width: '250px', height: '250px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' }} />
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>Ngân hàng:</strong> BIDV</p>
                        <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>Số TK:</strong> 4506484727</p>
                        <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>Chủ TK:</strong> NGUYEN ANH TUAN</p>
                        <p style={{ margin: '5px 0', fontSize: '15px', color: '#e74c3c' }}><strong>Số tiền:</strong> {(cartTotal).toLocaleString('vi-VN')} đ</p>
                        <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>Nội dung:</strong> Thanh toan don hang {user?.username || user?.phone || user?.id || ''}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button 
              type="submit" 
              className="checkout-btn" 
              disabled={isProcessing}
              style={{ opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </form>
        <Link to="/checkout" className="back-link">← Quay lại Thông tin giao hàng</Link>
      </div>
    </>
  );
}

export default PaymentPage;
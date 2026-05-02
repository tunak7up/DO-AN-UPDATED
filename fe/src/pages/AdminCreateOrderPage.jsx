import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function AdminCreateOrderPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // POS Cart State
  const [cartItems, setCartItems] = useState([]);

  // Form Data (Bỏ qua email và phương thức vận chuyển)
  const [formData, setFormData] = useState({
    fullName: "Khách lẻ",
    phone: "",
    address: "",
    city: "",
    district: "",
    note: "",
    payment_method: "cash",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${API_URL}/products`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }
      return [...prev, {
        product_id: product.id,
        title: product.title,
        price: product.price,
        discount: product.discount,
        thumbnail: product.thumbnail,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product_id === id) {
          const newQ = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQ) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.product_id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.price * (1 - (item.discount || 0) / 100);
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm vào đơn hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        items: cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        shipping_info: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
        },
        payment_method: formData.payment_method,
        note: formData.note
      };

      const res = await axios.post(`${API_URL}/orders/staff`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Tạo đơn hàng thành công!");
        setCartItems([]);
        setFormData({
          fullName: "Khách lẻ",
          phone: "",
          address: "",
          city: "",
          district: "",
          note: "",
          payment_method: "cash",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo đơn hàng: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <div className="page-header">
        <h1><i className="fas fa-shopping-cart"></i> Tạo Đơn Hàng Tại Quầy (POS)</h1>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: PRODUCT LIST */}
        <div style={{ flex: '1 1 50%', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="search-box" style={{ marginBottom: '20px', display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
            />
            <button style={{ padding: '0 15px', background: '#f5f5f5', border: 'none', borderLeft: '1px solid #ddd', cursor: 'pointer' }}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {loadingProducts ? <p>Đang tải sản phẩm...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {filteredProducts.map(p => {
                  const finalPrice = p.price * (1 - (p.discount || 0) / 100);
                  return (
                    <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                      <img src={p.thumbnail?.startsWith('http') ? p.thumbnail : `http://localhost:3000${p.thumbnail}`} alt={p.title} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '10px' }} />
                      <h4 style={{ fontSize: '14px', margin: '0 0 10px 0', flex: 1 }}>{p.title}</h4>
                      <p style={{ color: '#e74c3c', fontWeight: 'bold', margin: '0 0 10px 0' }}>{finalPrice.toLocaleString()}đ</p>
                      <button 
                        onClick={() => handleAddToCart(p)}
                        style={{ padding: '8px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Thêm
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CART & CHECKOUT FORM */}
        <div style={{ flex: '1 1 50%', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            <i className="fas fa-receipt"></i> Hóa đơn tạm tính
          </h2>

          {/* Cart Items */}
          <div style={{ marginBottom: '20px', minHeight: '150px' }}>
            {cartItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: '50px' }}>Chưa có sản phẩm nào được chọn.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {cartItems.map(item => {
                  const price = item.price * (1 - (item.discount || 0) / 100);
                  return (
                    <li key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.title}</h4>
                        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{price.toLocaleString()}đ</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px' }}>
                          <button type="button" onClick={() => updateQuantity(item.product_id, -1)} style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
                          <span style={{ padding: '5px 10px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product_id, 1)} style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <span>Tổng cộng:</span>
            <span style={{ color: '#e74c3c' }}>{calculateTotal().toLocaleString()}đ</span>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-form" style={{ padding: 0 }}>
            <h3 style={{ marginBottom: '15px' }}><i className="fas fa-user-edit"></i> Thông tin khách hàng</h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Họ và tên <span className="required">*</span></label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Số điện thoại <span className="required">*</span></label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Để trống nếu mua trực tiếp" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Tỉnh/Thành phố</label>
                <select name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Chọn Tỉnh/TP</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="hn">Hà Nội</option>
                  <option value="dn">Đà Nẵng</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Quận/Huyện</label>
                <select name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Chọn Quận/Huyện</option>
                  <option value="q1">Quận 1</option>
                  <option value="q2">Quận 2</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Phương thức thanh toán</label>
              <select name="payment_method" value={formData.payment_method} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="cash">Tiền mặt tại quầy</option>
                <option value="bank_transfer">Chuyển khoản / Quẹt thẻ</option>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Ghi chú đơn hàng</label>
              <textarea name="note" rows="2" value={formData.note} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Đang xử lý...' : 'HOÀN TẤT ĐƠN HÀNG'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateOrderPage;

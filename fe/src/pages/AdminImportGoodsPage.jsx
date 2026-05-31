import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function AdminImportGoodsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Import Cart State
  const [cartItems, setCartItems] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    supplier_name: "",
    store_id: "",
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [resProducts, resStores] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/stores/my-stores`, { headers })
      ]);

      if (resProducts.data.success) {
        setProducts(resProducts.data.data);
      }
      if (resStores.data.success) {
        setStores(resStores.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
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
        thumbnail: product.thumbnail,
        quantity: 1,
        unit_price: product.price || 0 // Default to product price, editable
      }];
    });
  };

  const updateCartItem = (id, field, value) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product_id === id) {
          const newVal = Math.max(0, value);
          return { ...item, [field]: newVal };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.product_id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để nhập kho.");
      return;
    }
    if (!formData.store_id) {
      alert("Vui lòng chọn cơ sở nhận hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        supplier_name: formData.supplier_name,
        store_id: formData.store_id,
        note: formData.note,
        items: cartItems.map(item => ({ 
          product_id: item.product_id, 
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
      };

      const res = await axios.post(`${API_URL}/import`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Nhập kho thành công!");
        navigate('/admin/inventory');
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo phiếu nhập: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1><i className="fas fa-file-import"></i> Tạo Phiếu Nhập Hàng</h1>
        <button onClick={() => navigate('/admin/inventory')} style={{ padding: '8px 15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: PRODUCT LIST */}
        <div style={{ flex: '1 1 45%', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
            {loading ? <p>Đang tải sản phẩm...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {filteredProducts.map(p => (
                  <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img src={p.thumbnail?.startsWith('http') ? p.thumbnail : `${BASE_URL}${p.thumbnail}`} alt={p.title} style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', flex: 1 }}>{p.title}</h4>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      style={{ padding: '6px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      <i className="fas fa-plus"></i> Chọn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: IMPORT DETAILS & CHECKOUT FORM */}
        <div style={{ flex: '1 1 55%', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nhà cung cấp</label>
                <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange} placeholder="Tên đơn vị cấp hàng..." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cơ sở nhập <span style={{ color: 'red' }}>*</span></label>
                <select name="store_id" value={formData.store_id} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">-- Chọn cơ sở --</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.address}</option>
                  ))}
                </select>
              </div>
            </div>

            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <i className="fas fa-list"></i> Danh sách hàng nhập
            </h3>

            {/* Cart Items */}
            <div style={{ marginBottom: '20px', minHeight: '150px' }}>
              {cartItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: '50px' }}>Chưa chọn sản phẩm nào.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                      <th style={{ padding: '10px' }}>Sản phẩm</th>
                      <th style={{ padding: '10px', width: '100px' }}>Số lượng</th>
                      <th style={{ padding: '10px', width: '130px' }}>Đơn giá nhập</th>
                      <th style={{ padding: '10px', width: '130px' }}>Thành tiền</th>
                      <th style={{ padding: '10px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.product_id} style={{ borderBottom: '1px dashed #eee' }}>
                        <td style={{ padding: '10px', fontSize: '14px' }}>{item.title}</td>
                        <td style={{ padding: '10px' }}>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={(e) => updateCartItem(item.product_id, 'quantity', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '5px' }}
                          />
                        </td>
                        <td style={{ padding: '10px' }}>
                          <input 
                            type="number" 
                            min="0" 
                            value={item.unit_price} 
                            onChange={(e) => updateCartItem(item.product_id, 'unit_price', parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '5px' }}
                          />
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#e74c3c' }}>
                          {(item.quantity * item.unit_price).toLocaleString()}đ
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button type="button" onClick={() => removeFromCart(item.product_id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
              <span>Tổng giá trị nhập:</span>
              <span style={{ color: '#e74c3c' }}>{calculateTotal().toLocaleString()}đ</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ghi chú phiếu nhập</label>
              <textarea name="note" rows="2" value={formData.note} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '15px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Đang lưu phiếu nhập...' : 'HOÀN TẤT NHẬP KHO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminImportGoodsPage;

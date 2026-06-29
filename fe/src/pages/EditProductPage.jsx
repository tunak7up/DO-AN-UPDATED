import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, BASE_URL } from '../api.js';


function EditProductPage() {
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  
  // State cho các trường của form
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0); 
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [deleted, setDeleted] = useState(0);

  // Tải Categories và thông tin Product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products/${productId}?includeDeleted=true`)
        ]);
        
        if (categoryRes.data.success) {
          setCategories(categoryRes.data.data);
        }
        
        if (productRes.data.success) {
          const product = productRes.data.data;
          setTitle(product.title || '');
          setCategoryId(product.category_id || '');
          setPrice(product.price || 0);
          setDiscount(product.discount || 0);
          setThumbnail(product.thumbnail || '');
          setDescription(product.description || '');
          setDeleted(product.deleted || 0);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        alert('Không thể tải thông tin sản phẩm');
      }
    };
    fetchData();
  }, [productId]);

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categoryId || !price) {
      alert('Vui lòng nhập các trường bắt buộc: Tên, Danh mục, Giá.');
      return;
    }

    const updatedProduct = {
      title,
      category_id: parseInt(categoryId),
      price: parseInt(price),
      discount: parseInt(discount),
      thumbnail,
      description,
    };

    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, updatedProduct);
      
      if (response.data.success) {
        alert('Cập nhật sản phẩm thành công!');
        navigate('/admin/inventory'); 
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật sản phẩm:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = deleted === 1 ? 0 : 1;
      const response = await axios.patch(`${API_URL}/products/${productId}/status`, { deleted: newStatus });
      if (response.data.success) {
        setDeleted(newStatus);
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-edit"></i> Chỉnh Sửa Sản Phẩm</h1>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="product-name">Tên sản phẩm <span className="required">*</span></label>
              <input 
                type="text" 
                id="product-name" 
                placeholder="Nhập tên sản phẩm" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="product-category">Danh mục <span className="required">*</span></label>
              <select 
                id="product-category" 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product-price">Giá bán <span className="required">*</span></label>
              <input 
                type="number" 
                id="product-price" 
                placeholder="Nhập giá bán" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-discount">Giảm giá (%)</label>
              <input 
                type="number" 
                id="product-discount" 
                placeholder="Nhập % giảm giá" 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Mô tả & Hình ảnh</h2>
          <div className="form-group">
            <label htmlFor="product-thumbnail">URL Ảnh chính (Thumbnail) <span className="required">*</span></label>
            <input 
              type="text" 
              id="product-thumbnail" 
              placeholder="Nhập URL hình ảnh chính" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-description">Mô tả <span className="required">*</span></label>
            <textarea 
              id="product-description" 
              rows="5" 
              placeholder="Nhập mô tả sản phẩm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={handleToggleStatus}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '4px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: 'auto',
              backgroundColor: deleted === 1 ? '#28a745' : '#dc3545',
              color: 'white'
            }}
          >
            {deleted === 1 ? <><i className="fas fa-play"></i> Tiếp tục kinh doanh</> : <><i className="fas fa-pause"></i> Ngừng kinh doanh</>}
          </button>
          
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products')}>Hủy bỏ</button>
          <button type="submit" className="btn-submit">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;

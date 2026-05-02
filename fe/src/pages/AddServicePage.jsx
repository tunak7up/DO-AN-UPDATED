import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

function AddServicePage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  
  // State for form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Load Categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/service-categories`);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryId || !price) {
      alert('Vui lòng nhập các trường bắt buộc: Tên dịch vụ, Danh mục, Giá.');
      return;
    }

    const newService = {
      name,
      category_id: parseInt(categoryId),
      price: parseFloat(price),
      description,
      thumbnail,
      is_active: isActive
    };

    try {
      const response = await axios.post(`${API_URL}/services`, newService);
      
      if (response.data.success) {
        alert('Tạo dịch vụ thành công!');
        // Ideally navigate to service list, but for now navigate admin dashboard or go back
        navigate('/admin'); 
      }
    } catch (err) {
      console.error('Lỗi khi tạo dịch vụ:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-plus-circle"></i> Tạo Dịch Vụ Mới</h1>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="form-grid">
            {/* Tên dịch vụ */}
            <div className="form-group">
              <label htmlFor="service-name">Tên dịch vụ <span className="required">*</span></label>
              <input 
                type="text" 
                id="service-name" 
                placeholder="Nhập tên dịch vụ" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            
            {/* Danh mục */}
            <div className="form-group">
              <label htmlFor="service-category">Danh mục <span className="required">*</span></label>
              <select 
                id="service-category" 
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

            {/* Giá dịch vụ */}
            <div className="form-group">
              <label htmlFor="service-price">Giá dịch vụ <span className="required">*</span></label>
              <input 
                type="number" 
                id="service-price" 
                placeholder="Nhập giá dịch vụ" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>

            {/* Trạng thái hoạt động */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="service-active" style={{ marginBottom: 0 }}>Đang hoạt động</label>
              <input 
                type="checkbox" 
                id="service-active" 
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 'auto' }}
              />
            </div>
          </div>
        </div>

        {/* Mô tả & Thumbnail */}
        <div className="form-section">
          <h2 className="section-title">Mô tả & Hình ảnh</h2>
          <div className="form-group">
            <label htmlFor="service-thumbnail">URL Ảnh đại diện</label>
            <input 
              type="text" 
              id="service-thumbnail" 
              placeholder="Nhập URL hình ảnh dịch vụ" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="service-description">Mô tả dịch vụ</label>
            <textarea 
              id="service-description" 
              rows="5" 
              placeholder="Nhập mô tả dịch vụ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin')}>Hủy bỏ</button>
          <button type="submit" className="btn-submit">Lưu dịch vụ</button>
        </div>
      </form>
    </div>
  );
}

export default AddServicePage;

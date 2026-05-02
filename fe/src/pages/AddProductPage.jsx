import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  
  // State cho các trường của form
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0); // Dùng discount thay vì giá gốc
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  
  // State cho kho hàng
  // Sẽ có dạng: { 1: 10, 2: 5, 3: 0 } (với 1, 2, 3 là store_id)
  const [inventory, setInventory] = useState({});

  // Tải Categories và Stores cho các dropdown
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [categoryRes, storeRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/stores`)
        ]);
        
        if (categoryRes.data.success) {
          setCategories(categoryRes.data.data);
        }
        if (storeRes.data.success) {
          setStores(storeRes.data.data);
          // Khởi tạo state kho hàng với số lượng 0 cho mỗi kho
          const initialInventory = {};
          storeRes.data.data.forEach(store => {
            initialInventory[store.id] = 0;
          });
          setInventory(initialInventory);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu form:", err);
      }
    };
    fetchDropdownData();
  }, []);

  // Xử lý cập nhật số lượng kho
  const handleInventoryChange = (storeId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [storeId]: parseInt(quantity) || 0
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra dữ liệu cơ bản
    if (!title || !categoryId || !price) {
      alert('Vui lòng nhập các trường bắt buộc: Tên, Danh mục, Giá.');
      return;
    }

    // 2. Chuyển đổi state inventory {1: 10, 2: 5}
    // thành mảng [{store_id: 1, quantity: 10}, {store_id: 2, quantity: 5}]
    // mà backend (productController) yêu cầu
    const inventoryData = Object.keys(inventory).map(storeId => ({
      store_id: parseInt(storeId),
      quantity: inventory[storeId]
    }));

    // 3. Tạo object sản phẩm
    const newProduct = {
      title,
      category_id: parseInt(categoryId),
      price: parseInt(price),
      discount: parseInt(discount),
      thumbnail,
      description,
      inventoryData // Gửi mảng kho hàng đi
    };

    // 4. Gọi API
    try {
      const response = await axios.post(`${API_URL}/products`, newProduct);
      
      if (response.data.success) {
        alert('Tạo sản phẩm thành công!');
        // Chuyển về trang quản lý kho
        navigate('/admin/inventory'); 
      }
    } catch (err) {
      console.error('Lỗi khi tạo sản phẩm:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1><i className="fas fa-plus-circle"></i> Tạo Sản Phẩm Mới</h1>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="form-grid">
            {/* Tên sản phẩm */}
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
            
            {/* Danh mục */}
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

            {/* Giá bán */}
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

            {/* Giảm giá (Discount) */}
            <div className="form-group">
              <label htmlFor="product-discount">Giảm giá (%)</label>
              <input 
                type="number" 
                id="product-discount" 
                placeholder="Nhập % giảm giá (ví dụ: 15)" 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mô tả & Thumbnail (vì chỉ cần 1 ảnh) */}
        <div className="form-section">
          <h2 className="section-title">Mô tả & Hình ảnh</h2>
          {/* Thumbnail URL */}
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

          {/* Mô tả */}
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

        {/* Quản lý kho */}
        <div className="form-section">
          <h2 className="section-title">Quản lý kho</h2>
          <div className="inventory-management">
            {stores.map(store => (
              <div className="inventory-item" key={store.id}>
                <label>Cơ sở {store.name}</label>
                <input 
                  type="number" 
                  min="0" 
                  value={inventory[store.id] || 0} 
                  placeholder="Số lượng"
                  onChange={(e) => handleInventoryChange(store.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/inventory')}>Hủy bỏ</button>
          <button type="submit" className="btn-submit">Lưu sản phẩm</button>
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
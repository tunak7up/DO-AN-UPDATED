import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, BASE_URL } from '../api.js';


const EditServiceModal = ({ service, categories, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...service });

  useEffect(() => {
    if (service) {
      setFormData({ ...service });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%'
      }}>
        <h2>Chỉnh sửa Dịch vụ</h2>
        
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Tên dịch vụ</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name || ''} 
            onChange={handleChange} 
            className="form-control"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Danh mục</label>
          <select 
            name="category_id" 
            value={formData.category_id || ''} 
            onChange={handleChange}
            className="form-control"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Giá (VNĐ)</label>
          <input 
            type="number" 
            name="price" 
            value={formData.price || 0} 
            onChange={handleChange} 
            className="form-control"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Hình ảnh (URL)</label>
          <input 
            type="text" 
            name="thumbnail" 
            value={formData.thumbnail || ''} 
            onChange={handleChange} 
            className="form-control"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Mô tả</label>
          <textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            className="form-control"
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          ></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="checkbox" 
            name="is_active" 
            checked={formData.is_active} 
            onChange={handleChange} 
            id="modal-is-active"
          />
          <label htmlFor="modal-is-active" style={{ marginBottom: 0 }}>Trạng thái hoạt động</label>
        </div>

        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '4px' }} onClick={onClose}>Hủy</button>
          <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }} onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

function ServiceListPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceRes, categoryRes] = await Promise.all([
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/service-categories`)
      ]);

      if (serviceRes.data.success) {
        setServices(serviceRes.data.data);
      }
      if (categoryRes.data.success) {
        setCategories(categoryRes.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
  };

  const handleSaveService = async (updatedService) => {
    try {
      const response = await axios.put(`${API_URL}/services/${updatedService.id}`, updatedService);
      if (response.data.success) {
        alert("Cập nhật dịch vụ thành công!");
        setServices(services.map(s => s.id === updatedService.id ? response.data.data : s));
        setEditingService(null);
      }
    } catch (error) {
      console.error("Lỗi cập nhật dịch vụ:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1><i className="fas fa-list"></i> Quản Lý Dịch Vụ</h1>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f4f4f4' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tên Dịch Vụ</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Danh Mục</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Giá (VNĐ)</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng Thái</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{service.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{service.name}</td>
                  <td style={{ padding: '12px' }}>{service.category?.name || 'Không có'}</td>
                  <td style={{ padding: '12px' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price || 0)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: service.is_active ? '#e6f4ea' : '#fce8e6', 
                      color: service.is_active ? '#1e8e3e' : '#d93025' 
                    }}>
                      {service.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleEditClick(service)}
                      style={{ 
                        border: 'none', background: 'none', color: '#646cff', cursor: 'pointer', fontSize: '16px' 
                      }}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Chưa có dịch vụ nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <EditServiceModal 
        service={editingService} 
        categories={categories} 
        isOpen={!!editingService} 
        onClose={() => setEditingService(null)} 
        onSave={handleSaveService} 
      />
    </div>
  );
}

export default ServiceListPage;

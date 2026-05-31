import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL, BASE_URL } from '../api.js';


function ProductManagePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [res, categoryRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`)
      ]);
      if (res.data.success) {
        setProducts(res.data.data);
      }
      if (categoryRes.data.success) {
        setCategories(categoryRes.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1><i className="fas fa-boxes"></i> Quản Lý Sản Phẩm</h1>
        <Link to="/admin/products/new" className="btn-add" style={{ padding: '10px 15px', background: '#27ae60', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus"></i> Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="filter-controls" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
        />
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '200px' }}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f4f4f4' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hình Ảnh</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tên Sản Phẩm</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Danh Mục</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Giá</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {products.filter((p) => {
                const matchesSearch = p.title.toLowerCase().includes(filterSearch.toLowerCase());
                const matchesCategory = filterCategory === "all" || p.category_id === parseInt(filterCategory);
                return matchesSearch && matchesCategory;
              }).map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{product.id}</td>
                  <td style={{ padding: '12px' }}>
                    <img src={product.thumbnail} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.title}</td>
                  <td style={{ padding: '12px' }}>{product.category?.name || 'Không có'}</td>
                  <td style={{ padding: '12px' }}>{formatPrice(product.price)}</td>
                  <td style={{ padding: '12px' }}>
                    <Link 
                      to={`/admin/products/edit/${product.id}`}
                      style={{ 
                        display: 'inline-block', padding: '6px 12px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' 
                      }}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i> Sửa TT
                    </Link>
                  </td>
                </tr>
              ))}
              {products.filter((p) => {
                const matchesSearch = p.title.toLowerCase().includes(filterSearch.toLowerCase());
                const matchesCategory = filterCategory === "all" || p.category_id === parseInt(filterCategory);
                return matchesSearch && matchesCategory;
              }).length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManagePage;

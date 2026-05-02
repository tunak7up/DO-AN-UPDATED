import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Định nghĩa URL API cơ sở của bạn
const API_URL = 'http://localhost:3000/api';

// Hàm trợ giúp để định dạng tiền tệ
const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryRes, productRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products`)
        ]);

        console.log("DỮ LIỆU CATEGORY GỐC:", categoryRes.data);
        console.log("DỮ LIỆU PRODUCT GỐC:", productRes.data);
    
        const categoriesData = categoryRes.data.data || categoryRes.data;
        const productsData = productRes.data.data || productRes.data;

        // Thêm kiểm tra an toàn
        if (!Array.isArray(categoriesData)) {
          console.error("Dữ liệu category trả về không phải là mảng!", categoriesData);
          throw new Error("Dữ liệu category không hợp lệ");
        }
        if (!Array.isArray(productsData)) {
          console.error("Dữ liệu product trả về không phải là mảng!", productsData);
          throw new Error("Dữ liệu product không hợp lệ");
        }

        // Dùng .slice() trên mảng đã được truy cập đúng
        setCategories(categoriesData.slice(0, 4));
        setProducts(productsData.slice(0, 4));

      } catch (err) {
        setError(err);
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hiển thị trạng thái tải hoặc lỗi
  if (loading) return <div className="container"><p>Đang tải dữ liệu...</p></div>;
  if (error) return <div className="container"><p>Không thể tải dữ liệu: {error.message}</p></div>;

  return (
    <>
      {/* === Slider/Banner === */}
      {/* TODO: Logic slider (nút prev/next) cần được viết lại bằng React (useState) */}
      <section className="slider">
        <div className="slides">
          <div className="slide active">
            <img src="https://i.pinimg.com/736x/68/2f/3e/682f3ebdbb461ed6c5a01aec59a1b39b.jpg" alt="Laptop Giảm Giá" />
            <div className="slide-content">
              <h2>Laptop Gaming Giảm 30%</h2>
              <p>Độc quyền tại TechZone</p>
              <Link to="/products?category=laptop" className="btn">Mua ngay</Link>
            </div>
          </div>
          {/* Các slide khác... */}
        </div>
        <div className="slider-controls">
          <button className="prev"><i className="fas fa-chevron-left"></i></button>
          <button className="next"><i className="fas fa-chevron-right"></i></button>
        </div>
      </section>

      {/* === Featured Categories === */}
      <section className="featured-categories">
        <div className="container">
          <h2 className="section-title">Danh Mục Nổi Bật</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link to={`/products/category/${category.id}`} className="category-card" key={category.id}>
                <img src={category.thumbnail} alt={category.name} />
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Featured Products === */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Sản Phẩm Mới Nhất</h2>
          <div className="product-grid">
            {products.map(product => {
              // Logic tính giá dựa trên model Product.js
              const originalPrice = product.price || 0;
              const discountPercent = product.discount || 0;
              const currentPrice = originalPrice * (1 - discountPercent / 100);

              return (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.thumbnail} alt={product.title} />
                    </Link>
                    {discountPercent > 0 && (
                      <div className="product-badge">-{discountPercent}%</div>
                    )}
                  </div>
                  <div className="product-info">
                    <Link to={`/product/${product.id}`}><h3 className="product-name">{product.title}</h3></Link>

                    {/* LƯU Ý: Model 'Product' của bạn chỉ có 'description'.
                      Để hiển thị specs (i7, 16GB), bạn cần thêm các trường này vào model 
                      hoặc dùng description để thay thế.
                    */}
                    <div className="product-specs">
                      <p>{product.description?.substring(0, 100) || 'Xem chi tiết sản phẩm...'}</p>
                    </div>

                    <div className="product-price">
                      <span className="current-price">{formatCurrency(currentPrice)}</span>
                      {discountPercent > 0 && (
                        <span className="old-price">{formatCurrency(originalPrice)}</span>
                      )}
                    </div>

                    {/* TODO: Rating cần được lấy từ model Feedback/Rating (nếu có) */}
                    <div className="product-rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                      <span>(24)</span>
                    </div>

                    <button className="add-to-cart">Thêm vào giỏ</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === Promotion Banner (Giữ nguyên) === */}
      <section className="promotion-banner">
        <div className="container">
          <div className="banner-content">
            <h2>Giảm giá đến 50%</h2>
            <p>Cho tất cả phụ kiện Gaming trong tháng này</p>
            <Link to="/products?category=accessories" className="btn">Xem ngay</Link>
          </div>
        </div>
      </section>

      {/* === Brands Section (Giữ nguyên) === */}
      <section className="brands-section">
        <div className="container">
          <h2 className="section-title">Thương hiệu nổi bật</h2>
          <div className="brands-grid">
            <img src="https://i.pinimg.com/736x/11/ab/80/11ab80e1acf665c2d4c5534043213568.jpg" alt="ASUS" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpwLgZbc8XCf-MNPGthC4ec-D1duvkvO53vQ&s" alt="MSI" />
            <img src="https://i.pinimg.com/736x/ce/f7/5b/cef75bd7d3a2dc6f9937504e2130c0fa.jpg" alt="Logitech" />
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/f251cd126326671.Y3JvcCw4MDgsNjMyLDAsMA.png" alt="Razer" />
            <img src="https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png" alt="Corsair" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
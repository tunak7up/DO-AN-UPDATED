import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";



// Hàm trợ giúp định dạng tiền tệ
const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

// Component ProductCard (Không thay đổi)
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const originalPrice = product.price || 0;
  const discountPercent = product.discount || 0;
  const currentPrice = originalPrice * (1 - discountPercent / 100);

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.thumbnail} alt={product.title} />
        </Link>
        {discountPercent > 0 && (
          <div className="product-badge">-{discountPercent}%</div>
        )}
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.title}</h3>
        </Link>
        <div className="product-specs">
          <p>
            {product.description?.substring(0, 100) ||
              "Xem chi tiết sản phẩm..."}
          </p>
        </div>
        <div className="product-price">
          <span className="current-price">{formatCurrency(currentPrice)}</span>
          {discountPercent > 0 && (
            <span className="old-price">{formatCurrency(originalPrice)}</span>
          )}
        </div>
        <button className="add-to-cart" onClick={() => addToCart(product.id, 1)}>Thêm vào giỏ</button>
      </div>
    </div>
  );
};

// Trang Category
function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Tất cả sản phẩm");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm state để lưu danh sách categories cho select bar ===
  const [allCategories, setAllCategories] = useState([]);

  const { categoryId } = useParams();
  const navigate = useNavigate(); // === MỚI: Hook để điều hướng ===

  // State cho tìm kiếm ===
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc sản phẩm theo từ khóa ===
  const filteredProducts = products.filter(
    (product) =>
      product.title &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm useEffect để tải TẤT CẢ categories cho select bar ===
  // (Chạy 1 lần duy nhất khi component được tải)
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        if (response.data.success) {
          // Nhớ .data.data vì cấu trúc API của bạn
          setAllCategories(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách danh mục:", err);
      }
    };
    fetchAllCategories();
  }, []); // [] nghĩa là chỉ chạy 1 lần

  // tải SẢN PHẨM
  // (Chạy lại mỗi khi categoryId trên URL thay đổi)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      let url = `${API_URL}/products`;

      try {
        if (categoryId) {
          url = `${API_URL}/products/category/${categoryId}`;
        }

        const response = await axios.get(url);

        if (response.data.success) {
          setProducts(response.data.data);

          if (categoryId && response.data.data.length > 0) {
            setCategoryName(response.data.data[0].category.name);
          } else if (!categoryId) {
            setCategoryName("Tất cả sản phẩm");
          } else {
            // Trường hợp categoryId có nhưng không tìm thấy sản phẩm
            // tìm tên category từ list đã tải
            const currentCat = allCategories.find(
              (cat) => cat.id.toString() === categoryId
            );
            setCategoryName(currentCat ? currentCat.name : "Danh mục");
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ chạy fetchProducts khi allCategories đã được tải (tránh race condition)
    if (allCategories.length > 0 || !categoryId) {
      fetchProducts();
    }
  }, [categoryId, allCategories]); // === MỚI: Thêm allCategories vào dependency ===

  // Hàm xử lý khi người dùng thay đổi select bar ===
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    if (newCategoryId === "all") {
      // Nếu chọn "Tất cả", điều hướng về trang /products
      navigate("/products");
    } else {
      // Nếu chọn 1 category cụ thể, điều hướng đến trang của nó
      navigate(`/products/category/${newCategoryId}`);
    }
  };

  return (
    <>
      <section className="breadcrumb">
        <div className="container">
          <ul>
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <i className="fas fa-angle-right"></i>
            </li>
            <li>{categoryName}</li>
          </ul>
        </div>
      </section>

      <main className="category-page">
        <div className="container">
          <div className="category-header">
            <h1>{categoryName}</h1>

            {/* === START: THÊM SELECT BAR MỚI & SEARCH BAR === */}
            <div className="category-tools-bar">
              <div className="category-select-wrapper">
                <label htmlFor="category-select">Danh mục:</label>
                <select
                  id="category-select"
                  value={categoryId || "all"}
                  onChange={handleCategoryChange}
                  className="custom-select"
                >
                  <option value="all">Tất cả sản phẩm</option>
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="product-search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>
            {/* === END: THÊM SELECT BAR MỚI & SEARCH BAR === */}

            <p className="product-count">
              Hiển thị {filteredProducts.length} sản phẩm
            </p>
          </div>

          <div className="category-content">
            {/*  */}
            <section className="products-section">
              {/* ... ... */}

              {loading && <p>Đang tải sản phẩm...</p>}
              {error && <p>Lỗi: {error}</p>}

              <div className="products-grid">
                {!loading &&
                  filteredProducts.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default CategoryPage;

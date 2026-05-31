import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";



// Hàm trợ giúp định dạng tiền tệ
const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${productId}`);

        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);

          // Đặt ảnh chính là thumbnail, hoặc ảnh đầu tiên trong gallery (nếu có)
          setMainImage(
            productData.thumbnail ||
              (productData.galleries && productData.galleries[0]?.thumbnail)
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Xử lý logic tăng giảm số lượng
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQuant = prev + amount;
      if (newQuant < 1) return 1;
      // TODO: Giới hạn theo tổng số lượng tồn kho
      return newQuant;
    });
  };

  // ---- DỮ LIỆU ĐỘNG TỪ API ----
  if (loading)
    return (
      <div className="container">
        <p>Đang tải...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p>Lỗi: {error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="container">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    );

  // Tính giá
  const originalPrice = product.price || 0;
  const discountPercent = product.discount || 0;
  const currentPrice = originalPrice * (1 - discountPercent / 100);

  // Tính tổng tồn kho (từ BE)
  const totalStock =
    product.inventories?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
            <li>
              <Link to={`/products/category/${product.category?.id}`}>
                {product.category?.name}
              </Link>
            </li>
            <li>
              <i className="fas fa-angle-right"></i>
            </li>
            <li>{product.title}</li>
          </ul>
        </div>
      </section>

      <main className="product-detail-page">
        <div className="container">
          <div className="product-detail-container">
            {/* === Product Gallery (Dữ liệu từ API) === */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={mainImage} alt={product.title} id="main-image" />
              </div>
              <div className="thumbnail-images">
                {/* Thumbnail chính của sản phẩm */}
                {product.thumbnail && (
                  <div
                    className={`thumbnail ${
                      mainImage === product.thumbnail ? "active" : ""
                    }`}
                    onClick={() => setMainImage(product.thumbnail)}
                  >
                    <img src={product.thumbnail} alt="thumbnail" />
                  </div>
                )}
                {/* Các ảnh khác trong gallery */}
                {product.galleries?.map((img) => (
                  <div
                    key={img.id}
                    className={`thumbnail ${
                      mainImage === img.thumbnail ? "active" : ""
                    }`}
                    onClick={() => setMainImage(img.thumbnail)}
                  >
                    <img src={img.thumbnail} alt={`gallery ${img.id}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* === Product Info (Dữ liệu từ API) === */}
            <div className="product-info">
              <h1 className="product-title">{product.title}</h1>
              <div className="product-meta">
                <div className="product-rating">
                  {/* TODO: Cần API Reviews */}
                </div>
                <div className="product-sku">
                  <span className="inventory-status in-stock">
                    {totalStock > 0 ? `Còn hàng` : "Hết hàng"}
                  </span>
                </div>
              </div>

              <div className="product-price-box">
                <div className="current-price">
                  {formatCurrency(currentPrice)}
                </div>
                {discountPercent > 0 && (
                  <>
                    <div className="old-price">
                      {formatCurrency(originalPrice)}
                    </div>
                    <div className="discount-badge">-{discountPercent}%</div>
                  </>
                )}
              </div>

              {/* TODO: Phần khuyến mãi (Promotion) cần có data từ API */}
              <div className="promotion-info"> ... </div>

              {/* TODO: Phần biến thể (Variants) cần có data từ API */}

              <div className="product-quantity">
                <h3>Số lượng</h3>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn minus"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={totalStock}
                    readOnly
                  />
                  <button
                    className="quantity-btn plus"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <span className="stock-available">
                    {totalStock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Tồn kho chi tiết */}
              {product.inventories && product.inventories.length > 0 && (
                <div className="product-inventory" style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}><i className="fas fa-warehouse"></i> Tồn kho tại các chi nhánh:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#555' }}>
                    {product.inventories.map((inv, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: index < product.inventories.length - 1 ? '1px dashed #ddd' : 'none', paddingBottom: index < product.inventories.length - 1 ? '8px' : '0' }}>
                        <span><i className="fas fa-map-marker-alt" style={{color: '#e74c3c'}}></i> {inv.store?.name}</span>
                        <strong style={{color: inv.quantity > 0 ? '#2ecc71' : '#e74c3c'}}>{inv.quantity} SP</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product.id, quantity)}
                >
                  <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>

          {/* === Product Tabs === */}
          <div className="product-tabs">
            {/* TODO: Cần logic JS để chuyển tab bằng React (useState) */}
            <div className="tabs-header">
              <div className="tab-header active" data-tab="description">
                Mô tả sản phẩm
              </div>
              <div className="tab-header" data-tab="specs">
                Thông số kỹ thuật
              </div>
              <div className="tab-header" data-tab="reviews">
                Đánh giá
              </div>
            </div>
            <div className="tabs-content">
              {/* Description Tab (Dữ liệu từ API) */}
              <div className="tab-content active" id="description">
                {/* Dùng dangerouslySetInnerHTML nếu description là HTML, hoặc <p> nếu là text thường */}
                <p>{product.description}</p>
              </div>

              {/* === (ĐANG CHỜ API) === */}
              <div className="tab-content" id="specs">
                <h2>Thông số kỹ thuật chi tiết</h2>
                <p>...(Chờ API/Trường 'specs' trong model Product)...</p>
              </div>

              {/* === (ĐANG CHỜ API) === */}
              <div className="tab-content" id="reviews">
                <h2>Đánh giá từ khách hàng</h2>
                <p>...(Chờ API /api/products/:id/reviews)...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductDetailPage;

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, BASE_URL } from '../api.js';


const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

const ServiceCard = ({ service }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {/* Có thể chỉnh sửa đường dẫn đến trang chi tiết dịch vụ sau nếu có */}
        <Link to={`/service/${service.id}`}>
          <img src={service.thumbnail || 'https://via.placeholder.com/300x200?text=Service'} alt={service.name} />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`/service/${service.id}`}>
          <h3 className="product-name">{service.name}</h3>
        </Link>
        <div className="product-specs">
          <p>
            {service.description?.substring(0, 100) || "Xem chi tiết dịch vụ..."}
          </p>
        </div>
        <div className="product-price">
          <span className="current-price">{formatCurrency(service.price)}</span>
        </div>
        <Link to={`/book-service/${service.id}`} className="add-to-cart" style={{ display: 'block', textAlign: 'center', background: '#FFC107', color: '#000', padding: '10px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px', textDecoration: 'none' }}>Đặt lịch ngay</Link>
      </div>
    </div>
  );
};

function ServicePage() {
  const [services, setServices] = useState([]);
  const [categoryName, setCategoryName] = useState("Tất cả dịch vụ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.name &&
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/service-categories`);
        if (response.data.success) {
          setAllCategories(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách danh mục dịch vụ:", err);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      let url = `${API_URL}/services?active=true`;

      try {
        if (categoryId && categoryId !== 'all') {
          url = `${API_URL}/services/category/${categoryId}`;
        }

        const response = await axios.get(url);

        if (response.data.success) {
          setServices(response.data.data);

          if (categoryId && categoryId !== 'all' && response.data.data.length > 0) {
            setCategoryName(response.data.data[0].category.name);
          } else if (!categoryId || categoryId === 'all') {
            setCategoryName("Tất cả dịch vụ");
          } else {
            const currentCat = allCategories.find((cat) => cat.id.toString() === categoryId);
            setCategoryName(currentCat ? currentCat.name : "Danh mục dịch vụ");
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };

    if (allCategories.length > 0 || !categoryId) {
      fetchServices();
    }
  }, [categoryId, allCategories]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    if (newCategoryId === "all") {
      navigate("/services");
    } else {
      navigate(`/services/category/${newCategoryId}`);
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
            <li><i className="fas fa-angle-right"></i></li>
            <li>{categoryName}</li>
          </ul>
        </div>
      </section>

      <main className="category-page">
        <div className="container">
          <div className="category-header">
            <h1>{categoryName}</h1>
            <div className="category-tools-bar">
              <div className="category-select-wrapper">
                <label htmlFor="service-category-select">Danh mục:</label>
                <select
                  id="service-category-select"
                  value={categoryId || "all"}
                  onChange={handleCategoryChange}
                  className="custom-select"
                >
                  <option value="all">Tất cả dịch vụ</option>
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="product-search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>

            <p className="product-count">Hiển thị {filteredServices.length} dịch vụ</p>
          </div>

          <div className="category-content">
            <section className="products-section">
              {loading && <p>Đang tải dịch vụ...</p>}
              {error && <p>Lỗi: {error}</p>}

              <div className="products-grid">
                {!loading &&
                  filteredServices.map((service) => (
                    <ServiceCard service={service} key={service.id} />
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default ServicePage;

import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  // TODO: Số lượng giỏ hàng này cần được lấy từ API hoặc Context khi có auth
  const { totalItems } = useCart(); // Lấy số lượng từ Context
  const { user, logout } = useAuth(); // Lấy thông tin user
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Gọi hàm đăng xuất
    navigate("/login"); // Chuyển về trang login
  };

  return (
    <header>
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <Link to="/">
              <i className="fas fa-laptop-code"></i> Tech<span>Zone</span>
            </Link>
          </div>
          <nav className="nav-links">
            <NavLink to="/" end>
              Trang chủ
            </NavLink>
            <NavLink to="/products">Danh sách sản phẩm</NavLink>
            <NavLink to="/services">Danh sách dịch vụ</NavLink>
          </nav>
          <div className="nav-icons">
            {user ? (
              // Nếu ĐÃ đăng nhập: Hiện tên user + Nút đăng xuất
              <>
                <Link to="/account" title="Thông tin tài khoản" style={{ marginRight: '10px' }}>
                  <i className="fa-solid fa-id-card"></i>
                  <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  title="Đăng xuất"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#f8f1f1ff', marginRight: '15px', transform: 'translateY(-10px)' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </>
            ) : (
              // Nếu CHƯA đăng nhập: Hiện nút Login
              <Link to="/login" title="Đăng nhập" style={{ marginRight: '15px' }}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
              </Link>
            )}
            <Link
              to="/cart"
              title="Giỏ hàng"
              className={`cart-icon ${totalItems > 0 ? "active" : ""}`}
            >
              <i className="fas fa-shopping-cart"></i>
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>TechZone</h3>
            <p>Chuyên cung cấp các sản phẩm điện tử, gaming gear chất lượng cao với giá tốt nhất thị trường.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Liên kết</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><Link to="/account">Tài khoản</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Hỗ trợ</h3>
            <ul>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Liên hệ</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Số 1 Đại Cồ Việt, phường Bạch Mai, quận Hai Bà Trưng, thành phố Hà Nội.</li>
              <li><i className="fas fa-phone"></i> 0987962495</li>
              <li><i className="fas fa-envelope"></i> tuan.na225772@sis.hust.edu.vn</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 TechZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
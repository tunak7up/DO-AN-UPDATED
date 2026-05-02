import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function AdminHeader() {
  const { user } = useAuth();
  
  // Fake Role kiểm tra nếu context chưa load kịp
  const userRole = user?.role || user?.role_name || 'ROLE_ADMIN';

  // Điều kiện hiển thị menu
  const canViewOrders = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER'].includes(userRole);
  const canCreateOrders = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_SALES_STAFF'].includes(userRole);
  const canViewAppointments = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER', 'ROLE_TECHNICAL_STAFF'].includes(userRole);
  const canViewInventory = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_SALES_STAFF'].includes(userRole);
  const canViewServicesAndProducts = ['ROLE_ADMIN', 'ROLE_DIRECTOR'].includes(userRole);
  const canViewUsersAndStores = ['ROLE_ADMIN', 'ROLE_DIRECTOR'].includes(userRole);
  const isShipper = userRole === 'ROLE_SHIPPER';

  return (
    <header>
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <Link to="/admin">
              <i className="fas fa-laptop-code"></i> Tech<span>Zone</span>
            </Link>
          </div>
          <nav className="nav-links">
            <NavLink to="/">Trang chủ</NavLink>
            
            {isShipper && <NavLink to="/admin/shipper">Giao hàng</NavLink>}
            {canViewOrders && <NavLink to="/admin/orders">Quản lý đơn hàng</NavLink>}
            {canCreateOrders && <NavLink to="/admin/create-order">Tạo đơn hàng</NavLink>}
            {canViewInventory && <NavLink to="/admin/inventory">Quản lý kho</NavLink>}
            
            {canViewServicesAndProducts && (
              <>
                <NavLink to="/admin/products/new">Tạo sản phẩm</NavLink>
                <NavLink to="/admin/services">Quản lý dịch vụ</NavLink>
                <NavLink to="/admin/services/new">Tạo dịch vụ</NavLink>
              </>
            )}

            {canViewAppointments && <NavLink to="/admin/appointments">Quản lý Đặt lịch</NavLink>}
            
            {canViewUsersAndStores && (
              <>
                <NavLink to="/admin/users">Phân quyền</NavLink>
                <NavLink to="/admin/store-users">Phân Quản lý kho</NavLink>
              </>
            )}
          </nav>
          <div className="nav-icons">
            <div className="user-dropdown">
              <button className="user-btn">
                <i className="fas fa-user-circle"></i> Quản trị{" "}
                <i className="fas fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <Link to="/admin/account">
                  <i className="fas fa-user"></i> Tài khoản
                </Link>
                <a href="#">
                  <i className="fas fa-cog"></i> Cài đặt
                </a>
                <Link to="/logout">
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

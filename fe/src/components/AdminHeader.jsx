import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/admin/login");
  };
  
  // Fake Role kiểm tra nếu context chưa load kịp
  const userRole = user?.role || user?.role_name || 'ROLE_ADMIN';

  // Điều kiện hiển thị menu
  const canViewOrders = ['ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_ORDER_MANAGER', 'ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER'].includes(userRole);
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
            
            {isShipper && <NavLink to="/admin/shipper">Giao hàng</NavLink>}
            {canViewOrders && <NavLink to="/admin/orders">Quản lý đơn hàng</NavLink>}
            {canCreateOrders && <NavLink to="/admin/create-order">Tạo đơn hàng</NavLink>}
            {canViewInventory && <NavLink to="/admin/inventory">Quản lý kho</NavLink>}
            
            {canViewServicesAndProducts && (
              <div className="user-dropdown" style={{ display: 'inline-block', margin: '0 10px', paddingTop: '0' }}>
                <span style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', position: 'relative' }}>Sản phẩm & Dịch vụ<i className="fas fa-caret-down" style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)' }}></i></span>
                <div className="dropdown-content">
                  <NavLink to="/admin/products/new">Tạo sản phẩm</NavLink>
                  <NavLink to="/admin/products" end>Quản lý sản phẩm</NavLink>
                  <NavLink to="/admin/services/new">Tạo dịch vụ</NavLink>
                  <NavLink to="/admin/services" end>Quản lý dịch vụ</NavLink>
                </div>
              </div>
            )}

            {canViewAppointments && <NavLink to="/admin/appointments">Quản lý Đặt lịch</NavLink>}
            
            {canViewUsersAndStores && (
              <div className="user-dropdown" style={{ display: 'inline-block', margin: '0 10px', paddingTop: '0' }}>
                <span style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', position: 'relative' }}>Hệ thống<i className="fas fa-caret-down" style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)' }}></i></span>
                <div className="dropdown-content">
                  <NavLink to="/admin/users">Phân quyền</NavLink>
                  <NavLink to="/admin/store-users">Phân Quản lý kho</NavLink>
                </div>
              </div>
            )}
          </nav>
          <div className="nav-icons">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/admin/account" title="Thông tin tài khoản" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', textDecoration: 'none', color: '#f8f1f1ff', marginRight: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-solid fa-id-card"></i>
                    <span className="hide-on-mobile" style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name || 'Admin'}</span>
                  </div>
                  <span className="hide-on-mobile" style={{ fontSize: '12px', color: '#ddd', marginTop: '2px' }}>{userRole}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  title="Đăng xuất"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#f8f1f1ff', marginRight: '15px', transform: 'translateY(0)' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link to="/admin/login">Đăng nhập</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

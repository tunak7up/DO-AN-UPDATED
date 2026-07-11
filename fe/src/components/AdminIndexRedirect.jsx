import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminIndexRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/admin/login" replace />;

  const role = user.role || user.role_name;

  // Điều hướng dựa trên Role để tránh lỗi 403 API
  if (["ROLE_ADMIN", "ROLE_DIRECTOR", "ROLE_ORDER_MANAGER", "ROLE_CASHIER"].includes(role)) {
    return <Navigate to="orders" replace />;
  }
  
  if (["ROLE_WAREHOUSE_MANAGER"].includes(role)) {
    return <Navigate to="inventory" replace />;
  }
  
  if (["ROLE_TECHNICAL_STAFF"].includes(role)) {
    return <Navigate to="appointments" replace />;
  }
  
  if (["ROLE_SALES_STAFF"].includes(role)) {
    return <Navigate to="create-order" replace />;
  }
  
  if (role === "ROLE_SHIPPER") {
    return <Navigate to="shipper" replace />;
  }

  // Fallback an toàn nhất: ai cũng được xem thông tin cá nhân
  return <Navigate to="account" replace />;
};

export default AdminIndexRedirect;

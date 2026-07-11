import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Nếu chưa đăng nhập, đá về trang đăng nhập Admin
    return <Navigate to="/admin/login" replace />;
  }

  const userRole = user.role || user.role_name;
  
  // Khách hàng thông thường không được vào khu vực Admin
  if (userRole === "ROLE_USER") {
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ, cho phép render các route con (Layout và Pages)
  return <Outlet />;
};

export default AdminRoute;

import React from "react";
// === MỚI: Thêm 'Outlet' ===
import { Routes, Route, Outlet } from "react-router-dom";

// Layouts & Pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ServicePage from "./pages/ServicePage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BookServicePage from "./pages/BookServicePage";

// === MỚI: Import 2 component của Admin ===
import AdminHeader from "./components/AdminHeader";
import InventoryPage from "./pages/InventoryPage";
import AddProductPage from "./pages/AddProductPage";
import AddServicePage from "./pages/AddServicePage";
import ServiceListPage from "./pages/ServiceListPage";
import AppointmentManagePage from "./pages/AppointmentManagePage";
import StoreUserManagePage from "./pages/StoreUserManagePage";
import AdminCreateOrderPage from "./pages/AdminCreateOrderPage";
import AdminImportGoodsPage from "./pages/AdminImportGoodsPage";
import ShipperDashboard from "./pages/ShipperDashboard";
import EditProductPage from "./pages/EditProductPage";
import ProductManagePage from "./pages/ProductManagePage";
import AdminAccountPage from "./pages/AdminAccountPage";
// ======================================
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderManagePage from "./pages/OrderManagePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserManagePage from "./pages/UserManagePage";

import "./App.css";

const UserLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const AdminLayout = () => (
  <>
    <AdminHeader />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <Routes>
        {/* === CÁC ROUTE CÔNG KHAI (dùng UserLayout) === */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<CategoryPage />} />
          <Route
            path="products/category/:categoryId"
            element={<CategoryPage />}
          />
          <Route path="services" element={<ServicePage />} />
          <Route
            path="services/category/:categoryId"
            element={<ServicePage />}
          />
          <Route path="service/:serviceId" element={<ServiceDetailPage />} />
          <Route path="book-service/:serviceId" element={<BookServicePage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          {/* Thêm các route user khác ở đây (cart, login...) */}
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* === CÁC ROUTE ADMIN (dùng AdminLayout) === */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route index element={<AdminDashboard />} /> {/* Trang chủ admin */}
          <Route path="account" element={<AdminAccountPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="products" element={<ProductManagePage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/edit/:productId" element={<EditProductPage />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="services/new" element={<AddServicePage />} />
          <Route path="appointments" element={<AppointmentManagePage />} />
          <Route path="users" element={<UserManagePage />} />
          <Route path="store-users" element={<StoreUserManagePage />} />
          <Route path="orders" element={<OrderManagePage />} />
          <Route path="create-order" element={<AdminCreateOrderPage />} />
          <Route path="import" element={<AdminImportGoodsPage />} />
          <Route path="shipper" element={<ShipperDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

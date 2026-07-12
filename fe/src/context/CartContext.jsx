import { API_URL, BASE_URL } from "../api.js";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (user && user.id) {
      fetchCart();
    } else {
      // Nếu logout, xóa giỏ hàng trong state
      setCart(null);
      setTotalItems(0);
      setCartTotal(0);
    }
  }, [user]);

  // Hàm tính toán tổng số lượng và tổng tiền
  const calculateTotals = (cartData) => {
    if (!cartData || !cartData.items) {
      setTotalItems(0);
      setCartTotal(0);
      return;
    }

    const count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartData.items.reduce((sum, item) => {
      // Giá hiện tại (đã giảm giá)
      const price =
        item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    setTotalItems(count);
    setCartTotal(total);
  };

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/cart/user/${user.id}`, config);
      if (res.data.success) {
        setCart(res.data.data);
        calculateTotals(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Thêm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${API_URL}/cart/add`,
        {
          user_id: user.id, // Dùng user.id động
          product_id: productId,
          quantity: quantity,
        },
        config,
      );
      if (res.data.success) {
        setCart(res.data.data);
        calculateTotals(res.data.data);
        alert("Đã thêm vào giỏ!");
      }
    } catch (error) {
      console.error("Lỗi thêm giỏ:", error);
      alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  // Cập nhật số lượng item
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Cập nhật giao diện trước khi gọi API để mượt hơn
      const res = await axios.put(
        `${API_URL}/cart/item/${itemId}`,
        {
          quantity: newQuantity,
        },
        config,
      );

      if (res.data.success) {
        fetchCart(); // Tải lại giỏ để đồng bộ chuẩn xác
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert(error.response?.data?.message || "Lỗi cập nhật số lượng");
      fetchCart(); // Re-fetch to revert the optimistic UI update if failed
    }
  };

  // Xóa item
  const removeFromCart = async (itemId) => {
    if (!window.confirm("Bạn muốn xóa sản phẩm này?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/cart/item/${itemId}`, config);
      fetchCart();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        cartTotal,
        addToCart,
        fetchCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

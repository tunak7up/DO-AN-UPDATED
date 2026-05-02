import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_URL = "http://localhost:3000/api";
const USER_ID = 1; // Hardcode userId vì chưa có login

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
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
    if (!user) return; // Bảo vệ
    try {
      const res = await axios.get(`${API_URL}/cart/user/${user.id}`); // Dùng user.id động
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
      const res = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.id, // Dùng user.id động
        product_id: productId,
        quantity: quantity,
      });
      if (res.data.success) {
        setCart(res.data.data);
        calculateTotals(res.data.data);
        alert("Đã thêm vào giỏ!");
      }
    } catch (error) {
      console.error("Lỗi thêm giỏ:", error);
    }
  };

  // Cập nhật số lượng item
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      // Optimistic update (Cập nhật giao diện trước khi gọi API để mượt hơn)
      const res = await axios.put(`${API_URL}/cart/item/${itemId}`, {
        quantity: newQuantity,
      });

      if (res.data.success) {
        fetchCart(); // Tải lại giỏ để đồng bộ chuẩn xác
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // Xóa item
  const removeFromCart = async (itemId) => {
    if (!window.confirm("Bạn muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`${API_URL}/cart/item/${itemId}`);
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

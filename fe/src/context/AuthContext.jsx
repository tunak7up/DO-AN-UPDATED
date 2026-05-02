import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // --- SỬA Ở ĐÂY: Lấy dữ liệu ngay khi khởi tạo state (Lazy Initialization) ---
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  // --------------------------------------------------------------------------

  // (Đã xóa useEffect cũ vì không cần thiết nữa)

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        
        // Trả về user data
        return { success: true, user: user }; 
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi đăng nhập' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      return res.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi đăng ký' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
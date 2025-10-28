import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Tạo Context
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user hiện tại
  const fetchUserInfo = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
      // Token không hợp lệ, xóa đi
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cấu hình axios với token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Lấy thông tin user từ token
      fetchUserInfo();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token, fetchUserInfo]);

  // Đăng ký
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password
      });

      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true, message: 'Đăng ký thành công!' };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại!' 
      };
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại!' 
      };
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

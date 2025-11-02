import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export default function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!formData.name.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Prepare data to send
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role
    };

    // Only include password if provided
    if (formData.password.trim()) {
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      userData.password = formData.password;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.USERS, userData);
      setSuccess(response.data.message || "Thêm người dùng thành công!");
      
      // Reset form
      setFormData({ name: "", email: "", password: "", role: "user" });
      
      // Notify UserList
      window.dispatchEvent(new Event("userListChanged"));
      
      // Navigate to users list after 1.5s
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error) {
      console.error('Error adding user:', error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi thêm người dùng";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '720px', marginTop: '40px' }}>
      <div className="card">
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Thêm người dùng mới
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            Tạo tài khoản người dùng mới trong hệ thống
          </p>
        </div>
        
        <div className="alert alert-info" style={{ marginBottom: '28px' }}>
          <strong>💡 Lưu ý:</strong> Nếu không nhập mật khẩu, hệ thống sẽ tự động tạo mật khẩu mặc định là <code style={{ 
            backgroundColor: '#fff', 
            padding: '3px 8px', 
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '13px'
          }}>123456</code>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Tên <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Mật khẩu <span style={{ color: '#64748b', fontWeight: 'normal' }}>(Tùy chọn)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Để trống nếu dùng mật khẩu mặc định (123456)"
              disabled={loading}
            />
            {formData.password && formData.password.length > 0 && formData.password.length < 6 && (
              <small style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                Mật khẩu phải có ít nhất 6 ký tự
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Vai trò <span className="required">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Đang thêm...' : 'Thêm người dùng'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/users')}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Mặc định là user
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Xóa lỗi khi user nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    
    setLoading(false);

    if (result.success) {
      alert(result.message);
      navigate('/'); // Chuyển về trang chủ sau khi đăng ký thành công
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>📝 Đăng Ký Tài Khoản</h2>
        
        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '5px',
            border: '1px solid #ef5350'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Vai trò:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
                backgroundColor: loading ? '#f5f5f5' : 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="user">👤 User (Người dùng thường)</option>
              <option value="admin">👑 Admin (Quản trị viên)</option>
            </select>
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '5px',
              marginBottom: 0 
            }}>
              💡 Chọn <strong>Admin</strong> nếu bạn muốn có quyền quản lý toàn bộ hệ thống
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}

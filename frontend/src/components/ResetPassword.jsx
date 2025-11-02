import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.token.trim()) {
      setError('Vui lòng nhập token reset');
      return;
    }

    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });

      setSuccess(response.data.message);
      
      // Alert và chuyển về trang login sau 2 giây
      alert('✅ Đổi mật khẩu thành công!\n\nBạn có thể đăng nhập với mật khẩu mới.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '500px' }}>
        <h2>🔑 Đặt Lại Mật Khẩu</h2>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          Nhập token và mật khẩu mới của bạn
        </p>

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ {success}
            <p style={{ 
              marginTop: '10px', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ⏳ Đang chuyển về trang đăng nhập...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🔑 Reset Token: <span className="required">*</span></label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Paste token đã nhận từ email/form trước"
              disabled={loading}
              style={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <small style={{ 
              color: '#666', 
              fontSize: '13px',
              display: 'block',
              marginTop: '5px'
            }}>
              Token bạn đã nhận từ form Quên Mật Khẩu
            </small>
          </div>

          <div className="form-group">
            <label>🔒 Mật khẩu mới: <span className="required">*</span></label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              disabled={loading}
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>🔒 Xác nhận mật khẩu: <span className="required">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
              style={{ fontSize: '16px' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? '⏳ Đang xử lý...' : '💾 Đổi Mật Khẩu'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Link to="/forgot-password" style={{ 
            color: '#2196F3', 
            textDecoration: 'none',
            marginRight: '15px'
          }}>
            ← Quên mật khẩu?
          </Link>
          <Link to="/login" style={{ 
            color: '#2196F3', 
            textDecoration: 'none' 
          }}>
            Đăng nhập
          </Link>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#e65100'
        }}>
          <strong>⚠️ Quan trọng:</strong>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>Token chỉ dùng được <strong>1 lần</strong></li>
            <li>Token hết hạn sau <strong>15 phút</strong></li>
            <li>Sau khi đổi, bạn phải đăng nhập lại</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

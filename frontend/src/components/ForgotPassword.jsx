import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', {
        email
      });

      setSuccess(response.data.message);
      setResetToken(response.data.token);
      
      // Hiển thị token để user copy (trong thực tế sẽ gửi qua email)
      alert(`✅ Token reset password của bạn:\n\n${response.data.token}\n\n⚠️ Vui lòng copy token này để đổi mật khẩu!\n\nToken có hiệu lực trong 15 phút.`);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '500px' }}>
        <h2>🔐 Quên Mật Khẩu</h2>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          Nhập email của bạn để nhận token reset password
        </p>

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ {success}
            {resetToken && (
              <div style={{ marginTop: '15px' }}>
                <strong>🔑 Reset Token:</strong>
                <div style={{
                  backgroundColor: '#fff',
                  padding: '12px',
                  borderRadius: '5px',
                  marginTop: '8px',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  border: '2px dashed #4caf50',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(resetToken);
                  alert('✅ Đã copy token!');
                }}
                title="Click để copy"
                >
                  {resetToken}
                </div>
                <small style={{ 
                  display: 'block', 
                  marginTop: '8px', 
                  color: '#666',
                  fontSize: '12px'
                }}>
                  💡 Click vào token để copy
                </small>
                <Link to="/reset-password">
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '15px', width: '100%' }}
                  >
                    Đổi Mật Khẩu Ngay →
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email đã đăng ký:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              disabled={loading}
              style={{ fontSize: '16px' }}
            />
            <small style={{ 
              color: '#666', 
              fontSize: '13px',
              display: 'block',
              marginTop: '5px'
            }}>
              Nhập email tài khoản của bạn để nhận token reset password
            </small>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? '⏳ Đang xử lý...' : '📧 Gửi Token Reset'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Link to="/login" style={{ color: '#2196F3', textDecoration: 'none' }}>
            ← Quay lại đăng nhập
          </Link>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1976d2'
        }}>
          <strong>ℹ️ Lưu ý:</strong>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>Token có hiệu lực trong <strong>15 phút</strong></li>
            <li>Mỗi token chỉ dùng được <strong>1 lần</strong></li>
            <li>Trong production, token sẽ được gửi qua email</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

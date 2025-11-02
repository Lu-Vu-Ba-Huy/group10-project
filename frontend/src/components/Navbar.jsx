import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav style={{
      backgroundColor: '#2196F3',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
          🏠 Trang Chủ
        </Link>
        
        {isAuthenticated && (
          <>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
              👤 Profile
            </Link>
            
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>
                  👑 Admin Panel
                </Link>
                <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>
                  👥 Quản Lý User
                </Link>
                <Link to="/add-user" style={{ color: 'white', textDecoration: 'none' }}>
                  ➕ Thêm User
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '14px' }}>
              👤 Xin chào, <strong>{user?.name}</strong>
            </span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🚪 Đăng Xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                🔐 Đăng Nhập
              </button>
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                📝 Đăng Ký
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

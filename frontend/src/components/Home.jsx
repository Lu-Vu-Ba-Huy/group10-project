import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  const renderAuthenticatedContent = () => {
    if (!user) {
      return null;
    }

    const isAdmin = user.role === 'admin';

    return (
      <>
        <p className="home-subtitle">
          Xin chào <strong>{user.name || 'bạn'}</strong>! Bạn đã đăng nhập vào hệ thống.
        </p>

        <div className="home-badges">
          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
            {isAdmin ? 'Quản trị viên' : 'Người dùng'}
          </span>
          <span className="badge badge-info">Email: {user.email}</span>
        </div>

        <div className="home-actions">
          {isAdmin ? (
            <>
              <button type="button" className="home-btn primary" onClick={handleNavigate('/users')}>
                Quản lý người dùng
              </button>
              <button type="button" className="home-btn outline" onClick={handleNavigate('/add-user')}>
                Thêm người dùng mới
              </button>
            </>
          ) : (
            <>
              <button type="button" className="home-btn primary" onClick={handleNavigate('/profile')}>
                Xem hồ sơ của bạn
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  const renderGuestContent = () => (
    <>
      <p className="home-subtitle">
        Vui lòng đăng nhập để sử dụng đầy đủ tính năng của hệ thống.
      </p>
      <div className="home-actions">
        <button type="button" className="home-btn primary" onClick={handleNavigate('/login')}>
          Đăng nhập ngay
        </button>
        <button type="button" className="home-btn outline" onClick={handleNavigate('/register')}>
          Tạo tài khoản mới
        </button>
      </div>
    </>
  );

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1 className="home-title">🏠 Chào mừng đến với hệ thống quản lý User</h1>

        {loading ? (
          <p className="home-subtitle">Đang tải thông tin đăng nhập...</p>
        ) : isAuthenticated ? (
          renderAuthenticatedContent()
        ) : (
          renderGuestContent()
        )}
      </div>
    </div>
  );
};

export default Home;



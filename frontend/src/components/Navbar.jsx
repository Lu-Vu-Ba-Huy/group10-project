import React, { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const closeMenu = () => setMenuOpen(false);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path) => () => {
    closeMenu();
    navigate(path);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      closeMenu();
      logout();
      navigate('/login');
    }
  };

  React.useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const renderNavLink = (to, label, options = {}) => (
    <NavLink
      to={to}
      end={options.end}
      className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
      onClick={closeMenu}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="navbar-logo-icon" role="img" aria-label="Home">
              🏠
            </span>
            <div className="navbar-logo-text">
              <span className="navbar-title">User Manager</span>
              <span className="navbar-subtitle">Trang quản lý người dùng</span>
            </div>
          </NavLink>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

        <div className={`navbar-collapse${isMenuOpen ? ' open' : ''}`}>
          <nav className="navbar-links">
            {renderNavLink('/', 'Trang chủ', { end: true })}

            {isAuthenticated && (
              <>
                {renderNavLink('/profile', 'Hồ sơ cá nhân')}

                {isAdmin && (
                  <>
                    {renderNavLink('/admin/users', 'Bảng điều khiển')}
                    {renderNavLink('/users', 'Quản lý user')}
                    {renderNavLink('/add-user', 'Thêm user')}
                  </>
                )}
              </>
            )}
          </nav>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <div className="navbar-user">
                  <span className="navbar-user-greeting">Xin chào,</span>
                  <span className="navbar-user-name">{user?.name || 'Người dùng'}</span>
                  <span className={`navbar-role ${isAdmin ? 'admin' : 'user'}`}>
                    {isAdmin ? 'Quản trị viên' : 'Thành viên'}
                  </span>
                </div>
                <div className="navbar-actions">
                  <button type="button" className="navbar-btn danger" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="navbar-actions">
                <button type="button" className="navbar-btn primary" onClick={handleNavigate('/login')}>
                  Đăng nhập
                </button>
                <button type="button" className="navbar-btn outline" onClick={handleNavigate('/register')}>
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

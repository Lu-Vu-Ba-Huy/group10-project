import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

export default function AdminUserList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Kiểm tra quyền Admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
    }
  }, [user, navigate]);

  // Hàm lấy danh sách users
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUsers(response.data.users);
      setError('');
    } catch (error) {
      console.error('Lỗi lấy danh sách users:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Lấy danh sách users khi component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Xóa user
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(`Đã xóa user "${userName}" thành công!`);
      setError('');
      
      // Reload danh sách
      fetchUsers();

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Lỗi xóa user:', error);
      setError(error.response?.data?.message || 'Không thể xóa user');
    }
  };

  // Thay đổi role
  const handleChangeRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!window.confirm(`Thay đổi role của "${userName}" thành ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess(`Đã cập nhật role thành ${newRole}!`);
      setError('');
      
      // Reload danh sách
      fetchUsers();

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Lỗi thay đổi role:', error);
      setError(error.response?.data?.message || 'Không thể thay đổi role');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>⏳ Đang tải...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="admin-header">
        <h2>👑 Quản Lý User (Admin)</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Tổng số user: <strong>{users.length}</strong>
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          ✅ {success}
        </div>
      )}

      <div className="table-container">
        <table className="table admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Ngày Tạo</th>
              <th style={{ textAlign: 'center', width: '200px' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  Chưa có user nào
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u._id} className={u._id === user?.id ? 'current-user-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    {u.name}
                    {u._id === user?.id && (
                      <span className="badge badge-info" style={{ marginLeft: '10px' }}>
                        (Bạn)
                      </span>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      {u._id !== user?.id && (
                        <>
                          <button
                            className="btn-small btn-warning"
                            onClick={() => handleChangeRole(u._id, u.role, u.name)}
                            title="Thay đổi role"
                          >
                            🔄 Role
                          </button>
                          
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleDelete(u._id, u.name)}
                            title="Xóa user"
                          >
                            🗑️ Xóa
                          </button>
                        </>
                      )}
                      
                      {u._id === user?.id && (
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          Không thể thao tác với chính mình
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h4 style={{ marginTop: 0, color: '#555' }}>📋 Hướng Dẫn:</h4>
        <ul style={{ marginBottom: 0, color: '#666' }}>
          <li>Chỉ <strong>Admin</strong> mới có thể xem trang này</li>
          <li>Click nút <strong>"🔄 Role"</strong> để thay đổi quyền User ↔️ Admin</li>
          <li>Click nút <strong>"🗑️ Xóa"</strong> để xóa user</li>
          <li>Không thể xóa hoặc thay đổi role của chính mình</li>
        </ul>
      </div>
    </div>
  );
}

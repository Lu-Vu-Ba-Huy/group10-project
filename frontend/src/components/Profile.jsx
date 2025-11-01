import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles.css';

export default function Profile() {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    createdAt: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Lấy thông tin profile khi component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Hàm lấy thông tin profile từ API
  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProfileData(response.data.user);
      setEditData({
        name: response.data.user.name,
        email: response.data.user.email,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      console.error('Lỗi lấy profile:', error);
      setError(error.response?.data?.message || 'Không thể tải thông tin profile');
    }
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  // Xử lý upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload lên backend
      const response = await axios.post(
        'http://localhost:3000/api/profile/upload-avatar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setProfileData({ ...profileData, avatar: response.data.avatarUrl });
      setSuccess('Cập nhật avatar thành công!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Upload avatar error:', error);
      setError(error.response?.data?.message || 'Upload avatar thất bại');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Xử lý cập nhật profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!editData.name.trim()) {
      setError('Tên không được để trống');
      return;
    }

    if (!editData.email.trim()) {
      setError('Email không được để trống');
      return;
    }

    // Nếu muốn đổi password
    if (editData.newPassword || editData.currentPassword) {
      if (!editData.currentPassword) {
        setError('Vui lòng nhập mật khẩu hiện tại');
        return;
      }
      if (!editData.newPassword) {
        setError('Vui lòng nhập mật khẩu mới');
        return;
      }
      if (editData.newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (editData.newPassword !== editData.confirmNewPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:3000/api/profile',
        {
          name: editData.name,
          email: editData.email,
          currentPassword: editData.currentPassword || undefined,
          newPassword: editData.newPassword || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess('Cập nhật thông tin thành công!');
      setProfileData(response.data.user);
      setIsEditing(false);
      
      // Reset password fields
      setEditData({
        ...editData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      // Reload lại thông tin
      await fetchProfile();

    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      setError(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: profileData.name,
      email: profileData.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '30px' }}>
      <div className="profile-card">
        <h2>👤 Thông Tin Cá Nhân</h2>

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

        {!isEditing ? (
          // Chế độ xem
          <div className="profile-view">
            {/* Avatar Section */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 15px',
                border: '4px solid #2196F3',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt="Avatar" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <div style={{
                    fontSize: '64px',
                    color: '#999'
                  }}>
                    👤
                  </div>
                )}
              </div>

              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                disabled={uploadingAvatar}
              />
              
              <button 
                className="btn-secondary"
                onClick={() => document.getElementById('avatar-upload').click()}
                disabled={uploadingAvatar}
                type="button"
                style={{ marginBottom: '10px' }}
              >
                {uploadingAvatar ? '⏳ Đang upload...' : '📷 Đổi Avatar'}
              </button>

              {uploadingAvatar && (
                <p style={{ color: '#2196F3', fontSize: '14px', marginTop: '5px' }}>
                  Đang tải ảnh lên...
                </p>
              )}
            </div>

            <div className="profile-item">
              <label>Họ và tên:</label>
              <p>{profileData.name}</p>
            </div>

            <div className="profile-item">
              <label>Email:</label>
              <p>{profileData.email}</p>
            </div>

            <div className="profile-item">
              <label>Ngày tạo tài khoản:</label>
              <p>{profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>

            <button 
              className="btn-primary"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '20px' }}
            >
              ✏️ Chỉnh Sửa Thông Tin
            </button>
          </div>
        ) : (
          // Chế độ chỉnh sửa
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Họ và tên: <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email: <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                disabled={loading}
              />
            </div>

            <hr style={{ margin: '20px 0' }} />
            
            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>
              🔒 Đổi Mật Khẩu (Tùy chọn)
            </h3>

            <div className="form-group">
              <label>Mật khẩu hiện tại:</label>
              <input
                type="password"
                name="currentPassword"
                value={editData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={editData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={editData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
            </div>

            <div className="button-group" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
              
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

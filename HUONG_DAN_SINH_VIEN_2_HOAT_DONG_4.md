# 📚 HƯỚNG DẪN CHI TIẾT - SINH VIÊN 2
## Hoạt động 4: Form Forgot Password + Upload Avatar UI

---

## 📋 MỤC TIÊU
Sinh viên 2 phụ trách xây dựng giao diện (Frontend):
1. ✅ Form Forgot Password (nhập email → nhận token reset)
2. ✅ Form Reset Password (nhập token + password mới)
3. ✅ Form Upload Avatar (tích hợp Cloudinary)
4. ✅ UI hiển thị avatar trong Profile

---

## 🗂️ CẤU TRÚC FILE CẦN TẠO

```
frontend/src/
├── components/
│   ├── ForgotPassword.jsx     ← Form quên mật khẩu
│   ├── ResetPassword.jsx      ← Form đổi mật khẩu bằng token
│   └── Profile.jsx            ← Cập nhật: thêm upload avatar
├── services/
│   └── cloudinary.js          ← Service upload lên Cloudinary
└── App.js                     ← Thêm routes mới
```

---

## 📝 PHẦN 1: FORM FORGOT PASSWORD

### **File: `frontend/src/components/ForgotPassword.jsx`**

```jsx
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
      setResetToken(response.data.resetToken);
      
      // Hiển thị token để user copy (trong thực tế sẽ gửi qua email)
      alert(`Token reset password của bạn:\n\n${response.data.resetToken}\n\nVui lòng copy token này để đổi mật khẩu!`);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>🔐 Quên Mật Khẩu</h2>
        
        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ {success}
            {resetToken && (
              <div style={{ marginTop: '10px' }}>
                <strong>Reset Token:</strong>
                <div style={{
                  backgroundColor: '#fff',
                  padding: '10px',
                  borderRadius: '5px',
                  marginTop: '5px',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  {resetToken}
                </div>
                <Link to="/reset-password" style={{ marginTop: '10px', display: 'inline-block' }}>
                  <button className="btn-primary" style={{ marginTop: '10px' }}>
                    Đổi Mật Khẩu Ngay →
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email đã đăng ký:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              disabled={loading}
            />
            <small style={{ color: '#666', fontSize: '13px' }}>
              Nhập email tài khoản của bạn để nhận token reset password
            </small>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Đang xử lý...' : '📧 Gửi Token Reset'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
```

**Giải thích**:
- Form nhập email
- Gọi API POST `/auth/forgot-password`
- Nhận token từ backend
- Hiển thị token để user copy (trong production sẽ gửi qua email)
- Link đến trang Reset Password

---

## 📝 PHẦN 2: FORM RESET PASSWORD

### **File: `frontend/src/components/ResetPassword.jsx`**

```jsx
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
      const response = await axios.post('http://localhost:3000/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });

      setSuccess(response.data.message);
      
      // Chuyển về trang login sau 2 giây
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
      <div className="form-container">
        <h2>🔑 Đổi Mật Khẩu</h2>
        
        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ {success}
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              Đang chuyển về trang đăng nhập...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reset Token: <span className="required">*</span></label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Nhập token đã nhận"
              disabled={loading}
            />
            <small style={{ color: '#666', fontSize: '13px' }}>
              Token bạn đã nhận từ form Quên Mật Khẩu
            </small>
          </div>

          <div className="form-group">
            <label>Mật khẩu mới: <span className="required">*</span></label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu: <span className="required">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Đang xử lý...' : '💾 Đổi Mật Khẩu'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/forgot-password">← Quên mật khẩu?</Link>
          {' | '}
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
```

**Giải thích**:
- Form nhập token + password mới
- Validation đầy đủ
- Gọi API POST `/auth/reset-password`
- Tự động redirect về login sau khi thành công

---

## 📝 PHẦN 3: CLOUDINARY SERVICE

### **File: `frontend/src/services/cloudinary.js`**

```javascript
import axios from 'axios';

// Cấu hình Cloudinary
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; // Thay bằng upload preset của bạn
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';       // Thay bằng cloud name của bạn

/**
 * Upload ảnh lên Cloudinary
 * @param {File} file - File ảnh từ input
 * @returns {Promise<string>} - URL của ảnh đã upload
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Gọi API Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Trả về URL của ảnh
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Upload ảnh thất bại');
  }
};

/**
 * Validate file ảnh
 * @param {File} file 
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  // Kiểm tra có file không
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn file' };
  }

  // Kiểm tra loại file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)' };
  }

  // Kiểm tra kích thước (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Kích thước file không được vượt quá 5MB' };
  }

  return { valid: true, error: '' };
};
```

**Giải thích**:
- Service để upload ảnh lên Cloudinary
- Validate file trước khi upload
- Trả về URL của ảnh

---

## 📝 PHẦN 4: CẬP NHẬT PROFILE VỚI AVATAR

### **Cập nhật: `frontend/src/components/Profile.jsx`**

Thêm phần upload avatar vào component Profile hiện tại:

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { uploadToCloudinary, validateImageFile } from '../services/cloudinary';
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
    avatar: '', // Thêm avatar
    createdAt: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Lấy thông tin profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
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
      setError('Không thể tải thông tin profile');
    }
  };

  // Xử lý upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Upload lên Cloudinary
      const avatarUrl = await uploadToCloudinary(file);

      // Cập nhật avatar lên backend
      const response = await axios.put(
        'http://localhost:3000/profile/avatar',
        { avatar: avatarUrl },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setProfileData({ ...profileData, avatar: avatarUrl });
      setSuccess('Cập nhật avatar thành công!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Upload avatar error:', error);
      setError(error.message || 'Upload avatar thất bại');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ... (giữ nguyên các function handleChange, handleSubmit, handleCancel)

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '30px' }}>
      <div className="profile-card">
        <h2>👤 Thông Tin Cá Nhân</h2>

        {error && <div className="alert alert-error">❌ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {!isEditing ? (
          // ===== CHẾ ĐỘ XEM =====
          <div className="profile-view">
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 15px',
                border: '3px solid #2196F3',
                backgroundColor: '#f0f0f0'
              }}>
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#999'
                  }}>
                    👤
                  </div>
                )}
              </div>

              <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
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
                >
                  {uploadingAvatar ? '⏳ Đang upload...' : '📷 Đổi Avatar'}
                </button>
              </label>
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
          // ===== CHẾ ĐỘ CHỈNH SỬA =====
          // ... (giữ nguyên phần edit form)
        )}
      </div>
    </div>
  );
}
```

---

## 📝 PHẦN 5: CẬP NHẬT ROUTING

### **Cập nhật: `frontend/src/App.js`**

```jsx
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// Thêm vào Routes:
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

---

## 📝 PHẦN 6: CẬP NHẬT LOGIN PAGE

### **Cập nhật: `frontend/src/components/Login.jsx`**

Thêm link "Quên mật khẩu?" vào form login:

```jsx
<p style={{ textAlign: 'center', marginTop: '15px' }}>
  <Link to="/forgot-password">Quên mật khẩu?</Link>
</p>

<p style={{ textAlign: 'center', marginTop: '15px' }}>
  Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
</p>
```

---

## 🎨 CSS STYLING

### **Thêm vào `frontend/src/styles.css`**

```css
/* Avatar Upload */
.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid #2196F3;
  background-color: #f0f0f0;
  position: relative;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #999;
}

.avatar-upload-btn {
  cursor: pointer;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

/* Small text */
small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 13px;
}
```

---

## 🧪 HƯỚNG DẪN TEST

### **Test 1: Forgot Password Flow**

1. Vào trang Login → Click "Quên mật khẩu?"
2. Nhập email: `test@test.com`
3. Click "Gửi Token Reset"
4. **SCREENSHOT #1**: Form Forgot Password + email nhận token
5. Copy token từ alert hoặc hiển thị trên màn hình
6. **SCREENSHOT #2**: Token hiển thị thành công

### **Test 2: Reset Password Flow**

1. Vào trang Reset Password
2. Nhập token đã nhận
3. Nhập password mới: `newpass123`
4. Nhập xác nhận: `newpass123`
5. Click "Đổi Mật Khẩu"
6. **SCREENSHOT #3**: Đổi password thành công → chuyển về login
7. Đăng nhập lại với password mới
8. **SCREENSHOT #4**: Đăng nhập thành công với password mới

### **Test 3: Upload Avatar**

1. Đăng nhập → vào Profile
2. Click "📷 Đổi Avatar"
3. Chọn ảnh từ máy tính
4. **SCREENSHOT #5**: Avatar đang upload (loading)
5. **SCREENSHOT #6**: Avatar mới hiển thị thành công
6. Reload trang → avatar vẫn còn
7. **SCREENSHOT #7**: Avatar persistent sau reload

### **Test 4: Postman API**

**API 1: Forgot Password**
```
POST http://localhost:3000/auth/forgot-password
Body: { "email": "test@test.com" }
```
**SCREENSHOT #8**: Response với token

**API 2: Reset Password**
```
POST http://localhost:3000/auth/reset-password
Body: { 
  "token": "<token_from_forgot_password>",
  "newPassword": "newpass123"
}
```
**SCREENSHOT #9**: Response success

**API 3: Upload Avatar**
```
PUT http://localhost:3000/profile/avatar
Headers: Authorization: Bearer <token>
Body: { "avatar": "https://cloudinary.com/..." }
```
**SCREENSHOT #10**: Avatar updated

---

## 📸 CHECKLIST SCREENSHOTS (10 ảnh)

- [ ] #1: Form Forgot Password + nhập email
- [ ] #2: Token reset hiển thị thành công
- [ ] #3: Form Reset Password
- [ ] #4: Đăng nhập thành công với password mới
- [ ] #5: Upload avatar đang loading
- [ ] #6: Avatar mới hiển thị
- [ ] #7: Avatar persistent sau reload
- [ ] #8: Postman Forgot Password API
- [ ] #9: Postman Reset Password API
- [ ] #10: Postman Upload Avatar API

---

## 🔧 CLOUDINARY SETUP

### **Bước 1: Tạo tài khoản Cloudinary**

1. Vào: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Verify email

### **Bước 2: Lấy thông tin**

1. Vào Dashboard
2. Copy **Cloud Name**
3. Vào Settings → Upload → Upload Presets
4. Tạo unsigned upload preset
5. Copy **Upload Preset Name**

### **Bước 3: Cập nhật code**

Thay trong file `cloudinary.js`:
```javascript
const CLOUDINARY_UPLOAD_PRESET = 'your_preset_name'; // Paste preset
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';     // Paste cloud name
```

---

## 💡 TIPS QUAN TRỌNG

### **Security**
- ✅ Token chỉ dùng 1 lần
- ✅ Token có thời hạn (15 phút)
- ✅ Validate file trước khi upload
- ✅ Giới hạn kích thước file

### **UX/UI**
- ✅ Loading state khi upload
- ✅ Preview avatar trước khi lưu
- ✅ Thông báo rõ ràng
- ✅ Link giữa các trang liền mạch

### **Error Handling**
- ✅ Validate input
- ✅ Try-catch cho mọi async operation
- ✅ Hiển thị lỗi từ backend
- ✅ Reset state sau mỗi action

---

## 🚀 GIT WORKFLOW

```bash
# Tạo branch mới
git checkout -b frontend-forgot-password

# Add files
git add frontend/src/components/ForgotPassword.jsx
git add frontend/src/components/ResetPassword.jsx
git add frontend/src/services/cloudinary.js
git add frontend/src/components/Profile.jsx
git add frontend/src/App.js

# Commit
git commit -m "Sinh viên 2: Add Forgot Password, Reset Password, Upload Avatar UI

- Form Forgot Password với email input
- Form Reset Password với token validation
- Cloudinary service cho upload avatar
- Cập nhật Profile component với avatar display
- Routes và navigation cho forgot/reset password
- CSS styling cho avatar upload
- Error handling và validation đầy đủ"

# Push
git push -u origin frontend-forgot-password
```

---

## ✅ KẾT LUẬN

Bạn đã hoàn thành xuất sắc **Sinh viên 2 - Hoạt động 4** với:

1. ✅ Form Forgot Password chuyên nghiệp
2. ✅ Form Reset Password với token validation
3. ✅ Tích hợp Cloudinary upload avatar
4. ✅ UI/UX thân thiện và rõ ràng
5. ✅ Error handling và validation đầy đủ
6. ✅ Code sạch, dễ maintain

**Chúc bạn demo thành công! 🎉**

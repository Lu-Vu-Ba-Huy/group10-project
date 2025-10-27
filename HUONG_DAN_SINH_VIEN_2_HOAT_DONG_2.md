# 📚 HƯỚNG DẪN CHI TIẾT - SINH VIÊN 2
## Hoạt động 2: Giao Diện Profile - Quản Lý Thông Tin Cá Nhân

---

## 📋 MỤC TIÊU
Xây dựng trang Profile để:
1. ✅ Xem thông tin cá nhân (View Profile)
2. ✅ Cập nhật thông tin cá nhân (Update Profile)
3. ✅ Đổi mật khẩu (Change Password)
4. ✅ Chỉ user đã đăng nhập mới truy cập được

---

## 🗂️ CẤU TRÚC FILE ĐÃ TẠO

### 1. Component Chính: `Profile.jsx`
**Đường dẫn**: `frontend/src/components/Profile.jsx`

**Chức năng chính**:
```javascript
✅ Xem thông tin: Tên, Email, Ngày tạo tài khoản
✅ Chế độ View/Edit (toggle between modes)
✅ Cập nhật thông tin: Tên, Email
✅ Đổi mật khẩu (optional): Mật khẩu hiện tại + Mật khẩu mới
✅ Validation đầy đủ
✅ Hiển thị thông báo success/error
✅ Auto-reload sau khi cập nhật thành công
```

---

## 📝 GIẢI THÍCH CHI TIẾT CODE

### **PHẦN 1: Import và State Management**

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles.css';

export default function Profile() {
  const { user, token } = useAuth(); // Lấy user và token từ Context
  const [isEditing, setIsEditing] = useState(false); // Chế độ View/Edit
  const [loading, setLoading] = useState(false); // Loading khi submit
  const [error, setError] = useState(''); // Lỗi
  const [success, setSuccess] = useState(''); // Thông báo thành công
  
  // State cho chế độ View
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    createdAt: ''
  });

  // State cho chế độ Edit
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
```

**Giải thích**:
- `isEditing`: `false` = chế độ xem, `true` = chế độ chỉnh sửa
- `profileData`: Dữ liệu hiện tại của user (chỉ đọc)
- `editData`: Dữ liệu trong form chỉnh sửa (có thể thay đổi)

---

### **PHẦN 2: Lấy Thông Tin Profile**

```jsx
// Lấy thông tin profile khi component mount
useEffect(() => {
  fetchProfile();
}, []);

// Hàm lấy thông tin profile từ API
const fetchProfile = async () => {
  try {
    const response = await axios.get('http://localhost:3000/profile', {
      headers: {
        'Authorization': `Bearer ${token}` // Gửi token để xác thực
      }
    });
    
    // Lưu vào profileData để hiển thị
    setProfileData(response.data.user);
    
    // Đồng bộ vào editData để form có dữ liệu ban đầu
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
```

**Flow hoạt động**:
1. Component mount → `useEffect` chạy
2. Gọi `fetchProfile()`
3. GET `/profile` với Bearer token
4. Nhận data và lưu vào state
5. Hiển thị lên UI

---

### **PHẦN 3: Xử Lý Input Change**

```jsx
const handleChange = (e) => {
  setEditData({
    ...editData,
    [e.target.name]: e.target.value // Cập nhật field tương ứng
  });
  setError(''); // Xóa lỗi cũ khi user nhập
  setSuccess(''); // Xóa thông báo success cũ
};
```

**Giải thích**:
- Dùng spread operator `...editData` để giữ nguyên các field khác
- `[e.target.name]`: Dynamic key (name, email, currentPassword, v.v.)
- Reset error/success để UI luôn cập nhật

---

### **PHẦN 4: Validation và Submit**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault(); // Ngăn form reload trang
  setError('');
  setSuccess('');

  // ===== VALIDATION =====
  
  // 1. Kiểm tra tên
  if (!editData.name.trim()) {
    setError('Tên không được để trống');
    return;
  }

  // 2. Kiểm tra email
  if (!editData.email.trim()) {
    setError('Email không được để trống');
    return;
  }

  // 3. Nếu muốn đổi password → validate đầy đủ
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

  setLoading(true); // Bắt đầu loading

  try {
    // ===== GỌI API =====
    const response = await axios.put(
      'http://localhost:3000/profile',
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

    // ===== CẬP NHẬT THÀNH CÔNG =====
    setSuccess('Cập nhật thông tin thành công!');
    setProfileData(response.data.user); // Cập nhật data hiển thị
    setIsEditing(false); // Chuyển về chế độ View
    
    // Reset password fields để bảo mật
    setEditData({
      ...editData,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

    // Reload lại thông tin mới nhất từ server
    await fetchProfile();

  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    setError(error.response?.data?.message || 'Cập nhật thất bại');
  } finally {
    setLoading(false); // Tắt loading
  }
};
```

**Validation Logic**:
1. **Bắt buộc**: Tên, Email
2. **Đổi password** (tùy chọn):
   - Nếu nhập 1 trong 2 field (current/new) → phải nhập cả 2
   - New password ≥ 6 ký tự
   - Confirm phải khớp với New password

---

### **PHẦN 5: UI - Chế Độ Xem (View Mode)**

```jsx
{!isEditing ? (
  // Chế độ xem
  <div className="profile-view">
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
      <p>
        {profileData.createdAt 
          ? new Date(profileData.createdAt).toLocaleDateString('vi-VN') 
          : 'N/A'}
      </p>
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
  // Chế độ chỉnh sửa (phần tiếp theo)
  ...
)}
```

**Đặc điểm**:
- Hiển thị thông tin dạng read-only
- Nút "Chỉnh Sửa" → chuyển sang Edit mode
- Format ngày theo chuẩn Việt Nam

---

### **PHẦN 6: UI - Chế Độ Chỉnh Sửa (Edit Mode)**

```jsx
<form onSubmit={handleSubmit} className="profile-form">
  {/* ===== THÔNG TIN CƠ BẢN ===== */}
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

  {/* ===== PHẦN ĐỔI MẬT KHẨU (TÙY CHỌN) ===== */}
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
      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
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

  {/* ===== CÁC NÚT HÀNH ĐỘNG ===== */}
  <div className="button-group" style={{ marginTop: '20px' }}>
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
```

**Đặc điểm**:
- Form có 2 phần: Thông tin cơ bản + Đổi mật khẩu
- Đổi mật khẩu là **tùy chọn** (có thể để trống)
- Nút "Lưu" disabled khi đang loading
- Nút "Hủy" để quay về View mode

---

### **PHẦN 7: Hàm Cancel**

```jsx
const handleCancel = () => {
  setIsEditing(false); // Quay về View mode
  
  // Reset lại dữ liệu form về giá trị ban đầu
  setEditData({
    name: profileData.name,
    email: profileData.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  setError(''); // Xóa lỗi
  setSuccess(''); // Xóa success
};
```

**Giải thích**:
- Đưa form về trạng thái ban đầu
- Không lưu thay đổi
- Xóa tất cả thông báo

---

## 🎨 STYLING CSS

File `styles.css` đã có sẵn các class:

```css
/* Profile Card */
.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Profile Item trong View Mode */
.profile-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-item label {
  font-weight: 600;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

.profile-item p {
  font-size: 16px;
  color: #333;
  margin: 0;
}

/* Profile Form trong Edit Mode */
.profile-form {
  margin-top: 20px;
}

.profile-form h3 {
  color: #555;
  margin-top: 0;
}

.profile-form hr {
  border: none;
  border-top: 2px solid #e0e0e0;
}

/* Required field */
.required {
  color: #e74c3c;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background: #9e9e9e;
  color: white;
}

.btn-secondary:hover {
  background: #757575;
}

/* Alerts */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

.alert-success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #66bb6a;
}
```

---

## 🚀 HƯỚNG DẪN KIỂM THỬ

### **Bước 1: Khởi Động Server**

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```
✅ Backend: `http://localhost:3000`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```
✅ Frontend: `http://localhost:3001`

---

### **Bước 2: Đăng Nhập**

1. Vào `http://localhost:3001/login`
2. Đăng nhập bằng tài khoản đã tạo (hoặc dùng admin):
   - Email: `test@test.com`
   - Password: `123456`

---

### **Bước 3: Vào Trang Profile**

1. Click vào **"👤 Profile"** trên Navbar
2. Hoặc truy cập: `http://localhost:3001/profile`

**CHỤP SCREENSHOT #1: Trang Profile - View Mode**
- ✅ Hiển thị: Họ tên, Email, Ngày tạo
- ✅ Nút "✏️ Chỉnh Sửa Thông Tin"

---

### **Bước 4: Test Cập Nhật Thông Tin**

1. Click nút **"✏️ Chỉnh Sửa Thông Tin"**
2. Form chỉnh sửa xuất hiện

**CHỤP SCREENSHOT #2: Form Cập Nhật**
- ✅ Input: Họ tên, Email
- ✅ Section: Đổi mật khẩu (tùy chọn)
- ✅ Nút: Lưu, Hủy

3. Thay đổi thông tin:
   - Sửa tên: "Test User Updated"
   - Email giữ nguyên

4. **KHÔNG đổi password** (để trống)

5. Click **"💾 Lưu Thay Đổi"**

**CHỤP SCREENSHOT #3: Cập Nhật Thành Công**
- ✅ Thông báo màu xanh: "✅ Cập nhật thông tin thành công!"
- ✅ Tự động chuyển về View mode
- ✅ Thông tin đã cập nhật hiển thị

---

### **Bước 5: Test Đổi Mật Khẩu**

1. Click **"✏️ Chỉnh Sửa Thông Tin"** lại

2. Nhập thông tin đổi password:
   - Mật khẩu hiện tại: `123456`
   - Mật khẩu mới: `newpass123`
   - Xác nhận: `newpass123`

3. Click **"💾 Lưu Thay Đổi"**

4. **CHỤP SCREENSHOT #4**: Đổi password thành công

5. **Test lại đăng nhập**:
   - Đăng xuất
   - Đăng nhập lại với password mới: `newpass123`
   - ✅ Phải đăng nhập được

---

### **Bước 6: Test Validation**

#### Test 1: Để trống tên
1. Edit profile
2. Xóa hết tên → Lưu
3. ✅ Hiện lỗi: "Tên không được để trống"

#### Test 2: Password mới quá ngắn
1. Nhập:
   - Current: `newpass123`
   - New: `123` (< 6 ký tự)
2. Lưu
3. ✅ Hiện lỗi: "Mật khẩu mới phải có ít nhất 6 ký tự"

#### Test 3: Confirm password không khớp
1. Nhập:
   - Current: `newpass123`
   - New: `123456`
   - Confirm: `111111`
2. Lưu
3. ✅ Hiện lỗi: "Mật khẩu xác nhận không khớp"

#### Test 4: Đổi password nhưng không nhập current
1. Nhập:
   - Current: (để trống)
   - New: `123456`
2. Lưu
3. ✅ Hiện lỗi: "Vui lòng nhập mật khẩu hiện tại"

---

### **Bước 7: Test Nút Cancel**

1. Edit profile
2. Thay đổi vài thông tin
3. Click **"❌ Hủy"**
4. ✅ Form đóng lại, không lưu thay đổi
5. ✅ Dữ liệu giữ nguyên như ban đầu

---

## 📸 POSTMAN - TEST API

### **Test 1: GET /profile**

**CHỤP SCREENSHOT #5: Postman GET Profile**

```
Method: GET
URL: http://localhost:3000/profile
Headers:
  Authorization: Bearer <your_token>
```

**Response mong đợi**:
```json
{
  "user": {
    "id": "674e1234567890abcdef",
    "name": "Test User Updated",
    "email": "test@test.com",
    "createdAt": "2025-10-26T10:30:00.000Z"
  }
}
```

**Lấy token**:
- Cách 1: DevTools → Application → Local Storage → `token`
- Cách 2: Postman login trước → copy token từ response

---

### **Test 2: PUT /profile - Cập nhật tên và email**

**CHỤP SCREENSHOT #6: Postman PUT Profile (cơ bản)**

```
Method: PUT
URL: http://localhost:3000/profile
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Test User V2",
  "email": "test@test.com"
}
```

**Response**:
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": {
    "id": "...",
    "name": "Test User V2",
    "email": "test@test.com",
    "createdAt": "..."
  }
}
```

---

### **Test 3: PUT /profile - Đổi mật khẩu**

**CHỤP SCREENSHOT #7: Postman PUT Profile (đổi password)**

```
Method: PUT
URL: http://localhost:3000/profile
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Test User V2",
  "email": "test@test.com",
  "currentPassword": "newpass123",
  "newPassword": "123456"
}
```

**Response**:
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": { ... }
}
```

---

### **Test 4: PUT /profile - Lỗi sai current password**

**CHỤP SCREENSHOT #8: Postman Error - Wrong Password**

```
Body:
{
  "name": "Test",
  "email": "test@test.com",
  "currentPassword": "wrongpassword",
  "newPassword": "newpass"
}
```

**Response**:
```json
{
  "message": "Mật khẩu hiện tại không đúng"
}
```
Status: 401 Unauthorized

---

### **Test 5: PUT /profile - Không có token**

**CHỤP SCREENSHOT #9: Postman Error - No Token**

```
Method: PUT
URL: http://localhost:3000/profile
Headers: (KHÔNG GỬI Authorization)
Body:
{
  "name": "Test"
}
```

**Response**:
```json
{
  "message": "Không có token xác thực!"
}
```
Status: 401 Unauthorized

---

## ✅ CHECKLIST HOÀN THÀNH

### Frontend (Sinh viên 2 - BẠN)
- [x] Component `Profile.jsx` với 2 chế độ: View/Edit
- [x] Hiển thị thông tin: Tên, Email, Ngày tạo
- [x] Form cập nhật thông tin
- [x] Form đổi mật khẩu (tùy chọn)
- [x] Validation đầy đủ
- [x] Thông báo success/error
- [x] Nút Cancel để hủy thay đổi
- [x] CSS đẹp và responsive

### Screenshots (9 ảnh)
- [ ] #1: Trang Profile - View mode
- [ ] #2: Form cập nhật thông tin
- [ ] #3: Cập nhật thông tin thành công
- [ ] #4: Đổi password thành công
- [ ] #5: Postman GET /profile
- [ ] #6: Postman PUT /profile (cập nhật thông tin)
- [ ] #7: Postman PUT /profile (đổi password)
- [ ] #8: Postman Error - Sai password
- [ ] #9: Postman Error - No token

---

## 🎯 TÓM TẮT FLOW HOẠT ĐỘNG

### **View Mode** (Mặc định)
```
1. Component mount
2. Gọi GET /profile với token
3. Hiển thị thông tin user
4. User click "Chỉnh Sửa"
5. → Chuyển sang Edit Mode
```

### **Edit Mode**
```
1. Form hiển thị với dữ liệu hiện tại
2. User thay đổi thông tin
3. User click "Lưu"
4. Frontend validate
5. Gọi PUT /profile với data
6. Backend validate và update DB
7. Trả về data mới
8. Frontend cập nhật UI
9. → Chuyển về View Mode
10. Hiển thị thông báo success
```

### **Change Password Flow**
```
1. User nhập: Current + New + Confirm
2. Frontend validate:
   - Current không trống
   - New ≥ 6 ký tự
   - Confirm = New
3. Gửi lên backend
4. Backend verify current password
5. Hash new password
6. Update vào DB
7. Trả về success
```

---

## 🚀 GIT WORKFLOW

Sau khi hoàn thành test và có đủ screenshots:

```bash
# Kiểm tra status
git status

# Tạo branch mới
git checkout -b frontend-profile

# Add files
git add frontend/src/components/Profile.jsx
git add frontend/src/styles.css
git add screenshots/

# Commit
git commit -m "Sinh viên 2: Add Profile page - View and Update user info

- Tạo component Profile.jsx với View/Edit mode
- Hiển thị thông tin user: name, email, createdAt
- Form cập nhật thông tin cá nhân
- Chức năng đổi mật khẩu (optional)
- Validation đầy đủ cho tất cả fields
- Thông báo success/error
- CSS styling cho profile card và form
- Nút Cancel để hủy thay đổi"

# Push
git push -u origin frontend-profile
```

Sau đó tạo Pull Request trên GitHub!

---

## 💡 TIPS & BEST PRACTICES

### Security
1. ✅ **Luôn gửi token** trong header Authorization
2. ✅ **Không hiển thị password** trong response
3. ✅ **Reset password fields** sau khi cập nhật thành công
4. ✅ **Validate ở cả frontend và backend**

### UX/UI
1. ✅ **Toggle View/Edit mode** cho UX tốt hơn
2. ✅ **Disable buttons** khi đang loading
3. ✅ **Auto-clear errors** khi user nhập lại
4. ✅ **Hiển thị loading state**: "Đang lưu..."
5. ✅ **Thông báo rõ ràng** cho mọi hành động

### Code Quality
1. ✅ **Tách logic validation** ra functions riêng (nếu phức tạp)
2. ✅ **Handle errors** đầy đủ với try-catch
3. ✅ **Console.log** để debug khi cần
4. ✅ **Comments** giải thích logic phức tạp

---

## ❓ TROUBLESHOOTING

### **Lỗi: Không load được thông tin profile**
- Kiểm tra backend có chạy không (port 3000)
- Kiểm tra token có đúng không (localStorage)
- Mở Console xem error message
- Kiểm tra Network tab → xem response từ API

### **Lỗi: Cập nhật không thành công**
- Kiểm tra validation có pass không
- Xem error message từ backend
- Kiểm tra request body có đúng format không
- Verify token còn hiệu lực không

### **Lỗi: Đổi password không được**
- Kiểm tra current password có đúng không
- Verify new password ≥ 6 ký tự
- Confirm password phải khớp với new password

---

## ✨ KẾT LUẬN

Bạn đã hoàn thành xuất sắc **Sinh viên 2 - Hoạt động 2** với:

1. ✅ Trang Profile chuyên nghiệp với 2 modes
2. ✅ Cập nhật thông tin đầy đủ
3. ✅ Đổi mật khẩu an toàn
4. ✅ Validation và error handling tốt
5. ✅ UX/UI thân thiện

**Chúc bạn test thành công! 🎉**

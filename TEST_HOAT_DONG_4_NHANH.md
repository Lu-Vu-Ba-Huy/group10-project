# 🚀 TEST NHANH - FORGOT PASSWORD & AVATAR (HOẠT ĐỘNG 4)

## 📋 CHUẨN BỊ

1. **Backend**: Sinh viên 1 đã hoàn thành API
   - POST `/auth/forgot-password`
   - POST `/auth/reset-password`
   - PUT `/profile/avatar`

2. **Frontend**: Sinh viên 2 cần tạo
   - `ForgotPassword.jsx`
   - `ResetPassword.jsx`
   - `cloudinary.js`
   - Cập nhật `Profile.jsx`

---

## ⚡ TEST 5 PHÚT

### **BƯỚC 1: Test Forgot Password**

1. Vào: http://localhost:3001/login
2. Click **"Quên mật khẩu?"**
3. Nhập email: `test@test.com`
4. Click **"Gửi Token Reset"**

✅ **SCREENSHOT #1**: Form + thông báo token
✅ **SCREENSHOT #2**: Alert hiển thị token

---

### **BƯỚC 2: Test Reset Password**

1. Copy token từ bước 1
2. Vào: http://localhost:3001/reset-password
3. Nhập:
   - Token: `<paste token>`
   - Password mới: `newpass123`
   - Xác nhận: `newpass123`
4. Click **"Đổi Mật Khẩu"**

✅ **SCREENSHOT #3**: Success → redirect login
✅ **SCREENSHOT #4**: Login với password mới

---

### **BƯỚC 3: Test Upload Avatar**

1. Đăng nhập → Profile
2. Click **"📷 Đổi Avatar"**
3. Chọn ảnh (< 5MB)
4. Đợi upload

✅ **SCREENSHOT #5**: Loading state
✅ **SCREENSHOT #6**: Avatar hiển thị
✅ **SCREENSHOT #7**: Reload → vẫn còn

---

### **BƯỚC 4-5: Postman API**

#### **Test Forgot Password**
```
POST http://localhost:3000/auth/forgot-password
Body: { "email": "test@test.com" }
```
✅ **SCREENSHOT #8**: Response với resetToken

#### **Test Reset Password**
```
POST http://localhost:3000/auth/reset-password
Body: { 
  "token": "<token>",
  "newPassword": "123456"
}
```
✅ **SCREENSHOT #9**: Success message

#### **Test Upload Avatar**
```
PUT http://localhost:3000/profile/avatar
Headers: Authorization: Bearer <token>
Body: { "avatar": "https://..." }
```
✅ **SCREENSHOT #10**: Avatar URL updated

---

## 🎯 CHECKLIST

- [ ] Form Forgot Password hoạt động
- [ ] Nhận được token
- [ ] Form Reset Password hoạt động
- [ ] Đổi password thành công
- [ ] Upload avatar lên Cloudinary
- [ ] Avatar hiển thị trong Profile
- [ ] Avatar persistent sau reload
- [ ] Postman test 3 APIs
- [ ] 10 screenshots đầy đủ

---

## 🔑 CLOUDINARY SETUP NHANH

1. Đăng ký: https://cloudinary.com
2. Lấy **Cloud Name** từ Dashboard
3. Tạo **Upload Preset** (unsigned)
4. Update `cloudinary.js`:
```js
const CLOUDINARY_CLOUD_NAME = 'your_name';
const CLOUDINARY_UPLOAD_PRESET = 'your_preset';
```

---

## ⚠️ TROUBLESHOOTING

### **Lỗi: Token không hợp lệ**
→ Token chỉ dùng 1 lần, yêu cầu token mới

### **Lỗi: Upload failed**
→ Kiểm tra Cloudinary config, network

### **Lỗi: Avatar không hiển thị**
→ Check URL, CORS, backend có lưu không

---

**Done! 🎉**

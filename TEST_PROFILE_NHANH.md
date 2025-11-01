# 🚀 TEST NHANH - PROFILE PAGE (HOẠT ĐỘNG 2)

## ✅ ĐÃ CHUẨN BỊ SẴN

- ✅ Backend: `http://localhost:3000`
- ✅ Frontend: `http://localhost:3001`
- ✅ Component `Profile.jsx` đã hoàn chỉnh
- ✅ API `/profile` (GET, PUT) hoạt động

---

## 📋 TEST NHANH - 5 PHÚT

### **BƯỚC 1: Đăng nhập**

1. Vào: http://localhost:3001/login
2. Đăng nhập:
   ```
   Email: test@test.com
   Password: 123456
   ```
   (hoặc tài khoản bạn đã tạo)

---

### **BƯỚC 2: Vào trang Profile**

1. Click **"👤 Profile"** trên Navbar
2. Hoặc: http://localhost:3001/profile

**✅ CHỤP SCREENSHOT #1: View Mode**
- Hiển thị: Họ tên, Email, Ngày tạo
- Nút "✏️ Chỉnh Sửa Thông Tin"

---

### **BƯỚC 3: Chỉnh sửa thông tin**

1. Click **"✏️ Chỉnh Sửa Thông Tin"**

**✅ CHỤP SCREENSHOT #2: Edit Mode**
- Form với: Tên, Email
- Section đổi password
- Nút: Lưu, Hủy

2. Sửa tên: "My Name Updated"
3. Click **"💾 Lưu Thay Đổi"**

**✅ CHỤP SCREENSHOT #3: Success**
- Thông báo xanh: "✅ Cập nhật thông tin thành công!"
- Tên đã thay đổi

---

### **BƯỚC 4: Đổi mật khẩu**

1. Click **"✏️ Chỉnh Sửa"** lại
2. Nhập:
   ```
   Mật khẩu hiện tại: 123456
   Mật khẩu mới: newpass123
   Xác nhận: newpass123
   ```
3. Click **"💾 Lưu"**

**✅ CHỤP SCREENSHOT #4: Password Changed**
- Thông báo thành công
- Đăng xuất và login lại với password mới

---

## 📸 POSTMAN - 5 SCREENSHOTS

### **Test 1: GET /profile**
**✅ SCREENSHOT #5**
```
Method: GET
URL: http://localhost:3000/profile
Headers:
  Authorization: Bearer <token>
```
Response: 200 OK với user info

---

### **Test 2: PUT /profile - Update Name**
**✅ SCREENSHOT #6**
```
Method: PUT
URL: http://localhost:3000/profile
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "name": "New Name",
  "email": "test@test.com"
}
```
Response: 200 OK

---

### **Test 3: PUT /profile - Change Password**
**✅ SCREENSHOT #7**
```
Body:
{
  "name": "New Name",
  "email": "test@test.com",
  "currentPassword": "newpass123",
  "newPassword": "123456"
}
```
Response: 200 OK

---

### **Test 4: Error - Wrong Password**
**✅ SCREENSHOT #8**
```
Body:
{
  "currentPassword": "wrongpass",
  "newPassword": "newpass"
}
```
Response: 401 - "Mật khẩu hiện tại không đúng"

---

### **Test 5: Error - No Token**
**✅ SCREENSHOT #9**
```
Method: PUT
URL: http://localhost:3000/profile
Headers: (KHÔNG gửi Authorization)
Body:
{
  "name": "Test"
}
```
Response: 401 - "Không có token xác thực!"

---

## 🎯 CHECKLIST

- [ ] Screenshot #1: Profile View mode
- [ ] Screenshot #2: Profile Edit mode (form)
- [ ] Screenshot #3: Update success
- [ ] Screenshot #4: Change password success
- [ ] Screenshot #5: Postman GET /profile
- [ ] Screenshot #6: Postman PUT update info
- [ ] Screenshot #7: Postman PUT change password
- [ ] Screenshot #8: Postman error wrong password
- [ ] Screenshot #9: Postman error no token

---

## 🔑 LẤY TOKEN CHO POSTMAN

### Cách 1: Browser DevTools
1. F12 → Application tab
2. Local Storage → http://localhost:3001
3. Key: `token` → Copy value

### Cách 2: Postman Login
```
POST http://localhost:3000/auth/login
Body:
{
  "email": "test@test.com",
  "password": "123456"
}
```
→ Copy `token` từ response

---

## 🚀 HOÀN THÀNH

Sau khi có đủ 9 screenshots:

```bash
# Tạo branch
git checkout -b frontend-profile

# Add files
git add frontend/ screenshots/

# Commit
git commit -m "Sinh viên 2: Complete Profile page with view/edit modes"

# Push
git push -u origin frontend-profile
```

**Done! 🎉**

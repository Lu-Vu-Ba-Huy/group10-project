# 🚀 HƯỚNG DẪN TEST NHANH - ADMIN PANEL

## ✅ ĐÃ CHUẨN BỊ SẴN

- ✅ Backend đang chạy trên `http://localhost:3000`
- ✅ Frontend đang chạy trên `http://localhost:3001`
- ✅ Tài khoản Admin đã được tạo:
  - **Email**: `admin@admin.com`
  - **Password**: `admin123`
- ✅ Có 4 user thường để test

---

## 📋 BƯỚC 1: ĐĂNG NHẬP ADMIN

1. Mở trình duyệt: http://localhost:3001/login

2. Nhập thông tin:
   ```
   Email: admin@admin.com
   Password: admin123
   ```

3. Click **"Đăng Nhập"**

4. **CHỤP SCREENSHOT #1**: Navbar sau khi đăng nhập
   - ✅ Phải thấy link **"👑 Admin Panel"**
   - ✅ Hiện "Xin chào, Admin"

---

## 📋 BƯỚC 2: VÀO TRANG ADMIN

1. Click vào **"👑 Admin Panel"** trên Navbar

2. Trang sẽ chuyển đến: `http://localhost:3001/admin/users`

3. **CHỤP SCREENSHOT #2**: Trang Admin - Danh sách User
   - ✅ Tiêu đề "👑 Quản Lý User (Admin)"
   - ✅ Hiện "Tổng số user: 5"
   - ✅ Bảng danh sách với 5 users
   - ✅ Có badge role: 👑 Admin (cam) và 👤 User (xanh)
   - ✅ Row của Admin highlight màu vàng nhạt
   - ✅ Nút "🔄 Role" và "🗑️ Xóa"

---

## 📋 BƯỚC 3: TEST XÓA USER

1. Chọn một user KHÔNG phải admin (ví dụ: "Test8")

2. Click nút **"🗑️ Xóa"**

3. Popup xác nhận xuất hiện: "Bạn có chắc muốn xóa user..."

4. Click **"OK"**

5. **CHỤP SCREENSHOT #3**: Sau khi xóa
   - ✅ Thông báo màu xanh "✅ Đã xóa user..."
   - ✅ User đã biến mất khỏi danh sách
   - ✅ Tổng số user: 4 (giảm 1)

---

## 📋 BƯỚC 4: TEST THAY ĐỔI ROLE

1. Chọn một user thường (ví dụ: "Test")

2. Click nút **"🔄 Role"**

3. Popup xác nhận: "Thay đổi role của "Test" thành ADMIN?"

4. Click **"OK"**

5. **CHỤP SCREENSHOT #4**: Sau khi thay đổi role
   - ✅ Badge đổi từ "👤 User" (xanh) → "👑 Admin" (cam)
   - ✅ Thông báo "✅ Đã cập nhật role thành admin!"

---

## 📋 BƯỚC 5: TEST VỚI USER THƯỜNG

1. Click **"🚪 Đăng Xuất"**

2. Đăng nhập lại bằng user thường:
   ```
   Email: don@gmail.com
   Password: (mật khẩu bạn đã tạo)
   ```

3. **CHỤP SCREENSHOT #5**: Navbar của user thường
   - ✅ KHÔNG có link "👑 Admin Panel"
   - ✅ Chỉ có: Trang Chủ, Profile, Quản Lý User, Thêm User

4. Thử truy cập trực tiếp: `http://localhost:3001/admin/users`
   - ✅ Bị chặn, hiện alert "Bạn không có quyền..."
   - ✅ Tự động redirect về trang chủ

---

## 📋 BƯỚC 6: TEST POSTMAN

### 6.1. Lấy Token Admin

**Request đăng nhập Admin**:
```
Method: POST
URL: http://localhost:3000/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Response**: Copy giá trị `token` để dùng sau

---

### 6.2. GET /admin/users (Admin - Success)

**CHỤP SCREENSHOT #6**:
```
Method: GET
URL: http://localhost:3000/admin/users
Headers:
  Authorization: Bearer <admin_token>
```

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ Body:
```json
{
  "users": [
    {
      "_id": "...",
      "name": "Test",
      "email": "test@gmail.com",
      "role": "user",
      "createdAt": "..."
    },
    ...
  ],
  "total": 4
}
```

---

### 6.3. GET /admin/users (User - Forbidden)

**Lấy token user trước**:
```
Method: POST
URL: http://localhost:3000/auth/login
Body:
{
  "email": "don@gmail.com",
  "password": "(mật khẩu)"
}
```

**CHỤP SCREENSHOT #7**:
```
Method: GET
URL: http://localhost:3000/admin/users
Headers:
  Authorization: Bearer <user_token>
```

**Kết quả mong đợi**:
- ✅ Status: 403 Forbidden
- ✅ Body:
```json
{
  "message": "Chỉ Admin mới có quyền truy cập!"
}
```

---

### 6.4. DELETE /admin/users/:id

**Lấy ID của một user** (từ GET /admin/users ở bước 6.2)

**CHỤP SCREENSHOT #8**:
```
Method: DELETE
URL: http://localhost:3000/admin/users/<user_id>
Headers:
  Authorization: Bearer <admin_token>
```

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ Body:
```json
{
  "message": "Đã xóa user thành công",
  "deletedUser": {
    "id": "...",
    "name": "Test",
    "email": "test@gmail.com"
  }
}
```

---

### 6.5. PUT /admin/users/:id/role

**Lấy ID của một user khác**

**CHỤP SCREENSHOT #9**:
```
Method: PUT
URL: http://localhost:3000/admin/users/<user_id>/role
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body (raw JSON):
{
  "role": "admin"
}
```

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ Body:
```json
{
  "message": "Đã cập nhật role thành admin",
  "user": {
    "id": "...",
    "name": "Ngvan1",
    "email": "ngv1@gmail.com",
    "role": "admin"
  }
}
```

---

## ✅ CHECKLIST 9 SCREENSHOTS

- [ ] Screenshot #1: Navbar với Admin Panel (admin login)
- [ ] Screenshot #2: Trang Admin - danh sách user đầy đủ
- [ ] Screenshot #3: Xóa user thành công
- [ ] Screenshot #4: Thay đổi role thành công
- [ ] Screenshot #5: Navbar user thường (KHÔNG có Admin Panel)
- [ ] Screenshot #6: Postman GET /admin/users (admin token - 200 OK)
- [ ] Screenshot #7: Postman GET /admin/users (user token - 403 Forbidden)
- [ ] Screenshot #8: Postman DELETE /admin/users/:id (200 OK)
- [ ] Screenshot #9: Postman PUT /admin/users/:id/role (200 OK)

---

## 🎯 HOÀN THÀNH

Sau khi có đủ 9 screenshots:

1. ✅ Tạo thư mục `screenshots/` trong project
2. ✅ Đặt tên file rõ ràng:
   - `01-navbar-admin.png`
   - `02-admin-page-list.png`
   - `03-delete-user-success.png`
   - `04-change-role-success.png`
   - `05-navbar-user.png`
   - `06-postman-get-admin-success.png`
   - `07-postman-get-user-forbidden.png`
   - `08-postman-delete-user.png`
   - `09-postman-put-change-role.png`

3. ✅ Tạo branch và push:
```bash
git checkout -b backend-admin
git add .
git commit -m "Sinh viên 2: Complete Admin panel with screenshots"
git push -u origin backend-admin
```

4. ✅ Tạo Pull Request trên GitHub

**Chúc bạn thành công! 🎉**

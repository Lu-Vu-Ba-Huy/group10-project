# 📚 HƯỚNG DẪN CHI TIẾT - SINH VIÊN 2
## Hoạt động 3: Giao diện Admin - Quản lý User

---

## 📋 MỤC TIÊU
Xây dựng giao diện Admin Panel để:
1. Hiển thị danh sách tất cả user
2. Xóa user (với xác nhận)
3. Thay đổi role User ↔️ Admin
4. Chỉ Admin mới truy cập được

---

## 🗂️ CẤU TRÚC FILE ĐÃ TẠO

### 1. Component Chính: `AdminUserList.jsx`
**Đường dẫn**: `frontend/src/components/AdminUserList.jsx`

**Chức năng chính**:
```javascript
✅ Kiểm tra quyền Admin (tự động redirect nếu không phải admin)
✅ Lấy danh sách users từ API GET /admin/users
✅ Hiển thị bảng danh sách với đầy đủ thông tin
✅ Nút Xóa user với xác nhận
✅ Nút Thay đổi Role với xác nhận
✅ Không cho phép thao tác với chính mình
✅ Hiển thị thông báo success/error
```

**Cấu trúc Code**:
```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserList() {
  // 1. State management
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 2. Kiểm tra quyền Admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Bạn không có quyền truy cập!');
      navigate('/');
    }
  }, [user]);

  // 3. Lấy danh sách users
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setUsers(response.data.users);
  };

  // 4. Xóa user
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Xóa user "${userName}"?`)) return;
    
    await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    setSuccess('Đã xóa thành công!');
    fetchUsers(); // Reload danh sách
  };

  // 5. Thay đổi role
  const handleChangeRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Thay đổi role thành ${newRole}?`)) return;
    
    await axios.put(
      `http://localhost:3000/admin/users/${userId}/role`,
      { role: newRole },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    setSuccess('Đã cập nhật role!');
    fetchUsers();
  };

  // 6. Render UI
  return (
    <div className="container">
      <h2>👑 Quản Lý User (Admin)</h2>
      
      {/* Bảng danh sách */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u._id}>
              <td>{index + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </td>
              <td>
                {u._id !== user?.id && (
                  <>
                    <button onClick={() => handleChangeRole(u._id, u.role, u.name)}>
                      🔄 Role
                    </button>
                    <button onClick={() => handleDelete(u._id, u.name)}>
                      🗑️ Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 2. Cập nhật Navbar: `Navbar.jsx`
**Thêm link Admin Panel chỉ hiện với Admin**:

```jsx
{user?.role === 'admin' && (
  <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>
    👑 Admin Panel
  </Link>
)}
```

**Giải thích**:
- `user?.role === 'admin'`: Kiểm tra role của user hiện tại
- Chỉ hiển thị link khi user là admin
- Link dẫn đến `/admin/users`

---

### 3. Cập nhật Routing: `App.js`
**Thêm route Admin Panel**:

```jsx
import AdminUserList from './components/AdminUserList';

<Route path="/admin/users" element={
  <ProtectedRoute>
    <AdminUserList />
  </ProtectedRoute>
} />
```

**Giải thích**:
- Wrap trong `<ProtectedRoute>` để yêu cầu đăng nhập
- Component `AdminUserList` sẽ kiểm tra role admin bên trong

---

### 4. Styling: `styles.css`
**Các class CSS đã thêm**:

```css
/* Admin Header - Gradient đẹp */
.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Bảng Admin */
.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: #f8f9fa;
  padding: 15px;
  font-weight: 600;
}

.admin-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

/* Hover effect */
.admin-table tbody tr:hover {
  background-color: #f5f7fa;
}

/* Highlight current user */
.current-user-row {
  background-color: #fff3e0 !important;
}

/* Badge cho Role */
.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.badge-admin {
  background: #ff9800;
  color: white;
}

.badge-user {
  background: #4caf50;
  color: white;
}

/* Buttons */
.btn-small {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-danger {
  background: #f44336;
  color: white;
}
```

---

## 🔐 TẠO TÀI KHOẢN ADMIN ĐỂ TEST

### Cách 1: Sử dụng MongoDB Compass

1. **Mở MongoDB Compass**
2. **Kết nối với connection string**:
   ```
   mongodb+srv://user123:user123@cluster10.dmgdn1x.mongodb.net/group10-project
   ```

3. **Vào database `group10-project`** → collection `users`

4. **Tìm user cần cấp quyền Admin**:
   - Click vào user
   - Tìm field `role`
   - Sửa từ `"user"` thành `"admin"`
   - Click **Update**

5. **Đăng xuất và đăng nhập lại** trên web

### Cách 2: Sử dụng MongoDB Atlas

1. **Truy cập**: https://cloud.mongodb.com
2. **Đăng nhập** tài khoản MongoDB Atlas
3. **Vào Clusters** → **Browse Collections**
4. **Chọn database** `group10-project` → collection `users`
5. **Click vào user** → **Edit Document**
6. **Sửa field `role`** từ `"user"` thành `"admin"`
7. **Save**

### Cách 3: Tạo Admin trực tiếp bằng code (Nhanh nhất)

Thêm đoạn code này vào `backend/server.js` (sau khi kết nối MongoDB):

```javascript
// Tạo admin mặc định (chỉ dùng 1 lần)
const User = require('./models/User');

mongoose.connection.once('open', async () => {
  console.log('✅ Đã kết nối với MongoDB');
  
  // Tạo admin nếu chưa có
  const adminEmail = 'admin@admin.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  
  if (!existingAdmin) {
    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123', // Sẽ được hash tự động
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Đã tạo tài khoản Admin mặc định');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin123');
  }
});
```

**Sau đó**:
1. Restart backend: `Ctrl+C` → `npm start`
2. Kiểm tra console, sẽ thấy thông báo tạo admin
3. Đăng nhập với:
   - Email: `admin@admin.com`
   - Password: `admin123`

---

## 🧪 HƯỚNG DẪN KIỂM THỬ

### Bước 1: Khởi động Server

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```
✅ Backend chạy trên `http://localhost:3000`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```
✅ Frontend chạy trên `http://localhost:3001`

---

### Bước 2: Tạo Tài Khoản Test

1. **Đăng ký 3-4 user thường**:
   - Vào `http://localhost:3001/register`
   - Tạo user: `user1@test.com`, `user2@test.com`, v.v.

2. **Tạo 1 admin** (theo hướng dẫn trên)

---

### Bước 3: Test với Tài Khoản Admin

1. **Đăng nhập bằng admin**
   - Email: `admin@admin.com`
   - Password: `admin123`

2. **Kiểm tra Navbar**:
   ✅ Phải thấy link **"👑 Admin Panel"**

3. **Click vào Admin Panel**:
   ✅ Chuyển đến trang `/admin/users`

4. **Kiểm tra danh sách**:
   ✅ Hiển thị tất cả users
   ✅ Có cột: #, Họ tên, Email, Role, Thao tác
   ✅ Row của admin hiện tại được highlight (màu vàng)
   ✅ Text "(Bạn)" xuất hiện bên cạnh tên admin

5. **Test Xóa User**:
   - Click nút **"🗑️ Xóa"** của một user
   - ✅ Hiện popup xác nhận
   - ✅ Sau khi xác nhận, user bị xóa khỏi danh sách
   - ✅ Hiện thông báo success màu xanh

6. **Test Thay Đổi Role**:
   - Click nút **"🔄 Role"** của một user
   - ✅ Hiện popup xác nhận
   - ✅ Badge đổi từ "👤 User" → "👑 Admin" (hoặc ngược lại)
   - ✅ Hiện thông báo success

7. **Test Bảo vệ chính mình**:
   ✅ Không có nút Xóa/Role ở row của chính mình
   ✅ Hiện text "Không thể thao tác với chính mình"

---

### Bước 4: Test với Tài Khoản User Thường

1. **Đăng xuất admin**

2. **Đăng nhập bằng user thường**:
   - Email: `user1@test.com`

3. **Kiểm tra Navbar**:
   ✅ KHÔNG thấy link "Admin Panel"

4. **Thử truy cập trực tiếp** `http://localhost:3001/admin/users`:
   ✅ Bị chặn và redirect về trang chủ
   ✅ Hiện alert "Bạn không có quyền truy cập trang này!"

---

## 📸 CHỤP SCREENSHOTS YÊU CẦU

### Screenshot 1: Navbar với Admin Panel (Admin)
**Mô tả**: Navbar khi đăng nhập bằng admin  
**Nội dung**:
- ✅ Có link "👑 Admin Panel"
- ✅ Hiện "Xin chào, Admin"

### Screenshot 2: Trang Admin - Danh sách User
**Mô tả**: Trang `/admin/users` với danh sách đầy đủ  
**Nội dung**:
- ✅ Tiêu đề "👑 Quản Lý User (Admin)"
- ✅ Tổng số user
- ✅ Bảng với cột: #, Họ tên, Email, Role, Ngày tạo, Thao tác
- ✅ Badge role khác màu (Admin - cam, User - xanh)
- ✅ Nút 🔄 Role và 🗑️ Xóa

### Screenshot 3: Xóa User Thành Công
**Mô tả**: Sau khi xóa user  
**Nội dung**:
- ✅ Thông báo success màu xanh "✅ Đã xóa user..."
- ✅ User đã biến mất khỏi danh sách
- ✅ Tổng số user giảm đi 1

### Screenshot 4: Thay Đổi Role Thành Công
**Mô tả**: Sau khi thay đổi role user → admin  
**Nội dung**:
- ✅ Badge đổi từ "👤 User" (xanh) → "👑 Admin" (cam)
- ✅ Thông báo success "✅ Đã cập nhật role thành admin!"

### Screenshot 5: Navbar User Thường (KHÔNG có Admin Panel)
**Mô tả**: Navbar khi đăng nhập bằng user thường  
**Nội dung**:
- ✅ KHÔNG có link "Admin Panel"
- ✅ Chỉ có: Trang Chủ, Profile, Quản Lý User, Thêm User

### Screenshot 6: Postman - GET /admin/users (Admin token - Success)
**Mô tả**: Test API với admin token  
**Thiết lập**:
```
Method: GET
URL: http://localhost:3000/admin/users
Headers:
  Authorization: Bearer <admin_token>
```
**Kết quả**:
- ✅ Status: 200 OK
- ✅ Body: { users: [...], total: X }

### Screenshot 7: Postman - GET /admin/users (User token - Forbidden)
**Mô tả**: Test API với user token  
**Thiết lập**:
```
Method: GET
URL: http://localhost:3000/admin/users
Headers:
  Authorization: Bearer <user_token>
```
**Kết quả**:
- ✅ Status: 403 Forbidden
- ✅ Body: { message: "Chỉ Admin mới có quyền truy cập!" }

### Screenshot 8: Postman - DELETE /admin/users/:id
**Mô tả**: Xóa user qua API  
**Thiết lập**:
```
Method: DELETE
URL: http://localhost:3000/admin/users/<user_id>
Headers:
  Authorization: Bearer <admin_token>
```
**Kết quả**:
- ✅ Status: 200 OK
- ✅ Body: { message: "Đã xóa user thành công", deletedUser: {...} }

### Screenshot 9: Postman - PUT /admin/users/:id/role
**Mô tả**: Thay đổi role qua API  
**Thiết lập**:
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
**Kết quả**:
- ✅ Status: 200 OK
- ✅ Body: { message: "Đã cập nhật role thành admin", user: {...} }

---

## 🔑 LẤY TOKEN ĐỂ TEST POSTMAN

### Cách 1: Từ Browser Developer Tools
1. Đăng nhập trên web
2. Mở **DevTools** (F12)
3. Vào tab **Application** → **Local Storage** → `http://localhost:3001`
4. Tìm key `token`, copy giá trị

### Cách 2: Từ Postman Login
**Request đăng nhập**:
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

**Response**:
```json
{
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```
Copy giá trị `token` để dùng cho các request khác.

---

## 🎯 CHECKLIST HOÀN THÀNH

### Backend API (Sinh viên 1 làm)
- [x] GET `/admin/users` - Lấy danh sách user
- [x] DELETE `/admin/users/:id` - Xóa user
- [x] PUT `/admin/users/:id/role` - Thay đổi role
- [x] Middleware `authMiddleware` - Xác thực JWT
- [x] Middleware `adminMiddleware` - Kiểm tra role admin

### Frontend (Sinh viên 2 - BẠN)
- [x] Component `AdminUserList.jsx` - Trang quản lý user
- [x] Hiển thị danh sách user trong table
- [x] Nút Xóa user với confirm
- [x] Nút Thay đổi role với confirm
- [x] Kiểm tra quyền admin trước khi vào trang
- [x] Không cho phép thao tác với chính mình
- [x] Hiển thị thông báo success/error
- [x] Cập nhật Navbar thêm link Admin Panel
- [x] Cập nhật App.js thêm route `/admin/users`
- [x] CSS đẹp cho trang Admin

### Testing & Screenshots (Sinh viên 3)
- [ ] Test với tài khoản Admin
- [ ] Test với tài khoản User
- [ ] Test API với Postman
- [ ] Chụp 9 screenshots yêu cầu
- [ ] Tạo branch `backend-admin`
- [ ] Push code và tạo Pull Request

---

## 🚀 GIT WORKFLOW (Sau khi hoàn thành)

```bash
# Kiểm tra trạng thái
git status

# Tạo branch mới
git checkout -b backend-admin

# Add tất cả file đã thay đổi
git add backend/ frontend/

# Commit với message rõ ràng
git commit -m "Sinh viên 2: Add Admin panel - User management UI

- Tạo component AdminUserList.jsx với đầy đủ chức năng
- Thêm chức năng xóa user với confirm
- Thêm chức năng thay đổi role User/Admin
- Cập nhật Navbar hiển thị Admin Panel link (chỉ admin)
- Thêm route /admin/users trong App.js
- Thêm CSS styling cho trang Admin
- Kiểm tra quyền admin trước khi truy cập
- Không cho phép thao tác với chính mình"

# Push lên remote
git push -u origin backend-admin
```

**Sau đó**:
1. Vào GitHub repository
2. Tạo Pull Request từ `backend-admin` → `backend`
3. Thêm mô tả và screenshots
4. Assign reviewer (Sinh viên 3)

---

## 📝 GHI CHÚ QUAN TRỌNG

### ⚠️ Lưu Ý Security
1. **Kiểm tra role 2 lần**:
   - Frontend: Ẩn link + redirect nếu không phải admin
   - Backend: Middleware `adminMiddleware` kiểm tra role từ token

2. **Không cho phép tự xóa/thay đổi role của chính mình**:
   - Tránh tình huống admin tự xóa mình → không còn admin nào

3. **Xác nhận trước khi xóa**:
   - Dùng `window.confirm()` để tránh xóa nhầm

### 💡 Tips Debug
- **Lỗi 403 Forbidden**: Kiểm tra token có đúng admin không
- **Không thấy Admin Panel link**: Kiểm tra `user.role` trong console
- **API không hoạt động**: Kiểm tra backend có chạy không (port 3000)
- **Frontend không load**: Kiểm tra console browser có lỗi không

### 🎨 Tùy Chỉnh Thêm (Optional)
- Thêm pagination nếu danh sách user nhiều
- Thêm search/filter theo tên, email
- Thêm sort theo ngày tạo, role
- Thêm modal edit user info (không chỉ role)

---

## ✅ KẾT LUẬN

Bạn đã hoàn thành xuất sắc phần **Sinh viên 2** với:

1. ✅ Giao diện Admin Panel đẹp và chuyên nghiệp
2. ✅ Đầy đủ chức năng: Danh sách, Xóa, Thay đổi Role
3. ✅ Bảo mật tốt: Kiểm tra quyền, không tự xóa mình
4. ✅ UX tốt: Confirm trước khi action, thông báo rõ ràng
5. ✅ Code sạch, dễ đọc, có comment

**Chúc bạn demo thành công! 🎉**

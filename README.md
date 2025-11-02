# 🎓 Group 10 - User Management System

Hệ thống quản lý người dùng với tính năng authentication, authorization, và quản lý profile. Xây dựng với MERN Stack.

## 👥 Thành Viên Nhóm

| MSSV   | Họ và Tên               | Vai Trò      |
|--------|-------------------------|--------------|
| 221330 | Thạch Văn Bảo           | Backend      |
| 223319 | Nguyễn Thị Ngọc Diễm    | Frontend     |
| 221192 | Lư Vu Bá Huy            | Database     |

## 🛠️ Công Nghệ

**Backend:** Node.js, Express.js, MongoDB, JWT, Bcrypt, Cloudinary, Multer

**Frontend:** React.js, React Router, Axios, Context API

## ✨ Tính Năng

- Đăng ký/Đăng nhập (có phân quyền User/Admin)
- Quên mật khẩu & Reset password
- Quản lý profile (xem, sửa, đổi mật khẩu, upload avatar)
- Admin Panel (quản lý users, xóa user, đổi role)

## 📦 Cài Đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd group10-project
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
JWT_SECRET=your-secret-key
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Chạy backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

## 🚀 Sử Dụng

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

**Đăng ký tài khoản → Đăng nhập → Sử dụng các tính năng**

## 📡 API Endpoints

| Method | Endpoint                        | Mô tả                  |
|--------|---------------------------------|------------------------|
| POST   | `/api/auth/signup`              | Đăng ký                |
| POST   | `/api/auth/login`               | Đăng nhập              |
| POST   | `/api/auth/forgot-password`     | Quên mật khẩu          |
| POST   | `/api/auth/reset-password`      | Reset mật khẩu         |
| GET    | `/api/profile`                  | Xem profile            |
| PUT    | `/api/profile`                  | Cập nhật profile       |
| POST   | `/api/profile/upload-avatar`    | Upload avatar          |
| GET    | `/api/admin/users`              | Quản lý users (Admin)  |

---

**© 2025 Group 10 - User Management System**

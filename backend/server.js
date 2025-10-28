// ==========================
// 1️⃣ Import các thư viện cần thiết
// ==========================
const express = require("express");
const cors = require("cors"); // cho phép frontend (port khác) gọi API
const app = express();
require('dotenv').config(); // nạp biến môi trường từ file .env
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Đã kết nối với MongoDB'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ==========================
// 2️⃣ Cấu hình middleware
// ==========================
// Cấu hình CORS với các options cụ thể
app.use(cors({
  origin: 'http://localhost:3001', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow cookies and credentials
}));

// Cấu hình limits cho express
app.use(express.json({ limit: '10mb' })); // Tăng giới hạn body size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Tăng giới hạn URL-encoded data

// Serve static files (avatars)
app.use('/uploads', express.static('uploads'));

// ==========================
// 3️⃣ Routes
// ==========================
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

// ==========================
// 3️⃣ Dữ liệu mẫu (tạm thời lưu trong RAM)
// ==========================
let users = [];
let nextId = 1;

// ==========================
// 4️⃣ Các route API
// ==========================

// Kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// 📍 GET /users – Lấy danh sách user
app.get("/users", (req, res) => {
  res.json(users);
});

// 📍 POST /users – Thêm user mới
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Kiểm tra dữ liệu hợp lệ
  if (!name || !email) {
    return res.status(400).json({ message: "Name và email là bắt buộc!" });
  }

  // Tạo user mới
  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  // Trả về user vừa tạo
  res.status(201).json(newUser);
});

// 📍 PUT /users/:id – Cập nhật thông tin user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy user!" });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
});

// 📍 DELETE /users/:id – Xóa user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const exists = users.some((u) => u.id === parseInt(id));

  if (!exists) {
    return res.status(404).json({ message: "User không tồn tại!" });
  }

  users = users.filter((u) => u.id !== parseInt(id));
  res.json({ message: "Đã xóa user thành công!" });
});

// ==========================
// 5️⃣ Chạy server
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});

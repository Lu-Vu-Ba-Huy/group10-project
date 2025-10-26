const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// --- 1. Load Environment Variables ---
// Đọc file .env và tải biến vào process.env
dotenv.config();

const app = express();

// --- 2. Hằng số và Cấu hình ---
// Lấy PORT từ biến môi trường, mặc định là 3000
const PORT = process.env.PORT || 3000;
// Lấy URI kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// --- 3. Kết nối Database ---
const connectDB = async () => {
    try {
   
        if (!MONGODB_URI) {
            // Kiểm tra nếu biến MONGODB_URI không được định nghĩa
            throw new Error("MONGODB_URI is not defined in .env file.");
        }
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');
    } catch (error) {
        // Ghi log lỗi chi tiết nếu kết nối thất bại
        console.error('❌ MongoDB connection error:', error.message);
        // Thoát ứng dụng nếu không thể kết nối DB
        process.exit(1); 
    }
};
// --- 7. Khởi động Server ---

connectDB();

// --- 4. Middleware ---
// Middleware: Ghi log đơn giản cho mỗi request
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

app.use(logger);

// Middleware: Phân tích JSON body của request (cho POST, PUT)
app.use(express.json());

// --- 5. Routes ---
// Ví dụ: Import và sử dụng routes cho User
// **LƯU Ý:** Bạn phải tạo thư mục './routes' và file 'user.js'
const userRoutes = require('./routes/user'); 
app.use('/api/users', userRoutes);

// Default/Home Route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Backend API!',
        status: 'Server is running' 
    });
});

// --- 6. Xử lý lỗi (Error Handler Middleware) ---
// Middleware này bắt các lỗi xảy ra trong các route (phải đặt cuối cùng)
app.use((err, req, res, next) => {
    console.error(err.stack); // Ghi stack trace của lỗi vào console
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message
    });
});
   mongoose.connect(process.env.MONGODB_URI)
connectDB();

// Gọi hàm kết nối DB, sau đó khởi động Express server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`   Local URL: http://localhost:${PORT}`);
    });
});

// Export app (hữu ích cho việc testing)
module.exports = app;
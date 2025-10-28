// Script tạo tài khoản Admin tự động
// Chạy file này 1 lần để tạo admin mặc định

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function createAdmin() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Thông tin admin
    const adminData = {
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin'
    };

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Admin đã tồn tại:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\n💡 Bạn có thể đăng nhập với:');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
    } else {
      // Tạo admin mới
      const admin = new User(adminData);
      await admin.save();

      console.log('\n✅ Đã tạo tài khoản Admin thành công!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    ', adminData.email);
      console.log('🔑 Password: ', adminData.password);
      console.log('👑 Role:     ', adminData.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 Hướng dẫn đăng nhập:');
      console.log('1. Mở trình duyệt: http://localhost:3001/login');
      console.log('2. Nhập Email: admin@admin.com');
      console.log('3. Nhập Password: admin123');
      console.log('4. Sau khi đăng nhập, bạn sẽ thấy link "👑 Admin Panel"');
    }

    // Hiển thị danh sách tất cả users
    const allUsers = await User.find().select('-password');
    console.log(`\n📊 Tổng số users hiện tại: ${allUsers.length}`);
    console.log('\n📋 Danh sách users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('👋 Đã đóng kết nối MongoDB');
    process.exit(0);
  }
}

// Chạy script
createAdmin();

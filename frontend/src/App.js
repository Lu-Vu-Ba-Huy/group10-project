// File: frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import các component UserList và AddUser của bạn
// ...

const API_URL = "http://localhost:3000/users"; // URL API của backend

function App() {
  const [users, setUsers] = useState([]);
  // ... các state khác (loading, error)

  // Hàm GET: Lấy danh sách user từ backend (đã kết nối MongoDB)
  const fetchUsers = async () => {
    try {
      // Đảm bảo backend đang chạy và đã kết nối thành công tới MongoDB
      const response = await axios.get(API_URL);
      
      // Response.data lúc này phải chứa dữ liệu được đọc từ MongoDB
      setUsers(response.data); 
      // ... xử lý loading, error
    } catch (err) {
      console.error("Lỗi khi fetch users từ MongoDB:", err);
      // ... xử lý lỗi
    }
  };
// ... (Tiếp tục từ dòng 28 của ảnh bạn cung cấp)

}; // Kết thúc hàm fetchUsers

// 1. GỌI GET KHI COMPONENT ĐƯỢC LOAD
useEffect(() => {
    fetchUsers();
}, []); // Mảng rỗng đảm bảo chỉ chạy một lần sau lần render đầu tiên

// 2. HÀM POST: Xử lý thêm user mới (Cần thiết cho Hoạt động 4 & 6)
const handleAddUser = async (newUser) => {
    try {
        // Giả sử API backend chấp nhận POST tại cùng URL
        const response = await axios.post(API_URL, newUser);
        
        // Cập nhật state users với user mới (giả sử API trả về user có ID)
        setUsers([...users, response.data]); 
        
    } catch (err) {
        console.error("Lỗi khi thêm user:", err);
        setError("Không thể thêm người dùng.");
    }
};


// 3. RENDER GIAO DIỆN
if (loading) return <div>Đang tải danh sách người dùng...</div>;
if (error) return <div style={{color: 'red'}}>{error}</div>;

return (
    <div className="App">
        <h1>Quản Lý Người Dùng</h1>
        
        {/* Truyền hàm xử lý POST vào component AddUser */}
        <AddUser onAdd={handleAddUser} />
        
        <hr />
        
        {/* Truyền dữ liệu users vào component UserList */}
        <UserList users={users} />
        
    </div>
);


export default App;
  useEffect(() => {
    fetchUsers();
  }, []);

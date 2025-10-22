import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList'; // Đảm bảo import đúng đường dẫn
import AddUser from './AddUser';   // Đảm bảo import đúng đường dẫn
import './App.css'; // Hoặc file CSS của bạn

// Định nghĩa URL cơ sở của API backend
// Backend được giả định chạy trên http://localhost:3000
const API_URL = "http://localhost:3000/users"; 

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm GET: Lấy danh sách user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch users:", err);
      setError("Không thể tải danh sách người dùng. Đảm bảo backend đã chạy.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect để gọi hàm fetchUsers khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []); // [] đảm bảo hàm chỉ chạy một lần sau lần render đầu tiên

  // Hàm POST: Thêm user mới
  const handleAddUser = async (newUser) => {
    try {
      // 1. Thực hiện API POST
      const response = await axios.post(API_URL, newUser);
      
      // 2. Cập nhật trạng thái (state) users với user mới được trả về từ backend
      // Giả sử API trả về user đã được thêm (bao gồm cả id)
      setUsers([...users, response.data]);
      alert(`Đã thêm user: ${response.data.name}`);

    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      setError("Không thể thêm người dùng. Vui lòng thử lại.");
    }
  };

  if (loading) return <div className="App">Đang tải...</div>;
  if (error) return <div className="App" style={{color: 'red'}}>{error}</div>;

  return (
    <div className="App">
      <h1>Quản lý User</h1>
      
      {/* Component Thêm user, truyền hàm handleAddUser vào prop onAdd */}
      <AddUser onAdd={handleAddUser} />
      
      <hr />
      
      {/* Component Danh sách user, truyền mảng users vào prop users */}
      <UserList users={users} />
      
    </div>
  );
}

export default App;
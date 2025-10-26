import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUser from './EditUser';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Lắng nghe sự kiện khi có thay đổi từ AddUser
    window.addEventListener('userListChanged', fetchUsers);
    return () => window.removeEventListener('userListChanged', fetchUsers);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchUsers(); // Refresh danh sách
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa user');
      }
    }
  };

  return (
    <div className="user-list">
      <h2>Danh sách người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Sửa</button>
                <button onClick={() => handleDelete(user._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <EditUser 
          user={editingUser} 
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

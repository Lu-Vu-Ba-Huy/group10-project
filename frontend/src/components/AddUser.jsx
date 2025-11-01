import React, { useState } from "react";
import axios from 'axios';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", formData);
      // Reset form
      setFormData({ name: "", email: "" });
      // Thông báo cho UserList biết có thay đổi
      window.dispatchEvent(new Event("userListChanged"));
      alert("Thêm người dùng thành công!\nPassword mặc định: 123456");
    } catch (error) {
      console.error('Error adding user:', error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi thêm người dùng";
      alert(errorMsg);
    }
  };

  return (
    <div className="add-user">
      <h2>Thêm người dùng mới</h2>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #2196F3'
      }}>
        <p style={{ margin: 0, color: '#1976d2' }}>
          ℹ️ <strong>Lưu ý:</strong> User mới sẽ có password mặc định là <code style={{ 
            backgroundColor: '#fff', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>123456</code>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên..."
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email..."
          />
        </div>
        <button type="submit">Thêm mới</button>
      </form>
    </div>
  );
}

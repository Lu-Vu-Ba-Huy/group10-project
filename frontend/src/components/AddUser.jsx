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
      await axios.post("http://localhost:3000/users", formData);
      // Reset form
      setFormData({ name: "", email: "" });
      // Thông báo cho UserList biết có thay đổi
      window.dispatchEvent(new Event("userListChanged"));
      alert("Thêm người dùng thành công!");
    } catch (error) {
      console.error('Error adding user:', error);
      alert("Có lỗi xảy ra khi thêm người dùng");
    }
  };

  return (
    <div className="add-user">
      <h2>Thêm người dùng mới</h2>
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

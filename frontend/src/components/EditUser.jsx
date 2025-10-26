import React, { useState } from "react";
import axios from 'axios';

export default function EditUser({ user, onClose }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
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
      await axios.put(`http://localhost:3000/users/${user._id}`, formData);
      window.dispatchEvent(new Event("userListChanged"));
      onClose();
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error('Error updating user:', error);
      alert("Có lỗi xảy ra khi cập nhật người dùng");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sửa thông tin người dùng</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}

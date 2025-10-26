import React, { useState } from "react";
import api from "../api";

export default function EditUser({ user, onClose }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    if (!name.trim()) return alert("Name không được để trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ");
    await api.put(`/users/${user._id || user.id}`, { name, email });
    window.dispatchEvent(new Event("userListChanged"));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Sửa User</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-muted">Hủy</button>
          <button onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

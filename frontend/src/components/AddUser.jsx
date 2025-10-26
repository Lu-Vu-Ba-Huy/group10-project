import React, { useState } from "react";
import api from "../api";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation (Hoạt động 8)
    if (!name.trim()) return alert("Name không được để trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ");

    try {
      await api.post("/users", { name, email });
      setName("");
      setEmail("");
      window.dispatchEvent(new Event("userListChanged"));
    } catch (err) {
      alert("Lỗi khi thêm user");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Thêm User</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên..."
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email..."
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

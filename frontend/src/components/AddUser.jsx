import React, { useState } from "react";
import api from "../api/api";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", { name, email });
      alert("✅ Thêm user thành công!");
      setName("");
      setEmail("");
      onUserAdded(); // gọi reload danh sách
    } catch (err) {
      alert("❌ Lỗi khi thêm user!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm User</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên user"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email user"
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

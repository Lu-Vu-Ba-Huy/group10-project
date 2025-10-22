import React, { useState } from 'react';

const AddUser = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      // Gọi hàm onAdd được truyền từ component cha (App.js)
      // Hàm onAdd sẽ chịu trách nhiệm kết nối API POST
      onAdd({ name, email }); 
      setName('');
      setEmail('');
    } else {
      alert('Vui lòng nhập đầy đủ Tên và Email.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm Người dùng Mới</h2>
      <div>
        <label>Tên:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Thêm User</button>
    </form>
  );
};

export default AddUser;
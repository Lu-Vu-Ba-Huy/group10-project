// File: frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ... import UserList, AddUser

function App() {
  const [users, setUsers] = useState([]);
  
  // (Đã hoàn thành) Sử dụng useEffect để gọi hàm fetchUsers khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []); 

  // ... (các hàm fetchUsers, handleAddUser và render giao diện)
}
// ...
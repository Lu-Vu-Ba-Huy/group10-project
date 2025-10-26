// src/components/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/users')    // <--- đường dẫn đầy đủ
      .then(res => setUsers(res.data))
      .catch(err => console.error('GET /users error:', err));
  }, []);

  return (
    <ul>
      {users.map(u => <li key={u._id}>{u.name} - {u.email}</li>)}
    </ul>
  );
}

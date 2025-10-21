import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function UserList({ refreshFlag }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Lỗi khi tải users:", err));
  }, [refreshFlag]);

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

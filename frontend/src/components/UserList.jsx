import React from 'react';

const UserList = ({ users }) => {
  return (
    <div>
      <h2>Danh sách Người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {/* Giả sử mỗi user có thuộc tính 'name' và 'email' */}
              **{user.name}** - *{user.email}*
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
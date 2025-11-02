import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import '../styles.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();

    // Listen for custom event when user list changes
    const handleUserListChange = () => {
      fetchUsers();
    };

    window.addEventListener('userListChanged', handleUserListChange);

    return () => {
      window.removeEventListener('userListChanged', handleUserListChange);
    };
  }, []);

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.USERS);
      setUsers(response.data.users || []);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Cannot load users list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>⏳ Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>❌ Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button className="btn-primary" onClick={fetchUsers}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>👥 Users List</h2>
        <button className="btn-primary" onClick={fetchUsers}>
          🔄 Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No users found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>Total users: <strong>{users.length}</strong></p>
      </div>
    </div>
  );
}


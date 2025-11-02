import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import Profile from './components/Profile';
import AdminUserList from './components/AdminUserList';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* Auth routes - không cần đăng nhập */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes - cần đăng nhập */}
            <Route path="/users" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            
            <Route path="/add-user" element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminUserList />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
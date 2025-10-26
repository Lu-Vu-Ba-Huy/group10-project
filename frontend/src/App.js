import React from 'react';
import './App.css';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Quản lý người dùng</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <AddUser />
          </div>
          <div className="col-md-6">
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
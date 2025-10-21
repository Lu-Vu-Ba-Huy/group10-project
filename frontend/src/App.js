import React, { useState } from "react";
import "./App.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadList = () => setRefresh(!refresh);

  return (
    <div className="App">
      <h1>Quản lý Users</h1>
      <AddUser onUserAdded={reloadList} />
      <hr />
      <UserList refreshFlag={refresh} />
    </div>
  );
}

export default App;

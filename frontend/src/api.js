import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // kết nối tới backend
  headers: { "Content-Type": "application/json" },
});

export const getUsers = () => API.get("/users");
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;

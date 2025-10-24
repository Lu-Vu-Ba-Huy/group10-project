const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔗 Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://user123:user123@cluster10.dmgdn1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster10")
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// 🧩 Tạo model User
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model("User", userSchema);

// 🧠 API: GET tất cả users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 🧠 API: POST thêm user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));

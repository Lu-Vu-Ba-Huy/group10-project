const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

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

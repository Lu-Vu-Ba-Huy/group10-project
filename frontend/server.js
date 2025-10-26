console.log("✅ Server.js is running...");

const express = require("express");
const connectDB = require("./src/database");
const User = require("./src/models/user");

const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Trang chính
app.get("/", (req, res) => {
  res.send("Hello from MongoDB + Node.js server!");
});

// ✅ Route POST /user
app.post("/user", async (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

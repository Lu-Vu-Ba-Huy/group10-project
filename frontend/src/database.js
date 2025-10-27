const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");

    await mongoose.connect(
      "mongodb+srv://user123:user123@cluster10.dmgdn1x.mongodb.net/group10-project?retryWrites=true&w=majority&appName=Cluster10",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;

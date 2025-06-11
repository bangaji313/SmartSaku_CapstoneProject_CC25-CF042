import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.i2zg2a0.mongodb.net/MyApp?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chat-app",
    });
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};
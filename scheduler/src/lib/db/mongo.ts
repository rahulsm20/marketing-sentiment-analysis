import mongoose from "mongoose";
import "../models/index";

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log(">> Scheduler Service connected successfully to MongoDB");
});

export { mongoose as db };

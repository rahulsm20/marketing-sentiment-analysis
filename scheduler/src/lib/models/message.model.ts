import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    data: { type: String, required: true },
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);

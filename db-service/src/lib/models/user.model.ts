import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    conversations: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Conversation",
        },
      ],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

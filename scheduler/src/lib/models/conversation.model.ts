import mongoose from "mongoose";
import { Message } from "./message.model";

const ConversationStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  SCRAPING: "scraping",
  GENERATION: "generation",
  EMBEDDING: "embedding",
};

export const ConversationStatusEnum = Object.freeze(ConversationStatus);

const ConversationSchema = new mongoose.Schema(
  {
    query: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(ConversationStatusEnum),
      default: ConversationStatusEnum.PENDING,
    },
  },
  { timestamps: true }
);

ConversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversation",
});

ConversationSchema.set("toObject", { virtuals: true });
ConversationSchema.set("toJSON", { virtuals: true });

ConversationSchema.pre("findOneAndDelete", async function (next) {
  const conversation = await this.model.findOne(this.getQuery());
  if (conversation) {
    await Message.deleteMany({ conversation: conversation._id });
  }
  next();
});

ConversationSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const query = this.getQuery();
    const conversation = await this.model.findOne(query);
    if (conversation) {
      await Message.deleteMany({ conversation: conversation._id });
    }
    next();
  }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);

import mongoose, { Schema, Document, model, models, mongo } from "mongoose";

// Define the interface for the Chat document
export interface Chat extends Document {
  participant1: mongoose.Types.ObjectId;
  participant2: mongoose.Types.ObjectId;
  lastmessage: string;
  time: Date;
}

// Create the Chat schema
const ChatSchema: Schema<Chat> = new Schema(
  {
    participant1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes there’s a User model
      required: true,
    },
    participant2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastmessage: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Export the model
const ChatModel = mongoose.models.Chat || mongoose.model<Chat>("Chat", ChatSchema);
export default ChatModel;

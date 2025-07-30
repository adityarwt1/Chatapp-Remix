import mongoose, { Schema, Document } from "mongoose";

// 1. Define TypeScript interface
export interface MessageSchema extends Document {
  chatid: mongoose.Types.ObjectId;
  message: string;
  sender: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Create schema using Schema.Types.ObjectId
const messageSchema: Schema<MessageSchema> = new Schema(
  {
    chatid: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Export model
const Message = mongoose.models.Message ||
  mongoose.model<MessageSchema>("Message", messageSchema);
export default Message

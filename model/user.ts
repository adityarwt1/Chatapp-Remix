import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  status: string;
  image: string;
}

const UserSchema: Schema<User> = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default User;

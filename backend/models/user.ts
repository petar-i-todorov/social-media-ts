import mongoose, { Schema, Types } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  resetToken: {
    required: false,
    type: String,
  },
  resetTokenExpiresIn: {
    required: false,
    type: Date,
  },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", userSchema);

import mongoose, { Types } from "mongoose";

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
  quote: {
    required: false,
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
  avatarUrl: {
    required: false,
    type: String,
  },
  prevAvatarUrl: {
    required: false,
    type: String,
  },
});

export default mongoose.model("User", userSchema);

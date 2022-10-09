import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  resetToken: {
    require: false,
    type: String,
  },
});

export default mongoose.model("User", userSchema);

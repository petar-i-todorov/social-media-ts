import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    devRole: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    platform: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
    upvotes: {
      default: 0,
      type: Number,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Post", postSchema);

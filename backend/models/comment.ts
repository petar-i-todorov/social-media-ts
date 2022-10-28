import mongoose, { Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    creator: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: Types.ObjectId,
      required: true,
      ref: "Post",
    },
    text: {
      type: String,
      required: true,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    votes: {
      type: [
        {
          type: Types.ObjectId,
          required: true,
          ref: "CommentVote",
        },
      ],
      default: [],
    },
  },

  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);

import mongoose, { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
  {
    creatorId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
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

import { Schema, Types, model } from "mongoose";

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
      required: true,
      default: 0,
    },
    votes: [
      {
        type: Types.ObjectId,
        required: true,
        ref: "CommentVote",
      },
    ],
  },

  { timestamps: true }
);

export default model("Comment", commentSchema);

import { Schema, model, Types } from "mongoose";

const commentVoteSchema = new Schema({
  isLike: {
    type: Boolean,
    required: true,
  },
  commentId: {
    type: Types.ObjectId,
    required: true,
    ref: "Comment",
  },
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default model("CommentVote", commentVoteSchema);

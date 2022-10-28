import { Schema, model, Types } from "mongoose";

const commentVoteSchema = new Schema({
  isLike: {
    type: Boolean,
    required: true,
  },
  comment: {
    type: Types.ObjectId,
    required: true,
    ref: "Comment",
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default model("CommentVote", commentVoteSchema);

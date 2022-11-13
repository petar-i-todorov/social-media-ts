export interface IUser {
  _id: string;
  name: string;
  avatarUrl?: string;
  quote?: string;
}

export type Platform =
  | "YOUTUBE"
  | "GITHUB"
  | "STACKOVERFLOW"
  | "LINKEDIN"
  | "UDEMY"
  | "REDDIT"
  | "OTHER";

export interface IPost {
  _id: string;
  title: string;
  devRole: "FRONTEND" | "BACKEND" | "DEVOPS";
  description: string;
  platform: Platform;
  url: string;
  upvotes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  creator: IUser;
  comments: IComment[];
  createdAt: string;
}

export interface IComment {
  _id: string;
  creator: IUser;
  text: string;
  totalVotes: number;
  votes: ICommentVote[];
  createdAt: string;
}

export interface ICommentVote {
  _id: string;
  isLike: boolean;
  user: string;
}

export type DevRole = "FRONTEND" | "BACKEND" | "DEVOPS";

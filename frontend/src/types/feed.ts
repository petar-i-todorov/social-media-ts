export interface IUser {
  _id: string;
  name: string;
  avatarUrl: string;
}

export interface IPost {
  _id: string;
  title: string;
  devRole: "Frontend" | "Backend" | "DevOps";
  description: string;
  platform:
    | "YOUTUBE"
    | "FACEBOOK"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "REDDIT"
    | "LINKEDIN"
    | "OTHER";
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

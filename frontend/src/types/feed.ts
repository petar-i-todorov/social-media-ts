export interface IPost {
  upvotedBy: string[];
  downvotedBy: string[];
  title: string;
  description: string;
  createdAt: Date;
  platform:
    | "YOUTUBE"
    | "FACEBOOK"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "REDDIT"
    | "LINKEDIN"
    | "OTHER";
  upvotes: number;
  url: string;
  devRole: "Frontend" | "Backend" | "DevOps";
  creator: {
    _id: string;
    name: string;
  };
  _id: string;
  comments: IComment[];
}

export interface IComment {
  _id: string;
  creator: {
    name: string;
  };
  totalVotes: number;
  text: string;
  votes: {
    user: string;
    isLike: boolean;
  }[];
}

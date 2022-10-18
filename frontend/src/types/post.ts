export interface IPost {
  title: string;
  description: string;
  createdAt: Date;
  platform:
    | "YOUTUBE"
    | "FACEBOOK"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "COURSERA"
    | "REDDIT"
    | "OTHER";
  upvotes: number;
  url: string;
  devRole: "Frontend" | "Backend" | "DevOps";
  creator: string;
}

import React, { Dispatch, SetStateAction } from "react";
import { DevRole, IPost } from "../types/feed";

export const PostsContext = React.createContext<{
  posts: IPost[];
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  sortBy: "RECENCY" | "VOTES";
  setSortBy: Dispatch<SetStateAction<"RECENCY" | "VOTES">>;
  devRole: DevRole;
  setDevRole: Dispatch<SetStateAction<DevRole>>;
}>({
  posts: [],
  setPosts: () => {},
  sortBy: "RECENCY",
  setSortBy: () => {},
  devRole: "FRONTEND",
  setDevRole: () => {},
});

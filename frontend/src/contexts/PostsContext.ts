import React, { Dispatch, SetStateAction } from "react";
import { IPost } from "../types/feed";

export const PostsContext = React.createContext<{
  posts: IPost[];
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  sortBy: "RECENCY" | "VOTES";
  setSortBy: Dispatch<SetStateAction<"RECENCY" | "VOTES">>;
}>({
  posts: [],
  setPosts: () => {},
  sortBy: "RECENCY",
  setSortBy: () => {},
});

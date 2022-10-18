import React, { Dispatch, useState } from "react";
import { IPost } from "../types/post";

export const PostsContext = React.createContext<{
  posts: IPost[];
  setPosts: Dispatch<React.SetStateAction<IPost[]>>;
}>({
  posts: [],
  setPosts: () => {},
});

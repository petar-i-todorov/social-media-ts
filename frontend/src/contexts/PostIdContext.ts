import { createContext } from "react";

export const PostIdContext = createContext<{
  postId: string;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
}>({
  postId: "",
  setPostId: () => {},
});

import { createContext, Dispatch, SetStateAction } from "react";

export const PostIdContext = createContext<{
  postId: string;
  setPostId: Dispatch<SetStateAction<string>>;
}>({
  postId: "",
  setPostId: () => {},
});

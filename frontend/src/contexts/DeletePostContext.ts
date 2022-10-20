import { createContext } from "react";

export const DeletePostContext = createContext<{
  deletePost: boolean;
  setDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  deletePost: false,
  setDeletePost: () => {},
});

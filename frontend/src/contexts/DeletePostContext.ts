import { createContext } from "react";

export const DeletePostContext = createContext<{
  deletePostVisibility: boolean;
  setDeletePostVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  deletePostVisibility: false,
  setDeletePostVisibility: () => {},
});

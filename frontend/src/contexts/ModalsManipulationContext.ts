import { createContext, Dispatch, SetStateAction } from "react";

export const ModalsManipulationContext = createContext<{
  addPostVisibility: boolean;
  setAddPostVisibility: Dispatch<SetStateAction<boolean>>;
  deletePostVisibility: boolean;
  setDeletePostVisibility: Dispatch<SetStateAction<boolean>>;
  reportPostVisibility: boolean;
  setReportPostVisibility: Dispatch<SetStateAction<boolean>>;
  editPostVisibility: boolean;
  setEditPostVisibility: Dispatch<SetStateAction<boolean>>;
}>({
  addPostVisibility: false,
  setAddPostVisibility: () => {},
  deletePostVisibility: false,
  setDeletePostVisibility: () => {},
  reportPostVisibility: false,
  setReportPostVisibility: () => {},
  editPostVisibility: false,
  setEditPostVisibility: () => {},
});

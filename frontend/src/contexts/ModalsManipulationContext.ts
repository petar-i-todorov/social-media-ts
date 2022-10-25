import { createContext, Dispatch } from "react";

export const ModalsManipulationContext = createContext<{
  addPostVisibility: boolean;
  setAddPostVisibility: Dispatch<React.SetStateAction<boolean>>;
  deletePostVisibility: boolean;
  setDeletePostVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  reportPostVisibility: boolean;
  setReportPostVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  editPostVisibility: boolean;
  setEditPostVisibility: React.Dispatch<React.SetStateAction<boolean>>;
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

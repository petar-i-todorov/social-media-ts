import React, { Dispatch } from "react";

export const AddPostContext = React.createContext<{
  addPost: boolean;
  setAddPost: Dispatch<React.SetStateAction<boolean>>;
}>({
  addPost: false,
  setAddPost: () => {},
});

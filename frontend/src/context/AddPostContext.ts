import React from "react";

export const AddPostContext = React.createContext({
  addPost: false,
  setAddPost: (state: boolean) => {},
});

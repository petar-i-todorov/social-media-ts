import { createContext } from "react";

export const flashMessage = createContext<{
  isFeedFlashMessage: boolean;
  setIsFeedFlashMessage: React.Dispatch<React.SetStateAction<boolean>>;
  feedFlashMessageText: string;
  setFeedFlashMessageText: React.Dispatch<React.SetStateAction<string>>;
}>({
  isFeedFlashMessage: false,
  setIsFeedFlashMessage: () => {},
  feedFlashMessageText: "",
  setFeedFlashMessageText: () => {},
});

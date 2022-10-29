import { createContext } from "react";

export const FlashMessageContext = createContext<{
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

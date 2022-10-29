import { createContext } from "react";

export const FlashMessageContext = createContext<{
  isFeedFlashMessage: boolean;
  setIsFeedFlashMessage: React.Dispatch<React.SetStateAction<boolean>>;
  feedFlashMessageConfiguration: { text: string; color: "green" | "red" };
  setFeedFlashMessageConfiguration: React.Dispatch<
    React.SetStateAction<{ text: string; color: "green" | "red" }>
  >;
}>({
  isFeedFlashMessage: false,
  setIsFeedFlashMessage: () => {},
  feedFlashMessageConfiguration: { text: "", color: "red" },
  setFeedFlashMessageConfiguration: () => {},
});

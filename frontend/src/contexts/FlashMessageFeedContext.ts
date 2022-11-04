import { createContext } from "react";

export const FlashMessageContext = createContext<{
  isFeedFlashMessage: boolean;
  setIsFeedFlashMessage: React.Dispatch<React.SetStateAction<boolean>>;
  feedFlashMessageConfiguration: { text: string; color: "green" | "red" };
  setFeedFlashMessageConfiguration: React.Dispatch<
    React.SetStateAction<{ text: string; color: "green" | "red" }>
  >;
  activeFlashTimeout: number | NodeJS.Timeout;
  setActiveFlashTimeout: React.Dispatch<
    React.SetStateAction<number | NodeJS.Timeout>
  >;
  isLoader: boolean;
  setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isFeedFlashMessage: false,
  setIsFeedFlashMessage: () => {},
  feedFlashMessageConfiguration: { text: "", color: "red" },
  setFeedFlashMessageConfiguration: () => {},
  activeFlashTimeout: 0,
  setActiveFlashTimeout: () => {},
  isLoader: false,
  setIsLoader: () => {},
});

import { createContext, Dispatch, SetStateAction } from "react";

export const FlashMessageContext = createContext<{
  isFeedFlashMessage: boolean;
  setIsFeedFlashMessage: Dispatch<SetStateAction<boolean>>;
  feedFlashMessageConfiguration: { text: string; color: "green" | "red" };
  setFeedFlashMessageConfiguration: Dispatch<
    SetStateAction<{ text: string; color: "green" | "red" }>
  >;
  activeFlashTimeout: number | NodeJS.Timeout;
  setActiveFlashTimeout: Dispatch<SetStateAction<number | NodeJS.Timeout>>;
  isLoader: boolean;
  setIsLoader: Dispatch<SetStateAction<boolean>>;
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

import { createContext, Dispatch, SetStateAction } from "react";

export const SwitchThemeContext = createContext<{
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}>({ isDarkMode: false, setIsDarkMode: () => {} });

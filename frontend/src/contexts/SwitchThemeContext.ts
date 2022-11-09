import React from "react";

export const SwitchThemeContext = React.createContext<{
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isDarkMode: false, setIsDarkMode: () => {} });

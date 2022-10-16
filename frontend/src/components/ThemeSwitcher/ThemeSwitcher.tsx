import { useState } from "react";
import styles from "./ThemeSwitcher.module.scss";

const ThemeSwapper = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  return (
    <div
      className={
        styles.themeSwapper + " " + (isDarkTheme && styles.whiteBackground)
      }
      onClick={() => {
        if (isDarkTheme) {
          setIsDarkTheme(false);
        } else {
          setIsDarkTheme(true);
        }
      }}
    >
      <div
        className={styles.circle + " " + (isDarkTheme && styles.darkCircle)}
      ></div>
    </div>
  );
};

export default ThemeSwapper;

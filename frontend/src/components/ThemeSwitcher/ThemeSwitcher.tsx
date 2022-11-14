import { useContext } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./ThemeSwitcher.module.scss";

const ThemeSwitcher = () => {
  const { isDarkMode, setIsDarkMode } = useContext(SwitchThemeContext);

  return isDarkMode ? (
    <MdLightMode
      size="30"
      onClick={() => {
        setIsDarkMode(false);
      }}
      className={styles.switchModeLogo}
    />
  ) : (
    <MdDarkMode
      size="30"
      onClick={() => {
        setIsDarkMode(true);
      }}
      className={styles.switchModeLogo}
    />
  );
};

export default ThemeSwitcher;

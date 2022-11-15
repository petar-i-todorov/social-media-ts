import { useContext } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./ThemeSwitcher.module.scss";

const ThemeSwitcher = () => {
  const { isDarkMode, setIsDarkMode } = useContext(SwitchThemeContext);

  const switcherProps = {
    size: 30,
    className: styles.switchModeLogo,
  };

  return isDarkMode ? (
    <MdLightMode {...switcherProps} onClick={() => setIsDarkMode(false)} />
  ) : (
    <MdDarkMode {...switcherProps} onClick={() => setIsDarkMode(true)} />
  );
};

export default ThemeSwitcher;

import { FC, useContext } from "react";
import { Outlet } from "react-router-dom";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./MobileMenu.module.scss";
import Avatar from "../Avatar/Avatar";
import Dropdown from "../Dropdown/Dropdown";

interface MobileMenuProps {
  userAvatar: string | undefined;
}

const MobileMenu: FC<MobileMenuProps> = ({ userAvatar }) => {
  const { isDarkMode } = useContext(SwitchThemeContext);

  return (
    <>
      <Outlet />
      <div className={`${styles.navBar} ${isDarkMode && styles.darkMode}`}>
        <Avatar
          url={userAvatar}
          size={35}
          linkTo={
            localStorage.getItem("userId")
              ? `/user/${localStorage.getItem("userId")}`
              : "/login"
          }
        />
        <Dropdown reversed />
      </div>
    </>
  );
};

export default MobileMenu;

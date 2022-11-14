import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { VscTriangleUp } from "react-icons/vsc";
import { devRoles } from "../../constants/feed";
import { PostsContext } from "../../contexts/PostsContext";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { DevRole } from "../../types/feed";
import styles from "./MobileMenu.module.scss";
import Avatar from "../Avatar/Avatar";

interface MobileMenuProps {
  userAvatar: string | undefined;
}

const MobileMenu: FC<MobileMenuProps> = ({ userAvatar }) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  const { devRole, setDevRole } = useContext(PostsContext);
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
      </div>
    </>
  );
};

export default MobileMenu;

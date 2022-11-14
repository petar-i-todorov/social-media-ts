import { FC, useContext, useState } from "react";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { devRoles } from "../../constants/feed";
import { PostsContext } from "../../contexts/PostsContext";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { DevRole } from "../../types/feed";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  reversed?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ reversed }) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  const { isDarkMode } = useContext(SwitchThemeContext);
  const { devRole, setDevRole } = useContext(PostsContext);

  const triangleStyles = `${styles.triangle} ${
    dropdownVisibility && styles.active
  }`;
  return (
    <div
      className={`${styles.dropdownContainer} ${reversed && styles.reversed}`}
      onClick={() => {
        setDropdownVisibility((state) => !state);
      }}
    >
      {devRole}{" "}
      {reversed ? (
        <VscTriangleUp className={triangleStyles} />
      ) : (
        <VscTriangleDown className={triangleStyles} />
      )}
      <div
        className={`${styles.dropdown} 
        ${dropdownVisibility && styles.active}
        ${isDarkMode && styles.darkMode}`}
      >
        {(devRoles as DevRole[])
          .filter((role) => role !== devRole)
          .map((role) => {
            return (
              <div
                key={role}
                className={`${styles.role} ${isDarkMode && styles.darkMode}`}
                onClick={() => {
                  setDevRole(role);
                }}
              >
                {role}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dropdown;

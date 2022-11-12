import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { VscTriangleUp } from "react-icons/vsc";

import { devRoles } from "../../constants/feed";
import { PostsContext } from "../../contexts/PostsContext";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { DevRole } from "../../types/feed";
import styles from "./NavBar.module.scss";

const NavBar: React.FC<{ userAvatar: string | undefined }> = ({
  userAvatar,
}) => {
  const { devRole, setDevRole } = useContext(PostsContext);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const { isDarkMode } = useContext(SwitchThemeContext);
  return (
    <>
      <Outlet />
      <div className={styles.navBar + " " + (isDarkMode && styles.darkMode)}>
        <Link
          to={
            localStorage.getItem("userId")
              ? `/user/${localStorage.getItem("userId")}`
              : "/login"
          }
        >
          {userAvatar ? (
            <img
              src={`http://localhost:8080/${userAvatar}`}
              width="35"
              height="35"
              className={styles.userAvatar}
            />
          ) : (
            <FaUserCircle size="35" color="white" />
          )}
        </Link>
        <div
          className={styles.dropdownContainer}
          onClick={() => {
            setDropdownVisibility((state) => !state);
          }}
        >
          {devRole}{" "}
          <VscTriangleUp
            className={
              styles.triangle + " " + (dropdownVisibility && styles.active)
            }
          />
          <div
            className={
              styles.dropdown +
              " " +
              (dropdownVisibility && styles.active) +
              " " +
              (isDarkMode && styles.darkMode)
            }
          >
            {(devRoles as DevRole[])
              .filter((role) => role !== devRole)
              .map((role) => {
                return (
                  <div
                    key={role}
                    className={
                      styles.role + " " + (isDarkMode && styles.darkMode)
                    }
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
      </div>
    </>
  );
};

export default NavBar;

import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, Outlet } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import FormMessage from "../FormMessage/FormMessage";
import { useContext, useState } from "react";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { FaUserCircle } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import { PostsContext } from "../../contexts/PostsContext";
import { DevRole } from "../../types/feed";
import { devRoles } from "../../constants/feed";
import { GiRoundStar } from "react-icons/gi";

const NavBar = () => {
  const { isFeedFlashMessage, feedFlashMessageConfiguration } =
    useContext(FlashMessageContext);
  const { devRole, setDevRole } = useContext(PostsContext);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  return (
    <>
      <header className={styles.header}>
        <ul className={styles.nav}>
          <li>
            <Link to="">
              <span className={styles.appLogo}>
                <GiRoundStar size="30" />
                -the-source
              </span>
            </Link>
          </li>
          <li className={styles.searchContainer}>
            <AiOutlineSearch size="30" color="black" />
            <input
              placeholder="Search for posts"
              className={styles.searchBar}
            />
          </li>
          <li>
            <Link
              to={
                localStorage.getItem("userId")
                  ? `/user/${localStorage.getItem("userId")}`
                  : "/login"
              }
            >
              <FaUserCircle size="35" color="white" />
            </Link>
          </li>
          <li>
            <div
              className={styles.dropdownContainer}
              onClick={() => {
                setDropdownVisibility((state) => !state);
              }}
            >
              {devRole}{" "}
              <VscTriangleDown
                className={
                  styles.triangle + " " + (dropdownVisibility && styles.active)
                }
              />
              <div
                className={
                  styles.dropdown + " " + (dropdownVisibility && styles.active)
                }
              >
                {(devRoles as DevRole[])
                  .filter((role) => role !== devRole)
                  .map((role) => {
                    return (
                      <div
                        key={role}
                        className={styles.role}
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
          </li>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
        {isFeedFlashMessage && (
          <FormMessage
            children={feedFlashMessageConfiguration.text}
            color={feedFlashMessageConfiguration.color}
            flash
          />
        )}
      </header>
      <Outlet />
    </>
  );
};

export default NavBar;

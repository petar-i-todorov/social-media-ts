import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, Outlet } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import FormMessage from "../FormMessage/FormMessage";
import { useContext } from "react";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const { isFeedFlashMessage, feedFlashMessageConfiguration } =
    useContext(FlashMessageContext);
  return (
    <>
      <header className={styles.header}>
        <ul className={styles.nav}>
          <li>
            <Link to="">
              <span className={styles.appLogo}>social-media-ts</span>
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
            <Link to={`/user/${localStorage.getItem("userId")}`}>
              <FaUserCircle size="35" color="white" />
            </Link>
          </li>
          <li>Dev Role</li>
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

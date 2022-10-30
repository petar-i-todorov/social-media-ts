import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Outlet } from "react-router-dom";
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
            <FaUserCircle size="35" />
          </li>
          <li className={styles.searchContainer}>
            <AiOutlineSearch size="30" color="black" />
            <input
              placeholder="Search for posts"
              className={styles.searchBar}
            />
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

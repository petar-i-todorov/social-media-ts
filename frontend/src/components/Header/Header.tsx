import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import FormMessage from "../FormMessage/FormMessage";
import { useContext } from "react";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";

const NavBar = () => {
  const { isFeedFlashMessage, feedFlashMessageText } =
    useContext(FlashMessageContext);
  return (
    <>
      <header className={styles.header}>
        <ul className={styles.nav}>
          <li>Avatar</li>
          <li className={styles.searchContainer}>
            <AiOutlineSearch size="30" color="black" />
            <input
              placeholder="Search for posts"
              className={styles.searchBar}
            />
          </li>
          <li>Messages</li>
          <li>Dev Role</li>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
        {isFeedFlashMessage && (
          <FormMessage children={feedFlashMessageText} color="red" flash />
        )}
      </header>
      <Outlet />
    </>
  );
};

export default NavBar;

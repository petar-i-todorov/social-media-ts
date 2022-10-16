import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const NavBar = () => {
  return (
    <>
      <header className={styles.header}>
        <ul className={styles.nav}>
          <li>Avatar</li>
          <li className={styles.searchContainer}>
            <AiOutlineSearch size="30" />
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
      </header>
      <Outlet />
    </>
  );
};

export default NavBar;

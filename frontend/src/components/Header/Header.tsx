import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";

const NavBar = () => {
  return (
    <header className={styles.header}>
      <ul className={styles.nav}>
        <li>Avatar</li>
        <li>Theme Changer</li>
        <li className={styles.searchContainer}>
          <AiOutlineSearch size="30" />
          <input placeholder="Search for posts" className={styles.searchBar} />
        </li>
        <li>Messages</li>
        <li>Dev Role</li>
      </ul>
    </header>
  );
};

export default NavBar;

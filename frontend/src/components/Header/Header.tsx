import { useContext, FC, Dispatch, SetStateAction, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { BiLoaderCircle } from "react-icons/bi";
import styles from "./Header.module.scss";
import FormMessage from "../FormMessage/FormMessage";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import Avatar from "../Avatar/Avatar";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import AppLogo from "../Logo/AppLogo";
import SearchBar from "../SearchBar/SearchBar";
import Dropdown from "../Dropdown/Dropdown";

interface HeaderProps {
  areSuggestionsVisible: boolean;
  isDarkMode: boolean;
  setAreSuggestionsVisible: Dispatch<SetStateAction<boolean>>;
  setIsNavigatingToFeed: Dispatch<SetStateAction<boolean>>;
  userAvatar: string | undefined;
}

const Header: FC<HeaderProps> = ({
  areSuggestionsVisible,
  isDarkMode,
  setAreSuggestionsVisible,
  setIsNavigatingToFeed,
  userAvatar,
}) => {
  const { feedFlashMessageConfiguration, isFeedFlashMessage, isLoader } =
    useContext(FlashMessageContext);

  const onHeaderClick = useCallback(() => {
    setAreSuggestionsVisible(false);
  }, [setAreSuggestionsVisible]);

  return (
    <>
      <header
        className={`${styles.header} ${isDarkMode && styles.darkMode}`}
        onClick={onHeaderClick}
      >
        <div className={styles.nav}>
          <AppLogo />
          <SearchBar
            areSuggestionsVisible={areSuggestionsVisible}
            setAreSuggestionsVisible={setAreSuggestionsVisible}
            setIsNavigatingToFeed={setIsNavigatingToFeed}
          />
          <Avatar
            url={userAvatar}
            size={35}
            linkTo={
              localStorage.getItem("userId")
                ? `/user/${localStorage.getItem("userId")}`
                : "/login"
            }
          />
          <Dropdown />
          <ThemeSwitcher />
        </div>
        <FormMessage
          children={feedFlashMessageConfiguration.text}
          color={feedFlashMessageConfiguration.color}
          flash
          flashVisibility={isFeedFlashMessage}
        />
        {isLoader && (
          <BiLoaderCircle size="50" color="gray" className={styles.loader} />
        )}
      </header>
      <Outlet />
    </>
  );
};

export default Header;

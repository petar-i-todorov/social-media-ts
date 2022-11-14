import { useContext, useState, FC, Dispatch, SetStateAction } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GiRoundStar } from "react-icons/gi";
import { BiLoaderCircle } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { VscTriangleDown } from "react-icons/vsc";
import styles from "./Header.module.scss";
import FormMessage from "../FormMessage/FormMessage";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { DevRole } from "../../types/feed";
import { devRoles } from "../../constants/feed";
import Avatar from "../Avatar/Avatar";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";

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
  const {
    feedFlashMessageConfiguration,
    isFeedFlashMessage,
    isLoader,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    setIsLoader,
  } = useContext(FlashMessageContext);
  const { devRole, setDevRole, sortBy, setPosts } = useContext(PostsContext);

  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  return (
    <>
      <header
        className={`${styles.header} ${isDarkMode && styles.darkMode}`}
        onClick={() => {
          setAreSuggestionsVisible(false);
        }}
      >
        <ul className={styles.nav}>
          <li>
            <Link to="">
              <span className={styles.appLogo}>
                <GiRoundStar size="30" />
                <span className={styles.logoText}>-the-source</span>
              </span>
            </Link>
          </li>
          <li className={styles.searchContainer}>
            {areSuggestionsVisible && (
              <SearchSuggestions
                searchText={searchText}
                setAreSuggestionsVisible={setAreSuggestionsVisible}
                setIsNavigatingToFeed={setIsNavigatingToFeed}
                setSearchText={setSearchText}
              />
            )}
            <AiOutlineSearch size="30" color="black" />
            <input
              onFocus={() => {
                setAreSuggestionsVisible(true);
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
              placeholder="Search for posts"
              className={styles.searchBar}
              value={searchText}
              onChange={(event) => {
                setSearchText((event.target as HTMLInputElement).value);
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  (event.target as HTMLInputElement).blur();
                  setAreSuggestionsVisible(false);
                  setIsLoader(true);
                  const response = await fetch(
                    `http://localhost:8080/posts?sortBy=${sortBy}&devRole=${devRole}&substring=${searchText}`
                  );
                  setIsLoader(false);
                  if (response.status === 200) {
                    setIsNavigatingToFeed(true);
                    navigate("/");
                    const posts = await response.json();
                    setPosts(posts);
                  } else if (response.status === 404) {
                    setIsNavigatingToFeed(true);
                    navigate("/");
                    setPosts([]);
                  } else {
                    setFeedFlashMessageConfiguration({
                      text: "Something went wrong. Please, try again later.",
                      color: "red",
                    });
                    setIsFeedFlashMessage(true);
                  }
                }
              }}
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
              <Avatar url={userAvatar} size={35} />
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
                className={`${styles.triangle} ${
                  dropdownVisibility && styles.active
                }`}
              />
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
          </li>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
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

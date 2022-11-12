import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GiRoundStar } from "react-icons/gi";
import { BiLoaderCircle } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";

import styles from "./Header.module.scss";
import FormMessage from "../FormMessage/FormMessage";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { DevRole } from "../../types/feed";
import { devRoles, searchSuggestions } from "../../constants/feed";

const NavBar: React.FC<{
  setIsNavigatingToFeed: React.Dispatch<React.SetStateAction<boolean>>;
  areSuggestionsVisible: boolean;
  setAreSuggestionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userAvatar: string | undefined;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setIsNavigatingToFeed,
  areSuggestionsVisible,
  setAreSuggestionsVisible,
  userAvatar,
  setIsDarkMode,
  isDarkMode,
}) => {
  const {
    isFeedFlashMessage,
    feedFlashMessageConfiguration,
    isLoader,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    setActiveFlashTimeout,
    activeFlashTimeout,
    setIsLoader,
  } = useContext(FlashMessageContext);
  const { devRole, setDevRole, sortBy, setPosts } = useContext(PostsContext);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <header
        className={styles.header + " " + (isDarkMode && styles.darkMode)}
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
              <div
                className={
                  styles.searchSuggestions +
                  " " +
                  (isDarkMode && styles.darkMode)
                }
              >
                {searchSuggestions.find((suggestion) => {
                  return suggestion
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                }) ? (
                  searchSuggestions.map((suggestion) => {
                    if (
                      suggestion
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    ) {
                      return (
                        <div
                          key={suggestion}
                          className={
                            styles.suggestion +
                            " " +
                            (isDarkMode && styles.darkMode)
                          }
                          onClick={async () => {
                            setSearchText(suggestion);
                            setAreSuggestionsVisible(false);
                            setIsLoader(true);
                            const response = await fetch(
                              `http://localhost:8080/posts?sortBy=${sortBy}&devRole=${devRole}&substring=${suggestion}`
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
                              clearTimeout(activeFlashTimeout);
                              const timeout = setTimeout(() => {
                                setIsFeedFlashMessage(false);
                              }, 5000);
                              setActiveFlashTimeout(timeout);
                            }
                          }}
                        >
                          {suggestion}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <div
                    className={
                      styles.suggestion + " " + (isDarkMode && styles.darkMode)
                    }
                    onClick={async () => {
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
                        clearTimeout(activeFlashTimeout);
                        const timeout = setTimeout(() => {
                          setIsFeedFlashMessage(false);
                        }, 5000);
                        setActiveFlashTimeout(timeout);
                      }
                    }}
                  >
                    {searchText}
                  </div>
                )}
              </div>
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
                    clearTimeout(activeFlashTimeout);
                    const timeout = setTimeout(() => {
                      setIsFeedFlashMessage(false);
                    }, 5000);
                    setActiveFlashTimeout(timeout);
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
              {userAvatar ? (
                <img
                  src={`http://localhost:8080/${userAvatar}`}
                  width="35"
                  height="35"
                  className={styles.userAvatar}
                  alt="avatar"
                />
              ) : (
                <FaUserCircle size="35" color="white" />
              )}
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
          </li>
          <li>
            {isDarkMode ? (
              <MdLightMode
                size="30"
                onClick={() => {
                  setIsDarkMode(false);
                }}
                className={styles.switchModeLogo}
              />
            ) : (
              <MdDarkMode
                size="30"
                onClick={() => {
                  setIsDarkMode(true);
                }}
                className={styles.switchModeLogo}
              />
            )}
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

export default NavBar;

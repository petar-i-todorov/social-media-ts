import styles from "./Header.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import FormMessage from "../FormMessage/FormMessage";
import { useContext, useEffect, useState } from "react";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { FaUserCircle } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import { PostsContext } from "../../contexts/PostsContext";
import { DevRole } from "../../types/feed";
import { devRoles, searchSuggestions } from "../../constants/feed";
import { GiRoundStar } from "react-icons/gi";
import { BiLoaderCircle } from "react-icons/bi";

const NavBar: React.FC<{
  setIsNavigatingToFeed: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsNavigatingToFeed }) => {
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
  const [areSuggestionsVisible, setAreSuggestionsVisible] = useState(false);
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
            {areSuggestionsVisible && (
              <div className={styles.searchSuggestions}>
                {searchSuggestions.find((suggestion) => {
                  return suggestion.includes(searchText);
                }) ? (
                  searchSuggestions.map((suggestion) => {
                    if (
                      suggestion
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    ) {
                      return (
                        <div
                          className={styles.suggestion}
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
                    }
                  })
                ) : (
                  <div
                    className={styles.suggestion}
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
              placeholder="Search for posts"
              className={styles.searchBar}
              value={searchText}
              onChange={(event) => {
                setSearchText((event.target as HTMLInputElement).value);
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
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

import { useContext, FC, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { searchSuggestions } from "../../constants/feed";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./SearchSuggestions.module.scss";

interface SearchSuggestionsProps {
  searchText: string;
  setAreSuggestionsVisible: Dispatch<SetStateAction<boolean>>;
  setIsNavigatingToFeed: Dispatch<SetStateAction<boolean>>;
  setSearchText: Dispatch<SetStateAction<string>>;
}

const SearchSuggestions: FC<SearchSuggestionsProps> = ({
  searchText,
  setAreSuggestionsVisible,
  setIsNavigatingToFeed,
  setSearchText,
}) => {
  const { isDarkMode } = useContext(SwitchThemeContext);
  const {
    setIsLoader,
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
  } = useContext(FlashMessageContext);
  const { devRole, sortBy, setPosts } = useContext(PostsContext);
  const navigate = useNavigate();
  return (
    <div
      className={`${styles.searchSuggestions} ${isDarkMode && styles.darkMode}`}
    >
      {searchSuggestions.find((suggestion) => {
        return suggestion.toLowerCase().includes(searchText.toLowerCase());
      }) ? (
        searchSuggestions.map((suggestion) => {
          if (suggestion.toLowerCase().includes(searchText.toLowerCase())) {
            return (
              <div
                key={suggestion}
                className={`${styles.suggestion} ${
                  isDarkMode && styles.darkMode
                }`}
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
          className={`${styles.suggestion} ${isDarkMode && styles.darkMode}`}
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
            }
          }}
        >
          {searchText}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;

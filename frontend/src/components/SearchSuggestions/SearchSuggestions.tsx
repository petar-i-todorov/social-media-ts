import { useContext, FC, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../api/posts";
import {
  defaultFlashMessageConfig,
  searchSuggestions,
} from "../../constants/feed";
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

  const onSuggestionClick = async (suggestion: string) => {
    setSearchText(suggestion);
    setAreSuggestionsVisible(false);
    setIsLoader(true);
    const response = await getPosts({
      devRole,
      sortBy,
      substring: suggestion,
    });
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
      setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
      setIsFeedFlashMessage(true);
    }
  };
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
                onClick={() => {
                  onSuggestionClick(suggestion);
                }}
              >
                {suggestion}
              </div>
            );
          }
          return null;
        })
      ) : (
        <div
          className={`${styles.suggestion} ${isDarkMode && styles.darkMode}`}
          onClick={() => {
            onSuggestionClick(searchText);
          }}
        >
          {searchText}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;

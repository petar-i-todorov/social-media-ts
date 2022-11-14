import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  areSuggestionsVisible: boolean;
  setAreSuggestionsVisible: Dispatch<SetStateAction<boolean>>;
  setIsNavigatingToFeed: Dispatch<SetStateAction<boolean>>;
}

const SearchBar: FC<SearchBarProps> = ({
  areSuggestionsVisible,
  setAreSuggestionsVisible,
  setIsNavigatingToFeed,
}) => {
  const [searchText, setSearchText] = useState("");

  const {
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    setIsLoader,
  } = useContext(FlashMessageContext);
  const { devRole, sortBy, setPosts } = useContext(PostsContext);

  const navigate = useNavigate();
  return (
    <div className={styles.searchContainer}>
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
    </div>
  );
};

export default SearchBar;

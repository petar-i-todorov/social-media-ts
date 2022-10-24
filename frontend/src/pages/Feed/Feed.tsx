import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import FormMessage from "../../components/FormMessage/FormMessage";

const FeedPage = () => {
  const { posts, setPosts } = useContext(PostsContext);
  const { setAddPostVisibility } = useContext(ModalsManipulationContext);
  const [isFlashMessage, setIsFlashMessage] = useState(false);
  const [flashMessageText, setFlashMessageText] = useState("");
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
      });
      const posts = await response.json();
      setPosts(posts);
    }
    fetchData();
  }, [setPosts]);
  return (
    <main className={styles.feed}>
      <menu className={styles.feedMenu}>
        <Button
          color="blue"
          className={styles.addBtn}
          onClick={() => {
            setAddPostVisibility(true);
          }}
        >
          Add a post
        </Button>
        <select id="sort" className={styles.sortDropdown}>
          <option value="date">Most recent</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </menu>
      {posts.length ? (
        posts.map((post) => {
          return (
            <Post
              createdAt={post.createdAt}
              creatorId={post.creator._id}
              creatorName={post.creator.name}
              key={post._id}
              id={post._id}
              title={post.title}
              description={post.description}
              platform={post.platform}
              upvotes={post.upvotes}
              upvotedBy={post.upvotedBy}
              downvotedBy={post.downvotedBy}
              isFlashMessage={isFlashMessage}
              setIsFlashMessage={setIsFlashMessage}
              setFlashMessageText={setFlashMessageText}
            />
          );
        })
      ) : (
        <h1 className={styles.text}>No posts were found...</h1>
      )}
      {isFlashMessage && (
        <FormMessage children={flashMessageText} color="red" flash />
      )}
    </main>
  );
};

export default FeedPage;

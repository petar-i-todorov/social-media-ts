import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";
import { IPost } from "../../types/post";
import { AddPostContext } from "../../context/AddPostContext";

const FeedPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const { setAddPost } = useContext(AddPostContext);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
      });
      const posts = await response.json();
      setPosts(posts);
    }
    fetchData();
  }, []);
  return (
    <main className={styles.feed}>
      <menu className={styles.feedMenu}>
        <Button
          color="blue"
          className={styles.addBtn}
          onClick={() => {
            setAddPost(true);
          }}
        >
          Add a post
        </Button>
        <select id="sort" className={styles.sortDropdown}>
          <option value="date">Most recent</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </menu>
      {posts.map((post) => {
        return (
          <Post
            title={post.title}
            description={post.description}
            platform={post.platform}
            upvotes={post.upvotes}
          />
        );
      })}
    </main>
  );
};

export default FeedPage;

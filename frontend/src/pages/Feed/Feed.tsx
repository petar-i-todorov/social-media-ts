import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import PostSkeleton from "../../components/Post/PostSkeleton";

const FeedPage = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { posts, setPosts, sortBy, setSortBy, devRole } =
    useContext(PostsContext);
  const { setAddPostVisibility } = useContext(ModalsManipulationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPostDate, setLastPostDate] = useState<null | string>(null);
  const [lastPostVotes, setLastPostVotes] = useState<null | number>(null);
  const infiniteObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      observer.unobserve(entries[0].target);
      setIsIntersecting(true);
    }
  });
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/posts?sortBy=${sortBy}&devRole=${devRole}&lastPostDate=null&lastPostVotes=null`,
        {
          method: "GET",
        }
      );
      const posts = await response.json();
      setLastPostDate(posts[posts.length - 1].createdAt);
      setLastPostVotes(posts[posts.length - 1].upvotes);
      setIsLoading(false);
      setPosts(posts);
    }
    fetchData();
  }, [devRole, sortBy]);
  useEffect(() => {
    async function fetchData() {
      if (isIntersecting && lastPostDate && lastPostVotes !== null) {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/posts?sortBy=${sortBy}&devRole=${devRole}&lastPostDate=${lastPostDate}&lastPostVotes=${lastPostVotes}`,
          {
            method: "GET",
          }
        );
        const fetchedPosts = await response.json();
        if (fetchedPosts.length) {
          setLastPostDate(fetchedPosts[fetchedPosts.length - 1].createdAt);
          setLastPostVotes(fetchedPosts[fetchedPosts.length - 1].upvotes);
        }
        setIsLoading(false);
        setPosts((posts) => [...posts, ...fetchedPosts]);
        setIsIntersecting(false);
      }
    }
    fetchData();
  }, [isIntersecting]);
  return (
    <main className={styles.feed}>
      <menu className={styles.feedMenu}>
        {localStorage.getItem("userId") && (
          <Button
            color="blue"
            className={styles.addBtn}
            onClick={() => {
              setAddPostVisibility(true);
            }}
          >
            Add a post
          </Button>
        )}
        <select
          id="sort"
          className={styles.sortDropdown}
          onChange={(event) => {
            if (
              event.target.value === "RECENCY" ||
              event.target.value === "VOTES"
            )
              setSortBy(event.target.value);
          }}
        >
          <option value="RECENCY">Most recent</option>
          <option value="VOTES">Most upvoted</option>
        </select>
      </menu>
      {posts.length ? (
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <Post key={post._id} post={post} observer={infiniteObserver} />
            );
          }
          return <Post key={post._id} post={post} />;
        })
      ) : isLoading ? (
        <div className={styles.skeletonsContainer}>
          <div className={styles.skeleton}>
            <PostSkeleton />
          </div>
          <div className={styles.skeleton}>
            <PostSkeleton />
          </div>
          <div className={styles.skeleton}>
            <PostSkeleton />
          </div>
        </div>
      ) : (
        <h1 className={styles.text}>No posts were found...</h1>
      )}
    </main>
  );
};

export default FeedPage;

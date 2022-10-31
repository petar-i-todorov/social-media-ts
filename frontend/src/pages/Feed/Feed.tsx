import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import { sortAndSetPosts } from "../../utils/feed";
import PostSkeleton from "../../components/Post/PostSkeleton";

const FeedPage = () => {
  const { posts, setPosts, sortBy, setSortBy, devRole } =
    useContext(PostsContext);
  const { setAddPostVisibility } = useContext(ModalsManipulationContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
      });
      const posts = await response.json();
      setIsLoading(false);
      sortAndSetPosts(posts, setPosts, sortBy, devRole);
    }
    fetchData();
  }, [devRole]);
  useEffect(() => {
    sortAndSetPosts(posts, setPosts, sortBy, devRole);
  }, [sortBy]);
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
              comments={post.comments.map((comment) => {
                return {
                  _id: comment._id,
                  likedBy: comment.votes
                    .filter((vote) => {
                      return vote.isLike;
                    })
                    .map((vote) => {
                      return vote.user;
                    }),
                  dislikedBy: comment.votes
                    .filter((vote) => {
                      return !vote.isLike;
                    })
                    .map((vote) => {
                      return vote.user;
                    }),
                  totalVotes: comment.totalVotes,
                  creator: { name: comment.creator.name },
                  text: comment.text,
                  createdAt: comment.createdAt,
                };
              })}
            />
          );
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

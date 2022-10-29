import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import FormMessage from "../../components/FormMessage/FormMessage";
import { IPost } from "../../types/feed";
import { sortAndSetPosts } from "../../utils/feed";

const FeedPage = () => {
  const { posts, setPosts, sortBy, setSortBy } = useContext(PostsContext);
  const { setAddPostVisibility } = useContext(ModalsManipulationContext);
  const [isFlashMessage, setIsFlashMessage] = useState(false);
  const [flashMessageText, setFlashMessageText] = useState("");
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
      });
      const posts = await response.json();
      sortAndSetPosts(posts, setPosts, sortBy);
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (sortBy === "RECENCY") {
      setPosts((posts) => {
        const sortedPosts = JSON.parse(JSON.stringify(posts)).sort(
          (postOne: IPost, postTwo: IPost) => {
            if (postTwo.createdAt > postOne.createdAt) {
              return 1;
            }
            return -1;
          }
        );
        return sortedPosts;
      });
    } else if (sortBy === "VOTES") {
      setPosts((posts) => {
        const sortedPosts = JSON.parse(JSON.stringify(posts)).sort(
          (postOne: IPost, postTwo: IPost) => {
            return postTwo.upvotes - postOne.upvotes;
          }
        );
        return sortedPosts;
      });
    }
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
              isFlashMessage={isFlashMessage}
              setIsFlashMessage={setIsFlashMessage}
              setFlashMessageText={setFlashMessageText}
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

import React, { useContext } from "react";
import { PostsContext } from "../../contexts/PostsContext";
import Button from "../Button/Button";
import styles from "./Post.module.scss";

const Post: React.FC<{
  id: string;
  title: string;
  description: string;
  platform:
    | "YOUTUBE"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "LINKEDIN"
    | "REDDIT"
    | "FACEBOOK"
    | "OTHER";
  upvotes: number;
}> = ({ title, description, platform, upvotes, id }) => {
  const { posts, setPosts } = useContext(PostsContext);
  return (
    <div className={styles.post}>
      <div className={styles.voteContainer}>
        <Button
          color="green"
          className={styles.voteBtn}
          onClick={async () => {
            const response = await fetch(
              `http://localhost:8080/posts/upvote/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postId: id,
                  userId: localStorage.getItem("userId"),
                }),
              }
            );
            if (response.status === 200) {
              const resData = await response.json();
              setPosts(resData.updatedPosts);
            } else {
              //todo
            }
          }}
        >
          +
        </Button>
        <span className={styles.votesQty}>{upvotes}</span>
        <Button
          color="red"
          className={styles.voteBtn}
          onClick={async () => {
            const response = await fetch(
              `http://localhost:8080/posts/downvote/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postId: id,
                  userId: localStorage.getItem("userId"),
                }),
              }
            );
            if (response.status === 200) {
              const resData = await response.json();
              setPosts(resData.updatedPosts);
            } else {
              //todo
            }
          }}
        >
          -
        </Button>
      </div>
      <div className={styles.postInfo}>
        <h2>{title}</h2>
        <hr />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Post;

import React, { useContext, useEffect, useState } from "react";
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
  upvotedBy: string[];
  downvotedBy: string[];
}> = ({
  title,
  description,
  platform,
  upvotes,
  id,
  upvotedBy,
  downvotedBy,
}) => {
  const { setPosts } = useContext(PostsContext);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  useEffect(() => {
    if (upvotedBy.find((userId) => userId === localStorage.getItem("userId"))) {
      setIsUpvoteLocked(true);
    } else {
      setIsUpvoteLocked(false);
    }
    if (
      downvotedBy.find((userId) => userId === localStorage.getItem("userId"))
    ) {
      setIsDownvoteLocked(true);
    } else {
      setIsDownvoteLocked(false);
    }
  }, [upvotedBy, downvotedBy]);
  return (
    <div className={styles.post}>
      <div className={styles.voteContainer}>
        <Button
          color="green"
          className={
            styles.voteBtn + " " + (isUpvoteLocked && styles.greenLocked)
          }
          isLocked={isUpvoteLocked}
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
          isLocked={isDownvoteLocked}
          color="red"
          className={
            styles.voteBtn + " " + (isUpvoteLocked && styles.redLocked)
          }
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

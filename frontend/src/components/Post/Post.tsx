import React from "react";
import Button from "../Button/Button";
import styles from "./Post.module.scss";

const Post: React.FC<{
  title: string;
  description: string;
  platform:
    | "YOUTUBE"
    | "FACEBOOK"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "COURSERA"
    | "OTHER";
  upvotes: number;
}> = ({ title, description, platform, upvotes }) => {
  return (
    <div className={styles.post}>
      <div className={styles.voteContainer}>
        <Button color="green" className={styles.voteBtn}>
          +
        </Button>
        <span className={styles.votesQty}>{upvotes}</span>
        <Button color="red" className={styles.voteBtn}>
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

import React, { useContext } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import { PostsContext } from "../../contexts/PostsContext";
import { sortAndSetPosts } from "../../utils/feed";
import styles from "./Comment.module.scss";

const Comment: React.FC<{
  comment: {
    _id: string;
    likedBy: string[];
    dislikedBy: string[];
    totalVotes: number;
    creator: { name: string };
    text: string;
  };
}> = ({ comment }) => {
  const { setPosts, sortBy } = useContext(PostsContext);
  return (
    <div className={styles.comment}>
      <div className={styles.commentContent}>
        <BsFillCircleFill size="30.8" />
        <div className={styles.commentInfo}>
          <div className={styles.commentAuthor}>{comment.creator.name}</div>
          <div className={styles.commentText}>{comment.text}</div>
        </div>
      </div>
      <div className={styles.votesContainer}>
        <div className={styles.commentVotes}>
          {comment.likedBy.length}{" "}
          <AiFillLike
            color={
              comment.likedBy.find((userId) => {
                return userId === localStorage.getItem("userId");
              })
                ? "black"
                : "lightgray"
            }
            className={styles.voteLogo}
            onClick={async () => {
              const res = await fetch(
                `http://localhost:8080/comments/${comment._id}/like`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              if (res.status === 200) {
                const resData = await res.json();
                sortAndSetPosts(resData.updatedPosts, setPosts, sortBy);
              } else {
                //todo
              }
            }}
          />
        </div>
        <div className={styles.commentVotes}>
          {comment.dislikedBy.length}{" "}
          <AiFillDislike
            color={
              comment.dislikedBy.find((userId) => {
                return userId === localStorage.getItem("userId");
              })
                ? "black"
                : "lightgray"
            }
            className={styles.voteLogo}
            onClick={async () => {
              const res = await fetch(
                `http://localhost:8080/comments/${comment._id}/dislike`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              if (res.status === 200) {
                const resData = await res.json();
                sortAndSetPosts(resData.updatedPosts, setPosts, sortBy);
              } else {
                //todo
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;

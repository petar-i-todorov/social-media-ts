import React, { useContext, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import { PostsContext } from "../../contexts/PostsContext";
import { sortAndSetPosts } from "../../utils/feed";
import styles from "./Comment.module.scss";
import ReactTimeAgo from "react-time-ago";
import { FaUserCircle } from "react-icons/fa";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { IComment } from "../../types/feed";

const Comment: React.FC<{
  comment: IComment;
}> = ({ comment }) => {
  const [commentObj, setCommentObj] = useState<IComment>(comment);
  const { setPosts, sortBy, devRole } = useContext(PostsContext);
  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    useContext(FlashMessageContext);
  return (
    <div className={styles.comment}>
      <div className={styles.commentContent}>
        <FaUserCircle size="30.8" />
        <div className={styles.commentInfo}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {commentObj.creator.name}
            </span>
            <BsFillCircleFill size="5" color="gray" />{" "}
            <ReactTimeAgo date={new Date(commentObj.createdAt)} />
          </div>
          <div className={styles.commentText}>{commentObj.text}</div>
        </div>
      </div>
      <div className={styles.votesContainer}>
        <div className={styles.commentVotes}>
          {
            commentObj.votes
              .filter((vote) => {
                return vote.isLike;
              })
              .map((vote) => {
                return vote.user;
              }).length
          }{" "}
          <AiFillLike
            className={
              styles.voteLogo +
              " " +
              (commentObj.votes
                .filter((vote) => {
                  return vote.isLike;
                })
                .map((vote) => {
                  return vote.user;
                })
                .find((userId) => {
                  return userId === localStorage.getItem("userId");
                })
                ? styles.pressed
                : styles.nonPressed)
            }
            onClick={async () => {
              const res = await fetch(
                `http://localhost:8080/comments/${commentObj._id}/like`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              if (res.status === 200) {
                const resData = await res.json();
                console.log(resData.updatedComment);
                setCommentObj(resData.updatedComment);
              } else {
                setIsFeedFlashMessage(true);
                setFeedFlashMessageConfiguration({
                  text: "Something went wrong. Please, try again later.",
                  color: "red",
                });
                setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
              }
            }}
          />
        </div>
        <div className={styles.commentVotes}>
          {
            commentObj.votes
              .filter((vote) => {
                return !vote.isLike;
              })
              .map((vote) => {
                return vote.user;
              }).length
          }{" "}
          <AiFillDislike
            className={
              styles.voteLogo +
              " " +
              (commentObj.votes
                .filter((vote) => {
                  return !vote.isLike;
                })
                .map((vote) => {
                  return vote.user;
                })
                .find((userId) => {
                  return userId === localStorage.getItem("userId");
                })
                ? styles.pressed
                : styles.nonPressed)
            }
            onClick={async () => {
              const res = await fetch(
                `http://localhost:8080/comments/${commentObj._id}/dislike`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              if (res.status === 200) {
                const resData = await res.json();
                setCommentObj(resData.updatedComment);
              } else {
                setIsFeedFlashMessage(true);
                setFeedFlashMessageConfiguration({
                  text: "Something went wrong. Please, try again later.",
                  color: "red",
                });
                setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;

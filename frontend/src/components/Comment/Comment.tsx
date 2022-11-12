import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";

import styles from "./Comment.module.scss";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { IComment } from "../../types/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";

const Comment: React.FC<{
  comment: IComment;
}> = ({ comment }) => {
  const [commentObj, setCommentObj] = useState<IComment>(comment);

  const {
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    activeFlashTimeout,
    setActiveFlashTimeout,
  } = useContext(FlashMessageContext);

  const { isDarkMode } = useContext(SwitchThemeContext);

  useEffect(() => {
    setCommentObj(comment);
  }, [comment]);

  const avatar = useMemo(() => {
    return commentObj.creator.avatarUrl ? (
      <img
        className={styles.userAvatar}
        width="30.8"
        height="30.8"
        src={`http://localhost:8080/${commentObj.creator.avatarUrl}`}
        alt="avatar"
      />
    ) : (
      <FaUserCircle size="30.8" />
    );
  }, [commentObj.creator.avatarUrl]);

  const userUrl = `/user/${commentObj.creator._id}`;

  const onLikeClickHandler = async () => {
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
      setCommentObj(resData.updatedComment);
    } else {
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration({
        text: "Something went wrong. Please, try again later.",
        color: "red",
      });
      clearTimeout(activeFlashTimeout);
      const timeout = setTimeout(() => {
        setIsFeedFlashMessage(false);
      }, 5000);
      setActiveFlashTimeout(timeout);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.commentContent}>
        <Link to={userUrl}>{avatar}</Link>
        <div
          className={`${styles.commentInfo} ${isDarkMode && styles.darkMode}`}
        >
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {commentObj.creator.name}{" "}
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
            onClick={onLikeClickHandler}
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
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;

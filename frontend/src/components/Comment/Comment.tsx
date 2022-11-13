import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillCircleFill } from "react-icons/bs";
import ReactTimeAgo from "react-time-ago";

import styles from "./Comment.module.scss";
import { IComment } from "../../types/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import Avatar from "../Avatar/Avatar";
import CommentVote from "../CommentVote/CommentVote";

const useComment = (comment: IComment) => {
  const [commentObj, setCommentObj] = useState<IComment>(comment);

  useEffect(() => {
    setCommentObj(comment);
  }, [comment]);

  const likesQty = useMemo(() => {
    return commentObj.votes
      .filter((vote) => {
        return vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      }).length;
  }, [commentObj.votes]);

  const dislikesQty = useMemo(() => {
    return commentObj.votes
      .filter((vote) => {
        return !vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      }).length;
  }, [commentObj.votes]);

  const isLikePressed = useMemo(() => {
    return !!commentObj.votes
      .filter((vote) => {
        return vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      })
      .find((userId) => {
        return userId === localStorage.getItem("userId");
      });
  }, [commentObj.votes]);

  const isDislikePressed = useMemo(() => {
    return !!commentObj.votes
      .filter((vote) => {
        return !vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      })
      .find((userId) => {
        return userId === localStorage.getItem("userId");
      });
  }, [commentObj.votes]);

  return {
    commentObj,
    setCommentObj,
    isLikePressed,
    likesQty,
    isDislikePressed,
    dislikesQty,
  };
};

const Comment: React.FC<{
  comment: IComment;
}> = ({ comment }) => {
  const {
    commentObj,
    setCommentObj,
    likesQty,
    dislikesQty,
    isLikePressed,
    isDislikePressed,
  } = useComment(comment);

  const { isDarkMode } = useContext(SwitchThemeContext);

  return (
    <div className={styles.container}>
      <div className={styles.commentContent}>
        <Link to={`/user/${commentObj.creator._id}`}>
          <Avatar size={30.8} url={commentObj.creator.avatarUrl} />
        </Link>
        <div
          className={`${styles.commentInfo} ${isDarkMode && styles.darkMode}`}
        >
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {`${commentObj.creator.name} `}
            </span>
            <BsFillCircleFill size="5" color="gray" />{" "}
            <ReactTimeAgo date={new Date(commentObj.createdAt)} />
          </div>
          <div className={styles.commentText}>{commentObj.text}</div>
        </div>
      </div>
      <div className={styles.votesContainer}>
        <CommentVote
          commentId={commentObj._id}
          setComment={setCommentObj}
          type={"like"}
          quantity={likesQty}
          isPressed={!!isLikePressed}
        />
        <CommentVote
          commentId={commentObj._id}
          setComment={setCommentObj}
          type={"dislike"}
          quantity={dislikesQty}
          isPressed={!!isDislikePressed}
        />
      </div>
    </div>
  );
};

export default Comment;

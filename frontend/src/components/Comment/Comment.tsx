import React from "react";
import { BsFillCircleFill } from "react-icons/bs";
import ReactTimeAgo from "react-time-ago";
import styles from "./Comment.module.scss";
import { CommentType } from "../../types/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import Avatar from "../Avatar/Avatar";
import CommentVotes from "../CommentVotes/CommentVotes";

const Comment: React.FC<{
  comment: CommentType;
}> = ({ comment }) => {
  const [commentState, setCommentState] = React.useState(comment);

  const { isDarkMode } = React.useContext(SwitchThemeContext);

  const commentVotesProps = {
    comment: commentState,
    setComment: setCommentState,
  };

  return (
    <div className={styles.container}>
      <div className={styles.commentContent}>
        <Avatar
          size={30.8}
          url={commentState.creator.avatarUrl}
          linkTo={`/user/${commentState.creator._id}`}
        />
        <div
          className={`${styles.commentInfo} ${isDarkMode && styles.darkMode}`}
        >
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {`${commentState.creator.name} `}
            </span>
            <BsFillCircleFill size="5" color="gray" />{" "}
            <ReactTimeAgo date={new Date(commentState.createdAt)} />
          </div>
          <div className={styles.commentText}>{commentState.text}</div>
        </div>
      </div>
      <div className={styles.votesContainer}>
        <CommentVotes {...commentVotesProps} type="like" />
        <CommentVotes {...commentVotesProps} type="dislike" />
      </div>
    </div>
  );
};

export default Comment;

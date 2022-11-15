import React from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { defaultFlashMessageConfig } from "../../constants/feed";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { CommentType } from "../../types/feed";
import { voteComment } from "../../api/comments";
import styles from "./CommentVotes.module.scss";

const useCommentVotes = ({
  type,
  comment,
}: {
  type: "like" | "dislike";
  comment: CommentType;
}) => {
  const quantity = React.useMemo(() => {
    if (type === "like") {
      return comment.votes
        .filter((vote) => {
          return vote.isLike;
        })
        .map((vote) => {
          return vote.user;
        }).length;
    }
    return comment.votes
      .filter((vote) => {
        return !vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      }).length;
  }, [comment.votes, type]);

  const isIconPressed = React.useMemo(() => {
    if (type === "like") {
      return !!comment.votes
        .filter((vote) => {
          return vote.isLike;
        })
        .map((vote) => {
          return vote.user;
        })
        .find((userId) => {
          return userId === localStorage.getItem("userId");
        });
    }
    return !!comment.votes
      .filter((vote) => {
        return !vote.isLike;
      })
      .map((vote) => {
        return vote.user;
      })
      .find((userId) => {
        return userId === localStorage.getItem("userId");
      });
  }, [comment.votes, type]);

  return { quantity, isIconPressed };
};

type VoteType = "like" | "dislike";

interface CommentVotesProps {
  comment: CommentType;
  setComment: React.Dispatch<React.SetStateAction<CommentType>>;
  type: VoteType;
}

const CommentVotes: React.FC<CommentVotesProps> = ({
  comment,
  setComment,
  type,
}) => {
  const { setIsFeedFlashMessage, setFeedFlashMessageConfiguration } =
    React.useContext(FlashMessageContext);

  const { quantity, isIconPressed } = useCommentVotes({ comment, type });

  const onVoteClickHandler = async (type: VoteType) => {
    const res = await voteComment({ id: comment._id, type });
    if (res.status === 200) {
      const resData = await res.json();
      setComment(resData.updatedComment);
    } else {
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
    }
  };

  return (
    <div className={styles.commentVotes}>
      {`${quantity} `}
      {type === "like" ? (
        <AiFillLike
          className={`${styles.voteLogo} ${
            isIconPressed ? styles.pressed : styles.nonPressed
          }`}
          onClick={() => {
            onVoteClickHandler("like");
          }}
        />
      ) : (
        <AiFillDislike
          className={`${styles.voteLogo} ${
            isIconPressed ? styles.pressed : styles.nonPressed
          }`}
          onClick={() => {
            onVoteClickHandler("dislike");
          }}
        />
      )}
    </div>
  );
};

export default CommentVotes;

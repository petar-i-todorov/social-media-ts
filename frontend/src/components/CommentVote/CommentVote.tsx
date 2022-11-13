import { useContext, FC, Dispatch, SetStateAction } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { IComment } from "../../types/feed";
import { voteComment } from "../Comment/utils";
import styles from "./CommentVote.module.scss";

type VoteType = "like" | "dislike";

interface CommentVoteProps {
  commentId: string;
  setComment: Dispatch<SetStateAction<IComment>>;
  type: VoteType;
  quantity: number;
  isPressed: boolean;
}

const CommentVote: FC<CommentVoteProps> = ({
  commentId,
  setComment,
  type,
  quantity,
  isPressed,
}) => {
  const { setIsFeedFlashMessage, setFeedFlashMessageConfiguration } =
    useContext(FlashMessageContext);

  const onVoteClickHandler = async (type: VoteType) => {
    const res = await voteComment(commentId, type);
    if (res.status === 200) {
      const resData = await res.json();
      setComment(resData.updatedComment);
    } else {
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration({
        text: "Something went wrong. Please, try again later.",
        color: "red",
      });
    }
  };

  return (
    <div className={styles.commentVotes}>
      {`${quantity} `}
      {type === "like" ? (
        <AiFillLike
          className={`${styles.voteLogo} ${
            isPressed ? styles.pressed : styles.nonPressed
          }`}
          onClick={() => {
            onVoteClickHandler("like");
          }}
        />
      ) : (
        <AiFillDislike
          className={`${styles.voteLogo} ${
            isPressed ? styles.pressed : styles.nonPressed
          }`}
          onClick={() => {
            onVoteClickHandler("dislike");
          }}
        />
      )}
    </div>
  );
};

export default CommentVote;

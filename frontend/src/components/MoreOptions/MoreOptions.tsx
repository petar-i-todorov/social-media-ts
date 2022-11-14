import { Dispatch, FC, SetStateAction } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IPost } from "../../types/feed";
import MoreOptionsMenu from "../MoreOptionsMenu/MoreOptionsMenu";
import styles from "./MoreOptions.module.scss";

interface MoreOptionsProps {
  moreOptionsVisibility: boolean;
  setMoreOptionsVisibility: Dispatch<SetStateAction<boolean>>;
  post: IPost;
}

const MoreOptions: FC<MoreOptionsProps> = ({
  moreOptionsVisibility,
  setMoreOptionsVisibility,
  post,
}) => {
  return (
    <div className={styles.moreOptionsContainer}>
      <BsThreeDots
        size="30"
        color="gray"
        className={styles.threeDots}
        onClick={(event) => {
          event.stopPropagation();
          if (!moreOptionsVisibility) {
            setMoreOptionsVisibility(true);
          } else {
            setMoreOptionsVisibility(false);
          }
        }}
      />
      {moreOptionsVisibility && (
        <MoreOptionsMenu
          isAuthor={post.creator._id === localStorage.getItem("userId")}
          postId={post._id}
          sourceUrl={post.url}
        />
      )}
    </div>
  );
};

export default MoreOptions;

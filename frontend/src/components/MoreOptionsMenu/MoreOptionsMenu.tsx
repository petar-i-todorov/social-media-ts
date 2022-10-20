import styles from "./MoreOptionsMenu.module.scss";
import { MdDelete } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { useContext } from "react";
import { PostIdContext } from "../../contexts/PostIdContext";
import { DeletePostContext } from "../../contexts/DeletePostContext";

const MoreOptionsMenu: React.FC<{ isAuthor: boolean; postId: string }> = ({
  isAuthor,
  postId,
}) => {
  const { setPostId } = useContext(PostIdContext);
  const { setDeletePost } = useContext(DeletePostContext);
  return (
    <div className={styles.moreOptionsMenu}>
      <span className={styles.option}>
        <span>Report</span> <MdReportProblem size="20px" color="orange" />
      </span>
      {isAuthor && (
        <>
          <hr />
          <span className={styles.option}>
            <span
              className={styles.option}
              onClick={(event) => {
                event.preventDefault();
                setPostId(postId);
                setDeletePost(true);
              }}
            >
              Delete
              <MdDelete size="20px" color="gray" />
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default MoreOptionsMenu;

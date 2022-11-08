import styles from "./MoreOptionsMenu.module.scss";
import { MdDelete } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { useContext } from "react";
import { PostIdContext } from "../../contexts/PostIdContext";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { FiEdit } from "react-icons/fi";

const MoreOptionsMenu: React.FC<{
  isAuthor: boolean;
  postId: string;
}> = ({ isAuthor, postId }) => {
  const { setPostId } = useContext(PostIdContext);
  const {
    setDeletePostVisibility,
    setReportPostVisibility,
    setEditPostVisibility,
  } = useContext(ModalsManipulationContext);
  return (
    <div
      className={styles.moreOptionsMenu}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div
        className={styles.option}
        onClick={(event) => {
          event.preventDefault();
          setPostId(postId);
          setReportPostVisibility(true);
        }}
      >
        <span>Report</span> <MdReportProblem size="20px" color="orange" />
      </div>
      {isAuthor && (
        <>
          <div className={styles.option}>
            <span
              className={styles.option}
              onClick={(event) => {
                event.preventDefault();
                setPostId(postId);
                setDeletePostVisibility(true);
              }}
            >
              Delete
              <MdDelete size="20px" color="gray" />
            </span>
          </div>
          <div className={styles.option}>
            <span
              className={styles.option}
              onClick={(event) => {
                event.preventDefault();
                setPostId(postId);
                setEditPostVisibility(true);
              }}
            >
              Edit
              <FiEdit size="18px" color="black" />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MoreOptionsMenu;

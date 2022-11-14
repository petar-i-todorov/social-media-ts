import { FC, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoOpenOutline } from "react-icons/io5";
import styles from "./MoreOptionsMenu.module.scss";
import { PostIdContext } from "../../contexts/PostIdContext";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";

interface MoreOptionsMenuProps {
  isAuthor: boolean;
  postId: string;
  sourceUrl: string;
}

const MoreOptionsMenu: FC<MoreOptionsMenuProps> = ({
  isAuthor,
  postId,
  sourceUrl,
}) => {
  const { setPostId } = useContext(PostIdContext);
  const {
    setDeletePostVisibility,
    setReportPostVisibility,
    setEditPostVisibility,
  } = useContext(ModalsManipulationContext);
  const { isDarkMode } = useContext(SwitchThemeContext);

  return (
    <div
      className={`${styles.moreOptionsMenu} ${isDarkMode && styles.darkMode}`}
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
      <a href={sourceUrl} target="_blank" rel="noreferrer">
        <div className={styles.option}>
          <span className={isDarkMode ? styles.darkMode : undefined}>Open</span>{" "}
          <IoOpenOutline
            size="20px"
            className={(isDarkMode && styles.darkMode) || undefined}
          />
        </div>
      </a>
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
              <FiEdit size="18px" color={isDarkMode ? "smokewhite" : "black"} />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MoreOptionsMenu;

import styles from "./MoreOptionsMenu.module.scss";
import { MdDelete } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";

const MoreOptionsMenu = () => {
  return (
    <div className={styles.moreOptionsMenu}>
      <span className={styles.option}>
        Delete
        <MdDelete size="20px" color="gray" />
      </span>
      <hr />
      <span className={styles.option}>
        <span>Report</span> <MdReportProblem size="20px" color="orange" />
      </span>
    </div>
  );
};

export default MoreOptionsMenu;

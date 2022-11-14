import { GiRoundStar } from "react-icons/gi";
import { Link } from "react-router-dom";
import styles from "./AppLogo.module.scss";

const Logo = () => {
  return (
    <Link to="">
      <span className={styles.appLogo}>
        <GiRoundStar size="30" />
        <span className={styles.logoText}>-the-source</span>
      </span>
    </Link>
  );
};

export default Logo;

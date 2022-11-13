import { FC } from "react";
import { FaUserCircle } from "react-icons/fa";

import styles from "./Avatar.module.scss";

const Avatar: FC<{ url: string | undefined; size: number }> = ({
  url,
  size,
}) => {
  return url ? (
    <img
      className={styles.userAvatar}
      width={size}
      height={size}
      src={`http://localhost:8080/${url}`}
      alt="avatar"
    />
  ) : (
    <FaUserCircle size={size} />
  );
};

export default Avatar;

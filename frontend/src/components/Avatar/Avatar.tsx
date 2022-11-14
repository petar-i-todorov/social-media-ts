import { FC } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  url: string | undefined;
  size: number;
  linkTo: string;
}

const Avatar: FC<AvatarProps> = ({ url, size, linkTo }) => {
  return (
    <Link to={linkTo}>
      {url ? (
        <img
          className={styles.userAvatar}
          width={size}
          height={size}
          src={`http://localhost:8080/${url}`}
          alt="avatar"
        />
      ) : (
        <FaUserCircle size={size} />
      )}
    </Link>
  );
};

export default Avatar;

import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  className?: string;
  linkTo: string;
  size: number;
  url: string | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ url, size, linkTo, className }) => {
  return (
    <Link to={linkTo}>
      {url ? (
        <img
          className={`${styles.userAvatar} ${className}`}
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

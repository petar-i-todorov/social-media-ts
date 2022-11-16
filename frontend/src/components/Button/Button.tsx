import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  color: "blue" | "green" | "red";
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  isLocked?: boolean;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  className,
  color,
  type,
  isLocked,
  onClick,
  children,
}) => {
  const colorStyle = (() => {
    switch (color) {
      case "blue":
        return styles.blue;
      case "green":
        return styles.green;
      default:
        return styles.red;
    }
  })();

  return (
    <button
      type={type}
      className={`${styles.btn} ${colorStyle} ${className} ${
        isLocked && styles.locked
      }`}
      onClick={(event) => {
        event.preventDefault();
        onClick && onClick(event);
      }}
    >
      {children}
    </button>
  );
};

export default Button;

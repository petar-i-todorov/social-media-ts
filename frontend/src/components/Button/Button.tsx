import React, { MouseEventHandler } from "react";
import styles from "./Button.module.scss";

const Button: React.FC<{
  color: "blue" | "green" | "red";
  children: string | JSX.Element;
  onClick?: MouseEventHandler;
  type?: "submit";
  className?: string;
}> = ({ children, color, type, onClick, className }) => {
  const styleColor =
    color === "blue"
      ? styles.blue
      : color === "green"
      ? styles.green
      : styles.red;
  return (
    <button
      type={type}
      className={styles.btn + " " + styleColor + " " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

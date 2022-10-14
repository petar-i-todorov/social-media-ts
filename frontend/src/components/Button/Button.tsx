import React, { MouseEventHandler } from "react";
import styles from "./Button.module.scss";

const Button: React.FC<{
  color: "blue" | "green";
  children: string | JSX.Element;
  onClick?: MouseEventHandler;
  type?: "submit";
}> = ({ children, color, type, onClick }) => {
  const styleColor = color === "blue" ? styles.blue : styles.green;
  return (
    <button
      type={type}
      className={styles.btn + " " + styleColor}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

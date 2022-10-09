import React from "react";
import styles from "./Button.module.scss";

const Button: React.FC<{
  color: "blue" | "green";
  children: string | JSX.Element;
  onClick?: (event: MouseEvent) => void;
  type?: "submit";
}> = ({ children, color, type }) => {
  const styleColor = color === "blue" ? styles.blue : styles.green;
  return (
    <button type={type} className={styles.btn + " " + styleColor}>
      {children}
    </button>
  );
};

export default Button;

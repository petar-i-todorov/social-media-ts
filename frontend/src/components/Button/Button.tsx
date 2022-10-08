import React from "react";
import styles from "./Button.module.scss";

const Button: React.FC<{
  color: "blue" | "green";
  children: string | JSX.Element;
}> = ({ children, color }) => {
  const styleColor = color === "blue" ? styles.blue : styles.green;
  return <button className={styles.btn + " " + styleColor}>{children}</button>;
};

export default Button;

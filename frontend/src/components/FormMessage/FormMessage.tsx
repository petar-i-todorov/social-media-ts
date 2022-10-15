import React from "react";
import styles from "./FormMessage.module.scss";

const FormMessage: React.FC<{ children: string; color: "green" | "red" }> = ({
  children,
  color,
}) => {
  const messageColor = color === "green" ? styles.green : styles.red;
  return (
    <div className={styles.formMessage + " " + messageColor}>{children}</div>
  );
};

export default FormMessage;

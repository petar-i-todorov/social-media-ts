import React from "react";
import styles from "./FormMessage.module.scss";

const FormMessage: React.FC<{
  children: string;
  color: "green" | "red";
  flash?: boolean;
}> = ({ children, color, flash }) => {
  const messageColor = color === "green" ? styles.green : styles.red;
  return (
    <div
      className={
        styles.formMessage +
        " " +
        messageColor +
        " " +
        (flash ? styles.flash : "")
      }
    >
      {children}
    </div>
  );
};

export default FormMessage;

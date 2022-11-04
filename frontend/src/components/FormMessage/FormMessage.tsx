import React from "react";
import styles from "./FormMessage.module.scss";

const FormMessage: React.FC<{
  children: string;
  color: "green" | "red";
  flash?: boolean;
  flashVisibility?: boolean;
}> = ({ children, color, flash, flashVisibility }) => {
  const messageColor = color === "green" ? styles.green : styles.red;
  return (
    <div
      className={
        styles.formMessage +
        " " +
        messageColor +
        " " +
        (flash
          ? styles.flash + " " + (flashVisibility ? styles.flashVisible : null)
          : null)
      }
    >
      {children}
    </div>
  );
};

export default FormMessage;

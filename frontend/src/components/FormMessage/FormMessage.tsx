import React, { PropsWithChildren } from "react";
import styles from "./FormMessage.module.scss";

interface FormMessageProps {
  color: "green" | "red";
  flash?: boolean;
  flashVisibility?: boolean;
}

const FormMessage: React.FC<PropsWithChildren<FormMessageProps>> = ({
  children,
  color,
  flash,
  flashVisibility,
}) => {
  return (
    <div
      className={`${styles.formMessage} ${
        color === "green" ? styles.green : styles.red
      } ${flash && styles.flash}  ${flashVisibility && styles.flashVisible}`}
    >
      {children}
    </div>
  );
};

export default FormMessage;

import React from "react";
import styles from "./InputError.module.scss";

const InputError: React.FC<{ error: string; position: "left" | "right" }> = ({
  error,
  position,
}) => {
  return (
    <div
      className={
        styles.validationError + " " + position === "left"
          ? styles.left
          : styles.right
      }
    >
      {error}
    </div>
  );
};

export default InputError;

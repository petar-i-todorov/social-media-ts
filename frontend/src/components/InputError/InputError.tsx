import React from "react";
import styles from "./InputError.module.scss";

const InputError: React.FC<{ error: string; position: "left" | "right" }> = ({
  error,
  position,
}) => {
  const positionStyle = position === "left" ? styles.left : styles.right;
  return (
    <div className={styles.validationError + " " + positionStyle}>{error}</div>
  );
};

export default InputError;

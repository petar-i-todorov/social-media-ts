import React from "react";

import styles from "./InputError.module.scss";

const InputError: React.FC<{
  error: string;
  position: "left" | "right";
  className?: string;
}> = ({ error, position, className }) => {
  const positionStyle = position === "left" ? styles.left : styles.right;
  return (
    <div
      className={styles.validationError + " " + positionStyle + " " + className}
    >
      {error}
    </div>
  );
};

export default InputError;

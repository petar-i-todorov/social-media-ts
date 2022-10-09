import React from "react";
import styles from "./Input.module.scss";

const Input: React.FC<{
  type: string;
  placeholder: string;
  split?: boolean;
}> = ({ type, placeholder, split }) => {
  const css = split ? `${styles.input} ${styles.split}` : styles.input;
  return <input type={type} placeholder={placeholder} className={css} />;
};

export default Input;

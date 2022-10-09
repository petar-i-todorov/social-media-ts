import React, { ChangeEvent } from "react";
import styles from "./Input.module.scss";

const Input: React.FC<{
  type: string;
  placeholder: string;
  split?: boolean;
  onChange?: (e: ChangeEvent) => void;
  value?: string;
}> = ({ type, placeholder, split, onChange, value }) => {
  const css = split ? `${styles.input} ${styles.split}` : styles.input;
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className={css}
    />
  );
};

export default Input;

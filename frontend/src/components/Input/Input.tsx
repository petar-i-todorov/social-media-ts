import React, { ChangeEvent, useState } from "react";
import styles from "./Input.module.scss";

const Input: React.FC<{
  type: string;
  placeholder: string;
  split?: boolean;
  onChange: (e: ChangeEvent) => void;
  value?: string;
  onBlur?: () => void;
  valid?: boolean;
}> = ({ type, placeholder, split, onChange, value, onBlur, valid }) => {
  let css = split ? `${styles.input} ${styles.split}` : styles.input;
  css = !valid ? `${css} ${styles.invalid}` : css;
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className={css}
      onBlur={onBlur}
    />
  );
};

export default Input;

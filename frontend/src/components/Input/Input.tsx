import React, { ChangeEvent, useState } from "react";
import styles from "./Input.module.scss";
import { RiErrorWarningLine } from "react-icons/ri";
import InputError from "../InputError/InputError";

const Input: React.FC<{
  errorPosition?: "left" | "right";
  type: string;
  placeholder: string;
  split?: boolean;
  onChange: (e: ChangeEvent) => void;
  value?: string;
  onBlur?: () => void;
  valid?: boolean;
  errorMessage?: string;
}> = ({
  type,
  placeholder,
  split,
  onChange,
  value,
  onBlur,
  valid,
  errorPosition,
  errorMessage,
}) => {
  const [isError, setIsError] = useState(false);
  return (
    <div
      className={
        split
          ? `${styles.split} ${styles.inputContainer}`
          : styles.inputContainer
      }
    >
      {!valid ? (
        <span
          onClick={() => {
            if (isError) {
              setIsError(false);
            } else {
              setIsError(true);
            }
          }}
          className={split ? styles.warningSplit : styles.warning}
        >
          <RiErrorWarningLine color="red" />
        </span>
      ) : (
        ""
      )}
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={!valid ? `${styles.invalid} ${styles.input}` : styles.input}
        onBlur={onBlur}
      />
      {isError && (
        <InputError
          error={errorMessage || ""}
          position={errorPosition || "left"}
        ></InputError>
      )}
    </div>
  );
};

export default Input;

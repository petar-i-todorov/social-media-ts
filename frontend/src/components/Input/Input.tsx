import React, { ChangeEvent, useEffect, useState } from "react";
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
  errorMessage?: string;
  isError?: boolean;
  setIsError?: (arg: boolean) => void;
  setErrorMessage?: (arg: string) => void;
}> = ({
  type,
  placeholder,
  split,
  onChange,
  value,
  onBlur,
  errorPosition,
  errorMessage,
  isError,
  setIsError,
  setErrorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    if (errorMessage) {
      setIsValid(false);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (isFocused && setIsError) {
      setIsValid(true);
    }
  }, [isFocused]);
  let style = !isValid ? `${styles.invalid} ${styles.input}` : styles.input;
  style = isFocused ? `${style} ${styles.focused}` : style;
  return (
    <div
      className={
        split
          ? `${styles.split} ${styles.inputContainer}`
          : styles.inputContainer
      }
    >
      {!isValid ? (
        <span
          onClick={() => {
            if (isError) {
              if (setIsError) {
                setIsError(false);
              }
            } else {
              if (setIsError) {
                setIsError(true);
              }
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
        onChange={(event) => {
          onChange(event);
          if (isFocused) {
            setIsValid(true);
            if (setErrorMessage) {
              setErrorMessage("");
            }
          }
        }}
        type={type}
        placeholder={placeholder}
        className={style}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          }
          setIsFocused(false);
        }}
        onFocus={() => {
          setIsFocused(true);
          if (setErrorMessage) {
            setErrorMessage("");
          }
          if (setIsError) {
            setIsError(false);
          }
        }}
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

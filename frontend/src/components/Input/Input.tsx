import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./Input.module.scss";
import { RiErrorWarningLine } from "react-icons/ri";
import InputError from "../InputError/InputError";

const Input: React.FC<{
  id: string;
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
  id,
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
  const [isActive, setIsActive] = useState(false); //if focused or value !== ""
  useEffect(() => {
    if (errorMessage) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (isFocused && setIsError) {
      setIsValid(true);
    }
  }, [isFocused]);
  useEffect(() => {
    if (isFocused || value !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isFocused, value]);
  let style = !isValid ? `${styles.invalid} ${styles.input}` : styles.input;
  style = isFocused ? `${style} ${styles.focusedInput}` : style;
  return (
    <div className={styles.containerColumn}>
      <label htmlFor={id} className={isActive ? styles.focusedPlaceholder : ""}>
        {placeholder}
      </label>
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
            className={
              split
                ? styles.warningIconSplitInput
                : styles.warningIconDefaultInput
            }
          >
            <RiErrorWarningLine color="red" />
          </span>
        ) : (
          ""
        )}
        <input
          id={id}
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
    </div>
  );
};

export default Input;

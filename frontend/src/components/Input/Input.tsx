import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./Input.module.scss";
import { RiErrorWarningLine } from "react-icons/ri";
import InputError from "../InputError/InputError";

const Input: React.FC<{
  id: string;
  type: string;
  placeholder: string;
  split?: boolean;
  value: string;
  errorPosition?: "left" | "right";
  isValid: boolean;
  setIsValid?: (arg: boolean) => void;
  errorMessage?: string;
  setErrorMessage?: (arg: string) => void;
  isErrorMessageVisible?: boolean;
  setIsErrorMessageVisible?: (arg: boolean) => void;
  onChange: (e: ChangeEvent) => void;
  onBlur?: () => void;
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
  isErrorMessageVisible,
  setIsErrorMessageVisible,
  setErrorMessage,
  isValid, //css invalid input responsible
  setIsValid,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false); //if focused or value !== ""; placeholder animation responsible
  useEffect(() => {
    if (isFocused && setIsValid) {
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
  return (
    <div className={styles.mainContainer}>
      <label htmlFor={id} className={isActive ? styles.active : ""}>
        {placeholder}
      </label>
      <div className={styles.inputContainer}>
        {!isValid ? (
          <span
            onClick={() => {
              if (isErrorMessageVisible) {
                if (setIsErrorMessageVisible) {
                  setIsErrorMessageVisible(false);
                }
              } else {
                if (setIsErrorMessageVisible) {
                  setIsErrorMessageVisible(true);
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
              if (setIsValid) {
                setIsValid(true);
              }
              if (setErrorMessage) {
                setErrorMessage("");
              }
            }
          }}
          type={type}
          className={`${styles.input} ${!isValid && styles.invalid} ${
            isFocused && styles.focused
          }`}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (setErrorMessage) {
              if (setIsValid) {
                setIsValid(true);
              }
            }
            if (setIsErrorMessageVisible) {
              setIsErrorMessageVisible(false);
            }
          }}
        />
        {isErrorMessageVisible && (
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

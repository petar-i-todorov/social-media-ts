import styles from "./TextArea.module.scss";
import { RiErrorWarningLine } from "react-icons/ri";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import InputError from "../InputError/InputError";

const TextArea: React.FC<{
  id?: string;
  label: string;
  value?: string;
  isValid: boolean;
  setIsValid?: (arg: boolean) => void;
  errorMessage?: string;
  setErrorMessage?: (arg: string) => void;
  isErrorMessageVisible?: boolean;
  setIsErrorMessageVisible?: (arg: boolean) => void;
  onChange?: (e: ChangeEvent) => void;
  onBlur?: () => void;
  onClick?: MouseEventHandler;
  className?: string;
}> = ({
  value,
  id,
  label,
  onChange,
  onBlur,
  errorMessage,
  isErrorMessageVisible,
  setIsErrorMessageVisible,
  setErrorMessage,
  isValid, //css invalid input responsible
  setIsValid,
  onClick,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (isFocused && setIsValid) {
      setIsValid(true);
    }
  }, [isFocused, setIsValid]);
  return (
    <div className={styles.textAreaContainer}>
      <label htmlFor={id}>{label}</label>
      <div
        className={
          styles.pseudoTextarea +
          " " +
          (!isValid && styles.invalid) +
          " " +
          (isFocused && styles.focused)
        }
      >
        <textarea
          onClick={onClick}
          value={value}
          id={id}
          onChange={(event) => {
            if (onChange) {
              onChange(event);
            }
            if (isFocused) {
              if (setIsValid) {
                setIsValid(true);
              }
              if (setErrorMessage) {
                setErrorMessage("");
              }
            }
          }}
          className={styles.textarea + " " + className}
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
            position="right"
            className={styles.textareaError}
          ></InputError>
        )}
        {!isValid && (
          <RiErrorWarningLine
            color="red"
            size="23"
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
          />
        )}
      </div>
    </div>
  );
};

export default TextArea;

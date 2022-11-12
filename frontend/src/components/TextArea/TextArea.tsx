import {
  ChangeEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { RiErrorWarningLine } from "react-icons/ri";

import styles from "./TextArea.module.scss";
import InputError from "../InputError/InputError";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";

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
  const { isDarkMode } = useContext(SwitchThemeContext);
  useEffect(() => {
    if (isFocused && setIsValid) {
      setIsValid(true);
    }
  }, [isFocused]);
  return (
    <div className={styles.textAreaContainer}>
      <label htmlFor={id}>{label}</label>
      <div
        className={
          styles.pseudoTextarea +
          " " +
          (!isValid && styles.invalid) +
          " " +
          (isFocused && styles.focused) +
          " " +
          (isDarkMode && styles.darkMode)
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
          className={
            styles.textarea +
            " " +
            className +
            " " +
            (isDarkMode && styles.darkMode)
          }
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

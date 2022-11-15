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
import { RIGHT } from "../../constants/feed";

const TextArea: React.FC<{
  className?: string;
  errorMessage?: string;
  id?: string;
  isErrorMessageVisible?: boolean;
  isValid: boolean;
  label: string;
  onBlur?: () => void;
  onChange?: (e: ChangeEvent) => void;
  onClick?: MouseEventHandler;
  setErrorMessage?: (arg: string) => void;
  setIsErrorMessageVisible?: (arg: boolean) => void;
  setIsValid?: (arg: boolean) => void;
  value?: string;
}> = ({
  className,
  errorMessage,
  id,
  isErrorMessageVisible,
  isValid, //css invalid input responsible
  label,
  onBlur,
  onChange,
  onClick,
  setErrorMessage,
  setIsErrorMessageVisible,
  setIsValid,
  value,
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
        className={`${styles.pseudoTextarea} ${!isValid && styles.invalid} ${
          isFocused && styles.focused
        } ${isDarkMode && styles.darkMode}`}
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
          className={`${styles.textarea} ${className} ${
            isDarkMode && styles.darkMode
          }`}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (setErrorMessage && setIsValid) {
              setIsValid(true);
            }
            if (setIsErrorMessageVisible) {
              setIsErrorMessageVisible(false);
            }
          }}
        />
        {isErrorMessageVisible && (
          <InputError
            error={errorMessage || ""}
            position={RIGHT}
            className={styles.textareaError}
          ></InputError>
        )}
        {!isValid && (
          <RiErrorWarningLine
            color="red"
            size="23"
            onClick={() => {
              if (isErrorMessageVisible && setIsErrorMessageVisible) {
                setIsErrorMessageVisible(false);
              } else if (setIsErrorMessageVisible) {
                setIsErrorMessageVisible(true);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TextArea;

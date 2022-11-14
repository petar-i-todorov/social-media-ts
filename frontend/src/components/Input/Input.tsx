import React, {
  ChangeEventHandler,
  Dispatch,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "./Input.module.scss";
import InputError from "../InputError/InputError";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { ErrorPosition } from "../../types/feed";
import { LEFT } from "../../constants/feed";

interface InputProps {
  errorMessage: string;
  errorPosition: ErrorPosition;
  id: string;
  isErrorMessageVisible: boolean;
  isValid: boolean;
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler;
  placeholder: string;
  setErrorMessage?: Dispatch<SetStateAction<string>>;
  setIsErrorMessageVisible: Dispatch<SetStateAction<boolean>>;
  setIsValid: Dispatch<SetStateAction<boolean>>;
  split?: boolean;
  type: HTMLInputTypeAttribute;
  value: string;
}

const Input: React.FC<InputProps> = ({
  errorMessage,
  errorPosition,
  id,
  isErrorMessageVisible,
  isValid, //responsible for css
  onBlur,
  onChange,
  placeholder,
  setErrorMessage,
  setIsErrorMessageVisible,
  setIsValid,
  split,
  type,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false); //responsible for placeholder animation
  const { isDarkMode } = useContext(SwitchThemeContext);

  useEffect(() => {
    if (isFocused && setIsValid) {
      setIsValid(true);
    }
  }, [isFocused, setIsValid]);

  useEffect(() => {
    if (isFocused || value !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isFocused, value]);
  return (
    <div className={`${styles.mainContainer} ${isDarkMode && styles.darkMode}`}>
      <label htmlFor={id} className={(isActive && styles.active) || undefined}>
        {placeholder}
      </label>
      <div
        className={`${styles.inputContainer} ${isDarkMode && styles.darkMode}`}
      >
        {!isValid && (
          <span
            onClick={() => {
              if (isErrorMessageVisible) {
                setIsErrorMessageVisible(false);
              } else {
                setIsErrorMessageVisible(true);
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
          } ${isDarkMode && styles.darkMode}`}
          onBlur={(event) => {
            if (onBlur) {
              onBlur(event);
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
            position={errorPosition || LEFT}
          ></InputError>
        )}
      </div>
    </div>
  );
};

export default Input;

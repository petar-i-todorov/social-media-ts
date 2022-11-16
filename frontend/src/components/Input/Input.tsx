import {
  FC,
  HTMLInputTypeAttribute,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "./Input.module.scss";
import InputError from "../InputError/InputError";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { ErrorPosition } from "../../types/feed";
import { LEFT } from "../../constants/feed";
import { ActionPayload } from "../../reducers/createPostReducer";

interface InputProps {
  errorPosition: ErrorPosition;
  placeholder: string;
  split?: boolean;
  type: HTMLInputTypeAttribute;
  onBlur: React.FocusEventHandler;
  configuration: {
    errorText: string;
    isErrorVisible: boolean;
    isValid: boolean;
    value: string;
  };
  changeConfiguration: (payload: ActionPayload) => void;
}

const Input: FC<InputProps> = ({
  errorPosition,
  placeholder,
  split,
  type,
  configuration,
  changeConfiguration,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false); //responsible for placeholder animation
  const { isDarkMode } = useContext(SwitchThemeContext);

  const id = useId();

  useEffect(() => {
    if (isFocused) {
      changeConfiguration({ isValid: true });
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused || configuration.value !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isFocused, configuration.value]);
  return (
    <div className={`${styles.mainContainer} ${isDarkMode && styles.darkMode}`}>
      <label htmlFor={id} className={(isActive && styles.active) || undefined}>
        {placeholder}
      </label>
      <div
        className={`${styles.inputContainer} ${isDarkMode && styles.darkMode}`}
      >
        {!configuration.isValid && (
          <span
            onClick={() => {
              if (configuration.isErrorVisible) {
                changeConfiguration({ isErrorVisible: false });
              } else {
                changeConfiguration({ isErrorVisible: true });
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
          value={configuration.value}
          onChange={(event) => {
            changeConfiguration({
              value: (event.target as HTMLInputElement).value,
            });
            if (isFocused) {
              changeConfiguration({
                isValid: true,
                errorText: "",
              });
            }
          }}
          type={type}
          className={`${styles.input} ${
            !configuration.isValid && styles.invalid
          } ${isFocused && styles.focused} ${isDarkMode && styles.darkMode}`}
          onBlur={(event) => {
            if (onBlur) {
              onBlur(event);
            }
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
            changeConfiguration({ isValid: true, isErrorVisible: false });
          }}
        />
        {configuration.isErrorVisible && (
          <InputError
            error={configuration.errorText || ""}
            position={errorPosition || LEFT}
          ></InputError>
        )}
      </div>
    </div>
  );
};

export default Input;

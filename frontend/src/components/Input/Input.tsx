import { RiErrorWarningLine } from "react-icons/ri";
import styles from "./Input.module.scss";
import InputError from "../InputError/InputError";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { ErrorPosition } from "../../types/feed";
import { LEFT } from "../../constants/feed";
import {
  ActionPayload,
  InputConfiguration,
} from "../../reducers/createPostReducer";
import React from "react";

interface InputProps {
  errorPosition: ErrorPosition;
  placeholder: string;
  split?: boolean;
  type: React.HTMLInputTypeAttribute;
  configuration: InputConfiguration;
  changeConfiguration: (payload: ActionPayload) => void;
  error: {
    condition: boolean;
    response: string;
  };
}

const Input: React.FC<InputProps> = ({
  errorPosition,
  placeholder,
  split,
  type,
  configuration,
  changeConfiguration,
  error,
}) => {
  const { isDarkMode } = React.useContext(SwitchThemeContext);

  const id = React.useId();

  React.useEffect(() => {
    if (configuration.isFocused) {
      changeConfiguration({ isValid: true });
    }
  }, [configuration.isFocused]);

  React.useEffect(() => {
    if (configuration.isFocused || configuration.value !== "") {
      changeConfiguration({ isActive: true });
    } else {
      changeConfiguration({ isActive: false });
    }
  }, [configuration.isFocused, configuration.value]);

  return (
    <div className={`${styles.mainContainer} ${isDarkMode && styles.darkMode}`}>
      <label
        htmlFor={id}
        className={(configuration.isActive && styles.active) || undefined}
      >
        {placeholder}
      </label>
      <div
        className={`${styles.inputContainer} ${isDarkMode && styles.darkMode}`}
      >
        {!configuration.isValid && (
          <span
            onClick={() =>
              changeConfiguration({
                isErrorVisible: !configuration.isErrorVisible,
              })
            }
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
            if (configuration.isFocused) {
              changeConfiguration({
                isValid: true,
                errorText: "",
                value: (event.target as HTMLInputElement).value,
              });
            } else {
              changeConfiguration({
                value: (event.target as HTMLInputElement).value,
              });
            }
          }}
          type={type}
          className={`${styles.input} ${
            !configuration.isValid && styles.invalid
          } ${configuration.isFocused && styles.focused} ${
            isDarkMode && styles.darkMode
          }`}
          onBlur={() => {
            if (error.condition) {
              changeConfiguration({
                errorText: error.response,
                isValid: false,
                isActive: false,
                isFocused: false,
              });
            } else {
              changeConfiguration({ isActive: false, isFocused: false });
            }
          }}
          onFocus={() => {
            changeConfiguration({
              isValid: true,
              isErrorVisible: false,
              isFocused: true,
            });
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

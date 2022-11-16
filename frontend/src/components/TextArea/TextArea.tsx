import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "./TextArea.module.scss";
import InputError from "../InputError/InputError";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { RIGHT } from "../../constants/feed";
import { ActionPayload } from "../../reducers/createPostReducer";

interface TextAreaProps {
  className?: string;
  label: string;
  configuration: {
    errorText: string;
    isErrorVisible: boolean;
    isValid: boolean;
    value: string;
  };
  changeConfiguration: (payload: ActionPayload) => void;
  error: {
    condition: boolean;
    response: string;
  };
}

const TextArea: React.FC<TextAreaProps> = ({
  changeConfiguration,
  className,
  configuration,
  error,
  label,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const { isDarkMode } = React.useContext(SwitchThemeContext);

  const id = React.useId();

  React.useEffect(() => {
    if (isFocused) {
      changeConfiguration({ isValid: true });
    }
  }, [isFocused]);

  return (
    <div className={styles.textAreaContainer}>
      <label htmlFor={id}>{label}</label>
      <div
        className={`${styles.pseudoTextarea} ${
          !configuration.isValid && styles.invalid
        } ${isFocused && styles.focused} ${isDarkMode && styles.darkMode}`}
      >
        <textarea
          // onClick={onClick}
          value={configuration.value}
          id={id}
          onChange={(event) => {
            changeConfiguration({
              value: (event.target as HTMLTextAreaElement).value,
            });
            if (isFocused) {
              changeConfiguration({
                isValid: true,
                errorText: "",
              });
            }
          }}
          className={`${styles.textarea} ${className} ${
            isDarkMode && styles.darkMode
          }`}
          onBlur={() => {
            if (error.condition) {
              changeConfiguration({
                isValid: false,
                errorText: error.response,
              });
            }
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
            changeConfiguration({
              isValid: true,
              isErrorVisible: false,
            });
          }}
        />
        {configuration.isErrorVisible && (
          <InputError
            error={configuration.errorText || ""}
            position={RIGHT}
            className={styles.textareaError}
          ></InputError>
        )}
        {!configuration.isValid && (
          <RiErrorWarningLine
            color="red"
            size="23"
            onClick={() =>
              changeConfiguration({
                isErrorVisible: !configuration.isErrorVisible,
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default TextArea;

import React, { useContext } from "react";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./Form.module.scss";

const Form: React.FC<{
  onSubmit?: React.FormEventHandler;
  children: React.ReactNode;
  nonAnimated?: boolean;
}> = ({ onSubmit, children, nonAnimated }) => {
  const { isDarkMode } = useContext(SwitchThemeContext);
  return (
    <div
      className={
        styles.mainContainer + " " + (nonAnimated && styles.nonAnimated)
      }
    >
      <form
        noValidate
        onSubmit={onSubmit}
        className={styles.form + " " + (isDarkMode && styles.darkMode)}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </form>
    </div>
  );
};

export default Form;

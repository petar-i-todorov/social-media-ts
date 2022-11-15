import { FC, FormEventHandler, PropsWithChildren, useContext } from "react";

import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import styles from "./Form.module.scss";

interface FormProps {
  onSubmit?: FormEventHandler;
  nonAnimated?: boolean;
}

const Form: FC<PropsWithChildren<FormProps>> = ({
  onSubmit,
  children,
  nonAnimated,
}) => {
  const { isDarkMode } = useContext(SwitchThemeContext);
  return (
    <div
      className={`${styles.mainContainer} ${nonAnimated && styles.nonAnimated}`}
    >
      <form
        noValidate
        onSubmit={onSubmit}
        className={`${styles.form} ${isDarkMode && styles.darkMode}`}
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

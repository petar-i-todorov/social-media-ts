import React from "react";
import styles from "./Form.module.scss";

const Form: React.FC<{
  onSubmit: React.FormEventHandler;
  children: React.ReactNode;
  animated: boolean;
}> = ({ onSubmit, children, animated }) => {
  console.log(styles.nonAnimated);
  return (
    <div
      className={styles.mainContainer + " " + (!animated && styles.nonAnimated)}
    >
      <form
        noValidate
        onSubmit={onSubmit}
        className={styles.form}
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

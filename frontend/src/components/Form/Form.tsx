import React from "react";
import styles from "./Form.module.scss";

const Form: React.FC<{
  onSubmit?: React.FormEventHandler;
  children: React.ReactNode;
  nonAnimated?: boolean;
}> = ({ onSubmit, children, nonAnimated }) => {
  return (
    <div
      className={
        styles.mainContainer + " " + (nonAnimated && styles.nonAnimated)
      }
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

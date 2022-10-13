import React from "react";
import styles from "./FormError.module.scss";

const FormError: React.FC<{ children: string }> = ({ children }) => {
  return <div className={styles.formError}>{children}</div>;
};

export default FormError;

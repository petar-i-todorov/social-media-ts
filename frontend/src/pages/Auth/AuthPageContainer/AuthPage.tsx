import React from "react";

import styles from "./AuthPage.module.scss";

const AuthPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.authPage}>{children}</div>;
};

export default AuthPage;

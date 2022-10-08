import React from "react";
import Login from "../../../components/LoginForm/LoginForm";
import styles from "./Login.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.login}>
      <Login />
    </div>
  );
};

export default LoginPage;

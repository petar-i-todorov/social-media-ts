import React from "react";
import ResetPassword from "../../components/AuthForms/ResetPassword";
import styles from "./AuthPage.module.scss";

const ResetPasswordPage = () => {
  return (
    <div className={styles.authPage}>
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;

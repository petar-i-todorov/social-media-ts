import LoginForm from "../../components/AuthForms/LoginForm";
import styles from "./AuthPage.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.authPage}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

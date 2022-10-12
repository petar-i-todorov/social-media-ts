import LoginForm from "../../../components/AuthForms/LoginForm";
import styles from "./Login.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.login}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

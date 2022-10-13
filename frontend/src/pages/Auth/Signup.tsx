import SignupForm from "../../components/AuthForms/SignupForm";
import styles from "./AuthPage.module.scss";

const SignupPage = () => {
  return (
    <div className={styles.authPage}>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

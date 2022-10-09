import SignupForm from "../../../components/AuthForms/SignupForm";
import styles from "./Signup.module.scss";

const SignupPage = () => {
  return (
    <div className={styles.login}>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

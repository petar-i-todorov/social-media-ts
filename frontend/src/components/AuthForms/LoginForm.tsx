import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./LoginForm.module.scss";
import formStyles from "./AuthForm.module.scss";

const LoginForm = () => {
  return (
    <div className={styles.login + " " + formStyles.authForm}>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Link to="reset">Forgot password?</Link>
      <Button color="blue">Log In</Button>
      <Link to="../signup">
        <Button color="green">Sign up</Button>
      </Link>
    </div>
  );
};

export default LoginForm;

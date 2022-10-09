import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import formStyles from "./AuthForm.module.scss";
import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  return (
    <div className={formStyles.authForm + " " + styles.signup}>
      <div className={styles.splitContainer}>
        <Input type="text" placeholder="First Name" split />
        <Input type="text" placeholder="Last Name" split />
      </div>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="password" placeholder="Confirm password" />
      <Button color="green">Sign up</Button>
      <Link to="../login">
        <Button color="blue">Log in</Button>
      </Link>
    </div>
  );
};

export default SignupForm;

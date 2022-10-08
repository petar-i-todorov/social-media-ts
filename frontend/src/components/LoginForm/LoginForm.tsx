import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./LoginForm.module.scss";

const Login = () => {
  return (
    <div className={styles.login}>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Link to="reset">Forgot password?</Link>
      <Button color="blue">Log In</Button>
      <hr />
      <Button color="green">
        <Link to="signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default Login;

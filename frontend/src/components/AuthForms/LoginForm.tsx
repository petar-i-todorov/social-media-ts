import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./LoginForm.module.scss";
import formStyles from "./AuthForm.module.scss";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className={styles.login + " " + formStyles.authForm}
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }}
    >
      <Input
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setEmail(target.value);
        }}
        type="email"
        placeholder="Email"
      />
      <Input
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setPassword(target.value);
        }}
        type="password"
        placeholder="Password"
      />
      <Link to="reset">Forgot password?</Link>
      <Button color="blue">Log In</Button>
      <Link to="../signup">
        <Button color="green">Sign up</Button>
      </Link>
    </form>
  );
};

export default LoginForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import formStyles from "./AuthForm.module.scss";
import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  return (
    <form
      className={formStyles.authForm + " " + styles.signup}
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: firstName + " " + lastName,
              email: email,
              password: password,
            }),
          });
          navigate("../login", { relative: "path" });
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <div className={styles.splitContainer}>
        <Input
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setFirstName(target.value);
          }}
          type="text"
          placeholder="First Name"
          split
          value={firstName}
        />
        <Input
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setLastName(target.value);
          }}
          type="text"
          placeholder="Last Name"
          split
          value={lastName}
        />
      </div>
      <Input
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setEmail(target.value);
        }}
        type="email"
        placeholder="Email"
        value={email}
      />
      <Input
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setPassword(target.value);
        }}
        type="password"
        placeholder="Password"
        value={password}
      />
      <Input type="password" placeholder="Confirm password" />
      <Button color="green" type="submit">
        Sign up
      </Button>
      <Link to="../login">
        <Button color="blue">Log in</Button>
      </Link>
    </form>
  );
};

export default SignupForm;

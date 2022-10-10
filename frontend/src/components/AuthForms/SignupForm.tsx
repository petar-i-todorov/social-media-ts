import React, { useState, useRef } from "react";
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
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
          valid={!firstNameError}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setFirstName(target.value);
            const firstNameValueRef = target.value;
            if (firstNameValueRef.length > 0) {
              setFirstNameError("");
            }
          }}
          type="text"
          placeholder="First Name"
          split
          value={firstName}
          onBlur={() => {
            if (firstName.length === 0) {
              setFirstNameError("What's your first name?");
            }
          }}
        />
        <Input
          valid={!lastNameError}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setLastName(target.value);
            const lastNameValueRef = target.value;
            if (lastNameValueRef.length > 0) {
              setLastNameError("");
            }
          }}
          type="text"
          placeholder="Last Name"
          split
          value={lastName}
          onBlur={() => {
            if (lastName.length === 0) {
              setLastNameError("What's your last name?");
            }
          }}
        />
      </div>
      <Input
        valid={!emailError}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setEmail(target.value);
        }}
        type="email"
        placeholder="Email"
        value={email}
        onBlur={() => {
          if (
            !String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
          ) {
            setEmailError("Please, enter a valid email address.");
          }
        }}
      />
      <Input
        valid={!passwordError}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setPassword(target.value);
        }}
        type="password"
        placeholder="Password"
        value={password}
        onBlur={() => {
          if (password.length) {
            setPasswordError(
              "Please, enter a combination of numbers and symbols."
            );
          }
        }}
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

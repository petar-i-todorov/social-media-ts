import { useState } from "react";
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
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState(false);
  const navigate = useNavigate();
  return (
    <form
      className={formStyles.authForm + " " + styles.signup}
      onSubmit={async (event) => {
        event.preventDefault();
        if (firstName.length < 1) {
          setFirstNameError("What's your first name?");
          setFirstNameErrorMessage(true);
        } else if (lastName.length < 1) {
          setLastNameError("What's your last name?");
          setLastNameErrorMessage(true);
        } else if (
          String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
          setEmailError("Please, enter a valid email address.");
          setEmailErrorMessage(true);
        } else if (password.length < 10) {
          setPasswordError(
            "Please, enter a valid combination of at least 10 symbols."
          );
        } else if (password !== confirmPassword) {
          setConfirmPasswordError("Passwords don't match.");
          setConfirmPasswordErrorMessage(true);
        } else {
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
                confirmPassword: confirmPassword,
              }),
            });
            navigate("../login", { relative: "path" });
          } catch (err) {
            console.log(err);
          }
        }
      }}
    >
      <h1>Sign up</h1>
      <hr />
      <div className={styles.splitContainer}>
        <Input
          isError={firstNameErrorMessage}
          setIsError={setFirstNameErrorMessage}
          errorMessage={firstNameError}
          errorPosition="left"
          valid={!firstNameError}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setFirstName(target.value);
            const firstNameValueRef = target.value;
            if (firstNameValueRef.length > 0) {
              setFirstNameError("");
            } else {
              setFirstNameError("What's your first name?");
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
          isError={lastNameErrorMessage}
          setIsError={setLastNameErrorMessage}
          errorMessage={lastNameError}
          errorPosition="right"
          valid={!lastNameError}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setLastName(target.value);
            const lastNameValueRef = target.value;
            if (lastNameValueRef.length > 0) {
              setLastNameError("");
            } else {
              setLastNameError("What's your last name?");
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
        isError={emailErrorMessage}
        setIsError={setEmailErrorMessage}
        errorMessage={emailError}
        valid={!emailError}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setEmail(target.value);
          const emailRef = target.value;
          if (
            String(emailRef)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
          ) {
            setEmailError("");
          } else {
            setEmailError("Please, enter a valid email.");
          }
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
        errorPosition="right"
      />
      <Input
        isError={passwordErrorMessage}
        setIsError={setPasswordErrorMessage}
        errorMessage={passwordError}
        valid={!passwordError}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setPassword(target.value);
          if (target.value.length >= 10) {
            setPasswordError("");
          } else {
            setPasswordError(
              "Please, enter a valid combination of at least 10 symbols."
            );
          }
        }}
        type="password"
        placeholder="Password"
        value={password}
        onBlur={() => {
          if (password.length < 10) {
            setPasswordError(
              "Please, enter a valid combination of at least 10 symbols."
            );
          }
        }}
        errorPosition="right"
      />
      <Input
        isError={confirmPasswordErrorMessage}
        setIsError={setConfirmPasswordErrorMessage}
        errorMessage={confirmPasswordError}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setConfirmPassword(target.value);
          if (target.value === password) {
            setConfirmPasswordError("");
          } else {
            setConfirmPasswordError("Passwords don't match.");
          }
        }}
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        valid={!confirmPasswordError}
        errorPosition="right"
      />
      <Button color="green" type="submit">
        Sign up
      </Button>
      <Link to="../login" relative="path">
        <Button color="blue">Log in →</Button>
      </Link>
    </form>
  );
};

export default SignupForm;

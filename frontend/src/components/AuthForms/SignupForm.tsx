import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";
import formStyles from "./AuthForm.module.scss";
import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <form
      noValidate
      className={formStyles.authForm + " " + styles.signup}
      onSubmit={async (event) => {
        event.preventDefault();
        if (firstName.length < 1) {
          setFirstNameErrorMessage("What's your first name?");
          setFirstNameError(true);
        } else if (lastName.length < 1) {
          setLastNameErrorMessage("What's your last name?");
          setLastNameError(true);
        } else if (
          !String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
          setEmailErrorMessage("Please, enter a valid email address.");
          setEmailError(true);
        } else if (password.length < 10) {
          setPasswordErrorMessage(
            "Please, enter a valid combination of at least 10 symbols."
          );
          setPasswordError(true);
        } else if (password !== confirmPassword) {
          setConfirmPasswordErrorMessage("Passwords don't match.");
          setConfirmPasswordError(true);
        } else {
          setIsLoading(true);
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
            setIsLoading(false);
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
          isError={firstNameError}
          setIsError={setFirstNameError}
          errorMessage={firstNameErrorMessage}
          errorPosition="left"
          valid={!firstNameErrorMessage}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setFirstName(target.value);
            const firstNameValueRef = target.value;
            if (firstNameValueRef.length > 0) {
              setFirstNameErrorMessage("");
              if (firstNameError) {
                setFirstNameError(false);
              }
            } else {
              setFirstNameErrorMessage("What's your first name?");
            }
          }}
          type="text"
          placeholder="First Name"
          split
          value={firstName}
          onBlur={() => {
            if (firstName.length === 0) {
              setFirstNameErrorMessage("What's your first name?");
            }
          }}
        />
        <Input
          isError={lastNameError}
          setIsError={setLastNameError}
          errorMessage={lastNameErrorMessage}
          errorPosition="right"
          valid={!lastNameErrorMessage}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setLastName(target.value);
            const lastNameValueRef = target.value;
            if (lastNameValueRef.length > 0) {
              setLastNameErrorMessage("");
              if (lastNameError) {
                setLastNameError(false);
              }
            } else {
              setLastNameErrorMessage("What's your last name?");
            }
          }}
          type="text"
          placeholder="Last Name"
          split
          value={lastName}
          onBlur={() => {
            if (lastName.length === 0) {
              setLastNameErrorMessage("What's your last name?");
            }
          }}
        />
      </div>
      <Input
        isError={emailError}
        setIsError={setEmailError}
        errorMessage={emailErrorMessage}
        valid={!emailErrorMessage}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setEmail(target.value);
          if (
            String(target.value)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
          ) {
            setEmailErrorMessage("");
            if (emailError) {
              setEmailError(false);
            }
          } else {
            setEmailErrorMessage("Please, enter a valid email address.");
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
            setEmailErrorMessage("Please, enter a valid email address.");
          }
        }}
        errorPosition="right"
      />
      <Input
        isError={passwordError}
        setIsError={setPasswordError}
        errorMessage={passwordErrorMessage}
        valid={!passwordErrorMessage}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setPassword(target.value);
          if (target.value.length >= 10) {
            setPasswordErrorMessage("");
            if (passwordError) {
              setPasswordError(false);
            }
          } else {
            setPasswordErrorMessage(
              "Please, enter a valid combination of at least 10 symbols."
            );
          }
        }}
        type="password"
        placeholder="Password"
        value={password}
        onBlur={() => {
          if (password.length < 10) {
            setPasswordErrorMessage(
              "Please, enter a valid combination of at least 10 symbols."
            );
          }
        }}
        errorPosition="right"
      />
      <Input
        isError={confirmPasswordError}
        setIsError={setConfirmPasswordError}
        errorMessage={confirmPasswordErrorMessage}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setConfirmPassword(target.value);
          if (target.value === password) {
            setConfirmPasswordErrorMessage("");
            if (confirmPasswordError) {
              setConfirmPasswordError(false);
            }
          } else {
            setConfirmPasswordErrorMessage("Passwords don't match.");
          }
        }}
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        valid={!confirmPasswordErrorMessage}
        errorPosition="right"
      />
      <div className={styles.buttonContainer}>
        <Button color="green" type="submit">
          Sign up
        </Button>
        {isLoading && <Loader />}
      </div>
      <Link to="../login" relative="path">
        <Button color="blue">Log in →</Button>
      </Link>
    </form>
  );
};

export default SignupForm;

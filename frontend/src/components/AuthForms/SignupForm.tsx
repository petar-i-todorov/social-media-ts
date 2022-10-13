import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BouncingDotsLoader from "../BouncingDotsLoader/BouncingDotsLoader";
import Button from "../Button/Button";
import FormError from "../FormError/FormError";
import Input from "../Input/Input";
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
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const navigate = useNavigate();
  return (
    <div className={formStyles.formsContainer}>
      <form
        noValidate
        className={formStyles.authForm}
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
              const response = await fetch(
                "http://localhost:8080/auth/signup",
                {
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
                }
              );
              setIsLoading(false);
              if (response.status === 200 || response.status === 201) {
                navigate("../login", { relative: "path" });
              } else {
                const resData = await response.json();
                setServerErrorMessage(resData.message);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }}
      >
        <h2>Sign up</h2>
        <div className={styles.splitContainer}>
          <Input
            setErrorMessage={setFirstNameErrorMessage}
            isError={firstNameError}
            setIsError={setFirstNameError}
            errorMessage={firstNameErrorMessage}
            errorPosition="left"
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setFirstName(target.value);
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
            setErrorMessage={setLastNameErrorMessage}
            isError={lastNameError}
            setIsError={setLastNameError}
            errorMessage={lastNameErrorMessage}
            errorPosition="right"
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setLastName(target.value);
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
          setErrorMessage={setEmailErrorMessage}
          isError={emailError}
          setIsError={setEmailError}
          errorMessage={emailErrorMessage}
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
              setEmailErrorMessage("Please, enter a valid email address.");
            }
          }}
          errorPosition="right"
        />
        <Input
          setErrorMessage={setPasswordErrorMessage}
          isError={passwordError}
          setIsError={setPasswordError}
          errorMessage={passwordErrorMessage}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setPassword(target.value);
            if (target.value === confirmPassword) {
              setConfirmPasswordError(false);
              setConfirmPasswordErrorMessage("");
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
          setErrorMessage={setConfirmPasswordErrorMessage}
          isError={confirmPasswordError}
          setIsError={setConfirmPasswordError}
          errorMessage={confirmPasswordErrorMessage}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setConfirmPassword(target.value);
          }}
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          errorPosition="right"
          onBlur={() => {
            if (password !== confirmPassword) {
              setConfirmPasswordErrorMessage("Passwords don't match.");
            }
          }}
        />
        {serverErrorMessage && <FormError>{serverErrorMessage}</FormError>}
        <div className={formStyles.buttonContainer}>
          <Button color="green" type="submit">
            {isLoading ? <BouncingDotsLoader text="Signing up" /> : "Sign up"}
          </Button>
        </div>
      </form>
      <div className={formStyles.authForm}>
        <h2>Already have an account?</h2>
        <Link to="../login" relative="path">
          <Button color="blue">Log in</Button>
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;

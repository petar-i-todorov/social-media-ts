import styles from "./AuthPage.module.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isEmail, isPassword } from "../../utils/validation";
import BouncingDotsLoader from "../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../components/Button/Button";
import FormMessage from "../../components/FormMessage/FormMessage";
import Input from "../../components/Input/Input";

const SignupPage = () => {
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
  const [isFirstNameErrorVisible, setIsFirstNameErrorVisible] = useState(false);
  const [isLastNameErrorVisible, setIsLastNameErrorVisible] = useState(false);
  const [isEmailErrorVisible, setIsEmailErrorVisible] = useState(false);
  const [isPasswordErrorVisible, setIsPasswordErrorVisible] = useState(false);
  const [isConfirmPasswordErrorVisible, setIsConfirmPasswordErrorVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [firstNameIsValid, setFirstNameIsValid] = useState(true);
  const [lastNameIsValid, setLastNameIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(true);
  const navigate = useNavigate();
  return (
    <div className={styles.authPage}>
      <div className={styles.mainContainer}>
        <form
          noValidate
          className={styles.authForm}
          onSubmit={async (event) => {
            event.preventDefault();
            if (firstName.length < 1) {
              setFirstNameErrorMessage("What's your first name?");
              setIsFirstNameErrorVisible(true);
            } else if (lastName.length < 1) {
              setLastNameErrorMessage("What's your last name?");
              setIsLastNameErrorVisible(true);
            } else if (isEmail(email)) {
              setEmailErrorMessage("Please, enter a valid email address.");
              setIsEmailErrorVisible(true);
            } else if (!isPassword(password)) {
              setPasswordErrorMessage(
                "Please, enter a valid combination of at least 10 symbols."
              );
              setIsPasswordErrorVisible(true);
            } else if (password !== confirmPassword) {
              setConfirmPasswordErrorMessage("Passwords don't match.");
              setIsConfirmPasswordErrorVisible(true);
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
              isValid={firstNameIsValid}
              setIsValid={setFirstNameIsValid}
              id="firstName"
              setErrorMessage={setFirstNameErrorMessage}
              isErrorMessageVisible={isFirstNameErrorVisible}
              setIsErrorMessageVisible={setIsFirstNameErrorVisible}
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
                  setFirstNameIsValid(false);
                }
              }}
            />
            <Input
              isValid={lastNameIsValid}
              setIsValid={setLastNameIsValid}
              id="lastName"
              setErrorMessage={setLastNameErrorMessage}
              isErrorMessageVisible={isLastNameErrorVisible}
              setIsErrorMessageVisible={setIsLastNameErrorVisible}
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
                  setLastNameIsValid(false);
                }
              }}
            />
          </div>
          <Input
            isValid={emailIsValid}
            setIsValid={setEmailIsValid}
            id="email"
            setErrorMessage={setEmailErrorMessage}
            isErrorMessageVisible={isEmailErrorVisible}
            setIsErrorMessageVisible={setIsEmailErrorVisible}
            errorMessage={emailErrorMessage}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setEmail(target.value);
            }}
            type="email"
            placeholder="Email"
            value={email}
            onBlur={() => {
              if (!isEmail(email)) {
                setEmailErrorMessage("Please, enter a valid email address.");
                setEmailIsValid(false);
              }
            }}
            errorPosition="right"
          />
          <Input
            isValid={passwordIsValid}
            setIsValid={setPasswordIsValid}
            id="password"
            setErrorMessage={setPasswordErrorMessage}
            isErrorMessageVisible={isPasswordErrorVisible}
            setIsErrorMessageVisible={setIsPasswordErrorVisible}
            errorMessage={passwordErrorMessage}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              setPassword(target.value);
              if (target.value === confirmPassword) {
                setIsConfirmPasswordErrorVisible(false);
                setConfirmPasswordErrorMessage("");
              }
            }}
            type="password"
            placeholder="Password"
            value={password}
            onBlur={() => {
              if (!isPassword(password)) {
                setPasswordErrorMessage(
                  "Please, enter a valid combination of at least 10 symbols."
                );
                setPasswordIsValid(false);
              }
            }}
            errorPosition="right"
          />
          <Input
            isValid={confirmPasswordIsValid}
            setIsValid={setConfirmPasswordIsValid}
            id="confirmPassword"
            setErrorMessage={setConfirmPasswordErrorMessage}
            isErrorMessageVisible={isConfirmPasswordErrorVisible}
            setIsErrorMessageVisible={setIsConfirmPasswordErrorVisible}
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
                setConfirmPasswordIsValid(false);
              }
            }}
          />
          {serverErrorMessage && (
            <FormMessage color="red">{serverErrorMessage}</FormMessage>
          )}
          <div className={styles.button}>
            <Button color="green" type="submit">
              {isLoading ? <BouncingDotsLoader text="Signing up" /> : "Sign up"}
            </Button>
          </div>
        </form>
        <div className={styles.authForm}>
          <h2>Already have an account?</h2>
          <Link
            to="../login"
            relative="path"
            className={isLoading ? styles.disabledLink : ""}
          >
            <Button
              color="blue"
              onClick={() => {
                if (isLoading) {
                }
              }}
            >
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

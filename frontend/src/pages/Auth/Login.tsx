import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.scss";
import { isEmail, isPassword } from "../../utils/validation";
import BouncingDotsLoader from "../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [isEmailErrorMessageVisible, setIsEmailErrorVisible] = useState(false);
  const [isPasswordErrorMessageVisible, setIsPasswordErrorVisible] =
    useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.authPage}>
      <div className={styles.mainContainer}>
        <form
          className={styles.authForm}
          onSubmit={async (event) => {
            event.preventDefault();
            if (!isEmail(email)) {
              setEmailErrorMessage("Invalid email address.");
              setIsEmailErrorVisible(true);
            } else if (!isPassword(password)) {
              setPasswordErrorMessage(
                "Invalid password. Must be at least 10 symbols."
              );
              setIsPasswordErrorVisible(true);
            } else {
              setIsLoading(true);
              const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (response.status === 200 || response.status === 201) {
                const resData = await response.json();
                localStorage.setItem("token", resData.token);
                localStorage.setItem("userId", resData.userId);
                setTimeout(() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                }, 3600000);
                setTimeout(() => {
                  navigate("..", { relative: "path" });
                }, 4000);
              } else {
                //show error component
                console.log("An error occured.");
              }
            }
          }}
        >
          <h2>Log in</h2>
          <Input
            errorPosition="right"
            isErrorMessageVisible={isEmailErrorMessageVisible}
            setIsErrorMessageVisible={setIsEmailErrorVisible}
            errorMessage={emailErrorMessage}
            id="email"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setEmail(target.value);
            }}
            type="email"
            placeholder="Email"
            isValid={isEmailValid}
            setIsValid={setIsEmailValid}
            value={email}
            onBlur={() => {
              if (!isEmail(email)) {
                setEmailErrorMessage("Invalid email address.");
                setIsEmailValid(false);
              }
            }}
          />
          <Input
            errorPosition="right"
            isErrorMessageVisible={isPasswordErrorMessageVisible}
            setIsErrorMessageVisible={setIsPasswordErrorVisible}
            errorMessage={passwordErrorMessage}
            id="password"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setPassword(target.value);
            }}
            type="password"
            placeholder="Password"
            isValid={isPasswordValid}
            setIsValid={setIsPasswordValid}
            value={password}
            onBlur={() => {
              if (!isPassword(password)) {
                setPasswordErrorMessage(
                  "Invalid password. Must be at least 10 symbols."
                );
                setIsPasswordValid(false);
              }
            }}
          />
          <Link to="../reset-password" relative="path">
            Forgot password?
          </Link>
          <div className={styles.button}>
            <Button color="blue" type="submit">
              {isLoading ? <BouncingDotsLoader text="Loging in" /> : "Log in"}
            </Button>
          </div>
        </form>
        <div className={styles.authForm}>
          <h2>Don't have an account?</h2>
          <Link
            to="../signup"
            relative="path"
            className={isLoading ? styles.disabledLink : ""}
          >
            <Button color="green">Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

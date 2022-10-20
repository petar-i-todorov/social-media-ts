import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { isEmail, isPassword } from "../../../utils/validation";
import BouncingDotsLoader from "../../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import FormMessage from "../../../components/FormMessage/FormMessage";
import Form from "../../../components/Form/Form";
import AuthPage from "../AuthPageContainer/AuthPage";

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
  const [isServerError, setIsServerError] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  return (
    <AuthPage>
      <>
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsServerError(false);
            if (!isEmail(email)) {
              setEmailErrorMessage("Invalid email address.");
              setIsEmailErrorVisible(true);
              setIsEmailValid(false);
            } else if (!isPassword(password)) {
              setPasswordErrorMessage(
                "Invalid password. Must be at least 10 symbols."
              );
              setIsPasswordErrorVisible(true);
              setIsPasswordValid(false);
            } else {
              setIsLoading(true);
              const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const resData = await response.json();
              setIsLoading(false);
              if (response.status === 200 || response.status === 201) {
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
                setIsServerError(true);
                setResponseMessage(resData.message);
              }
            }
          }}
        >
          <>
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
            {isServerError && (
              <FormMessage color="red">{responseMessage}</FormMessage>
            )}
            <Button color="blue" type="submit">
              {isLoading ? <BouncingDotsLoader text="Loging in" /> : "Log in"}
            </Button>
          </>
        </Form>
        <Form>
          <>
            <h2>Don't have an account?</h2>
            <Link
              to="../signup"
              relative="path"
              className={isLoading ? styles.disabledLink : ""}
            >
              <Button color="green">Sign up</Button>
            </Link>
          </>
        </Form>
      </>
    </AuthPage>
  );
};

export default LoginPage;

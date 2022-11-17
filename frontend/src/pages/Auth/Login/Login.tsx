import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { isEmail, isPassword } from "../../../utils/validation";
import BouncingDotsLoader from "../../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import FormMessage from "../../../components/FormMessage/FormMessage";
import Form from "../../../components/Form/Form";
import AuthPage from "../AuthPageContainer/AuthPage";
import { RIGHT } from "../../../constants/feed";
import { login } from "../../../api/auth";
import { initialState, reducer } from "../../../reducers/loginReducer";

const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isServerError, setIsServerError] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [formState, dispatch] = React.useReducer(reducer, initialState);

  const navigate = useNavigate();

  const onLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsServerError(false);
    if (!isEmail(email)) {
      setEmailErrorMessage("Invalid email address.");
      setIsEmailErrorVisible(true);
      setIsEmailValid(false);
    } else if (!isPassword(password)) {
      setPasswordErrorMessage("Invalid password. Must be at least 10 symbols.");
      setIsPasswordErrorVisible(true);
      setIsPasswordValid(false);
    } else {
      setIsLoading(true);
      const response = await login({ email, password });
      const resData = await response.json();
      setIsLoading(false);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }, 3600000);
        navigate("..", { relative: "path" });
      } else {
        setIsServerError(true);
        setResponseMessage(resData.message);
      }
    }
  };

  return (
    <AuthPage>
      <>
        <Form onSubmit={onLoginSubmit}>
          <>
            <h2>Log in</h2>
            <Input errorPosition={RIGHT} type="email" placeholder="Email" />
            <Input
              errorPosition={RIGHT}
              isErrorMessageVisible={isPasswordErrorMessageVisible}
              setIsErrorMessageVisible={setIsPasswordErrorVisible}
              errorMessage={passwordErrorMessage}
              onChange={(e) => {
                setPassword((e.target as HTMLInputElement).value);
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
              className={isLoading ? styles.disabledLink : undefined}
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

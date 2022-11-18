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
import {
  EMAIL,
  initialState,
  PASSWORD,
  reducer,
} from "../../../reducers/loginReducer";
import { ActionPayload } from "../../../reducers/createPostReducer";

const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isServerError, setIsServerError] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [inputsState, dispatch] = React.useReducer(reducer, initialState);

  const navigate = useNavigate();

  const customDispatch = (actionType: "EMAIL" | "PASSWORD") => {
    return (actionPayload: ActionPayload) => {
      dispatch({ type: actionType, payload: actionPayload });
    };
  };

  const onLoginSubmit = async () => {
    setIsServerError(false);
    if (!isEmail(inputsState.email.value)) {
      dispatch({
        type: EMAIL,
        payload: {
          isErrorVisible: true,
          errorText: "Invalid email address.",
          isValid: false,
        },
      });
    } else if (!isPassword(inputsState.password.value)) {
      dispatch({
        type: PASSWORD,
        payload: {
          isErrorVisible: true,
          errorText: "Invalid password. Must be at least 10 symbols.",
          isValid: false,
        },
      });
    } else {
      setIsLoading(true);
      const response = await login({
        email: inputsState.email.value,
        password: inputsState.password.value,
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
          <h2>Log in</h2>
          <Input
            errorPosition={RIGHT}
            type="email"
            placeholder="Email"
            configuration={inputsState.email}
            changeConfiguration={customDispatch(EMAIL)}
            error={{
              condition: !isEmail(inputsState.email.value),
              response: "Invalid email address.",
            }}
          />
          <Input
            errorPosition={RIGHT}
            type="password"
            placeholder="Password"
            configuration={inputsState.password}
            changeConfiguration={customDispatch(PASSWORD)}
            error={{
              condition: !isPassword(inputsState.password.value),
              response: "Invalid password. Must be at least 10 symbols.",
            }}
          />
          <Link to="../reset-password" relative="path">
            Forgot password?
          </Link>
          {isServerError && (
            <FormMessage color="red">{responseMessage}</FormMessage>
          )}
          <button type="submit">Submit</button>
          <Button color="blue" type="submit">
            {isLoading ? <BouncingDotsLoader text="Loging in" /> : "Log in"}
          </Button>
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

import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import BouncingDotsLoader from "../../../components/BouncingDotsLoader/BouncingDotsLoader";
import FormMessage from "../../../components/FormMessage/FormMessage";
import { isEmail } from "../../../utils/validation";
import Form from "../../../components/Form/Form";
import styles from "./ResetPassword.module.scss";
import AuthPage from "../AuthPageContainer/AuthPage";
import { RIGHT } from "../../../constants/feed";
import { sendEmailWithInstructions } from "../../../api/auth";
import { ActionPayload } from "../../../reducers/createPostReducer";
import { initialState, reducer } from "../../../reducers/resetPasswordReducer";
import React from "react";
import { EMAIL } from "../../../reducers/loginReducer";

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSuccess, setIsServerSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [emailState, dispatch] = React.useReducer(reducer, initialState);

  const customDispatch = (actionPayload: ActionPayload) => {
    dispatch({ type: EMAIL, payload: actionPayload });
  };

  const onFormSubmit = async () => {
    if (!isEmail(emailState.value)) {
      customDispatch({
        errorText: "Invalid email address.",
        isErrorVisible: true,
        isValid: false,
      });
    } else {
      setIsLoading(true);
      setIsServerError(false);
      setIsServerSuccess(false);
      const response = await sendEmailWithInstructions(emailState.value);
      setIsLoading(false);
      const resData = await response.json();
      setResponseMessage(resData.message);
      if (response.status === 200) {
        setIsServerSuccess(true);
      } else {
        setIsServerError(true);
      }
    }
  };

  return (
    <AuthPage>
      <Form onSubmit={onFormSubmit}>
        <h2>Forgot your password?</h2>
        <span className={styles.text}>
          Enter the email you usually use to log in to your account:
        </span>
        <Input
          placeholder="Email"
          type="email"
          errorPosition={RIGHT}
          configuration={emailState}
          changeConfiguration={customDispatch}
          error={{
            condition: !isEmail(emailState.value),
            response: "Invalid email address.",
          }}
        />
        {isServerSuccess && (
          <FormMessage color="green">{responseMessage}</FormMessage>
        )}
        {isServerError && (
          <FormMessage color="red">{responseMessage}</FormMessage>
        )}
        <Button color="green" type="submit">
          {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
        </Button>
        <span className={styles.lines}>or</span>
        <Link
          to="../login"
          relative="path"
          className={isLoading ? styles.disabledLink : undefined}
        >
          <Button color="blue">Log in</Button>
        </Link>
      </Form>
    </AuthPage>
  );
};

export default ResetPasswordPage;

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

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSuccess, setIsServerSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isEmailErrorMessageVisible, setIsEmailErrorMessageVisible] =
    useState(false);
  return (
    <AuthPage>
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!isEmail(email)) {
            setEmailErrorMessage("Invalid email address.");
            setIsEmailErrorMessageVisible(true);
            setIsEmailValid(false);
          } else {
            setIsLoading(true);
            setIsServerError(false);
            setIsServerSuccess(false);
            const response = await fetch(
              "http://localhost:8080/auth/reset-password",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
              }
            );
            setIsLoading(false);
            const resData = await response.json();
            setResponseMessage(resData.message);
            if (response.status === 200) {
              setIsServerSuccess(true);
            } else {
              setIsServerError(true);
            }
          }
        }}
      >
        <h2>Forgot your password?</h2>
        <span className={styles.text}>
          Enter the email you usually use to log in to your account:
        </span>
        <Input
          id="reset"
          placeholder="Email"
          type="email"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setEmail(target.value);
          }}
          isValid={isEmailValid}
          value={email}
          errorPosition={RIGHT}
          setIsValid={setIsEmailValid}
          errorMessage={emailErrorMessage}
          isErrorMessageVisible={isEmailErrorMessageVisible}
          setIsErrorMessageVisible={setIsEmailErrorMessageVisible}
          onBlur={() => {
            if (!isEmail(email)) {
              setEmailErrorMessage("Invalid email address.");
              setIsEmailValid(false);
            }
          }}
        />
        {isServerSuccess ? (
          <FormMessage color="green">{responseMessage}</FormMessage>
        ) : (
          ""
        )}
        {isServerError ? (
          <FormMessage color="red">{responseMessage}</FormMessage>
        ) : (
          ""
        )}
        <Button color="green" type="submit">
          {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
        </Button>
        <span className={styles.lines}>or</span>
        <Link
          to="../login"
          relative="path"
          className={isLoading ? styles.disabledLink : ""}
        >
          <Button color="blue">Log in</Button>
        </Link>
      </Form>
    </AuthPage>
  );
};

export default ResetPasswordPage;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

import BouncingDotsLoader from "../../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../../components/Button/Button";
import FormMessage from "../../../components/FormMessage/FormMessage";
import Input from "../../../components/Input/Input";
import { isPassword } from "../../../utils/validation";
import Form from "../../../components/Form/Form";
import styles from "./SetNewPassword.module.scss";
import AuthPage from "../AuthPageContainer/AuthPage";
import { RIGHT } from "../../../constants/feed";

const SetNewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSuccess, setIsServerSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  return (
    <AuthPage>
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!isPassword(password)) {
            setErrorMessage("Invalid password. Must be at least 10 symbols.");
            setIsErrorMessageVisible(true);
            setIsValid(false);
          } else {
            setIsLoading(true);
            setIsServerError(false);
            setIsServerSuccess(false);
            try {
              const response = await fetch(
                `http://localhost:8080/auth/reset/${params.token}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password: password }),
                }
              );
              if (response.status === 200) {
                setIsServerSuccess(true);
                setTimeout(() => {
                  navigate("../../login", { relative: "path" });
                }, 5000);
              } else {
                setIsServerError(true);
              }
              const resData = await response.json();
              setIsLoading(false);
              setResponseMessage(resData.message);
            } catch (err: any) {
              setIsLoading(false);
              setIsServerError(true);
              console.log(err.message);
              setResponseMessage(
                "Something went wrong. Please try again later."
              );
            }
          }
        }}
      >
        <BiArrowBack
          size="30"
          className={styles.back + " " + (isLoading && styles.disabledLink)}
          onClick={() => {
            navigate("../../login", { relative: "path" });
          }}
        />
        <h2 className={styles.title}>Set a new password</h2>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          errorPosition={RIGHT}
          isValid={isValid}
          setIsValid={setIsValid}
          errorMessage={errorMessage}
          isErrorMessageVisible={isErrorMessageVisible}
          setIsErrorMessageVisible={setIsErrorMessageVisible}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setPassword(target.value);
          }}
          onBlur={() => {
            if (!isPassword(password)) {
              setErrorMessage("Invalid password. Must be at least 10 symbols.");
              setIsValid(false);
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
      </Form>
    </AuthPage>
  );
};

export default SetNewPasswordPage;

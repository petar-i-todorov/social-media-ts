import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BouncingDotsLoader from "../../components/BouncingDotsLoader/BouncingDotsLoader";
import Button from "../../components/Button/Button";
import FormMessage from "../../components/FormMessage/FormMessage";
import Input from "../../components/Input/Input";
import { isPassword } from "../../utils/validation";
import styles from "./AuthPage.module.scss";
import { BiArrowBack } from "react-icons/bi";

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
    <div className={styles.authPage}>
      <div className={styles.mainContainer}>
        <form
          className={styles.authForm}
          onSubmit={async (event) => {
            event.preventDefault();
            if (!isPassword(password)) {
              setErrorMessage("Invalid password. Must be at least 10 symbols.");
              setIsErrorMessageVisible(true);
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
            className={styles.back}
            onClick={() => {
              navigate("../../login", { relative: "path" });
            }}
          />
          <h2>Set a new password</h2>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            errorPosition="right"
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
                setErrorMessage(
                  "Invalid password. Must be at least 10 symbols."
                );
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
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;

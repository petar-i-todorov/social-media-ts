import Button from "../Button/Button";
import styles from "./AuthForm.module.scss";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  return (
    <div className={styles.mainContainer}>
      <div className={styles.authForm}>
        <h2>Forgot your password?</h2>
        <span>Enter the email you usually use to log in to your account:</span>
        <Input
          id="reset"
          placeholder="Email"
          type="email"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setEmail(target.value);
          }}
          isValid
          value={email}
        />
        <Button
          color="green"
          onClick={async () => {
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
            console.log(response);
          }}
        >
          Submit
        </Button>
        <span>or</span>
        <Link to="../login" relative="path">
          <Button color="blue">Log in</Button>
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;

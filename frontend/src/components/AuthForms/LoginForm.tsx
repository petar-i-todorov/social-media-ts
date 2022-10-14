import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BouncingDotsLoader from "../BouncingDotsLoader/BouncingDotsLoader";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./AuthForm.module.scss";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <form
        className={styles.authForm}
        onSubmit={async (event) => {
          event.preventDefault();
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
        }}
      >
        <h2>Log in</h2>
        <Input
          id="email"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setEmail(target.value);
          }}
          type="email"
          placeholder="Email"
        />
        <Input
          id="password"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setPassword(target.value);
          }}
          type="password"
          placeholder="Password"
        />
        <Link to="../reset" relative="path">
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
        <Link to="../signup" relative="path">
          <Button color="green">Sign up</Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

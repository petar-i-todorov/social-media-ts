import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./LoginForm.module.scss";
import formStyles from "./AuthForm.module.scss";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <form
      className={styles.login + " " + formStyles.authForm}
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200 || 201) {
          const resData = await response.json();
          localStorage.setItem("token", resData.token);
          localStorage.setItem("userId", resData.userId);
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
          }, 3600000);
          navigate("..", { relative: "path" });
        } else {
          //show error component
          console.log("An error occured.");
        }
      }}
    >
      <Input
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setEmail(target.value);
        }}
        type="email"
        placeholder="Email"
        valid
      />
      <Input
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setPassword(target.value);
        }}
        type="password"
        placeholder="Password"
        valid
      />
      <Link to="../reset" relative="path">
        Forgot password?
      </Link>
      <Button color="blue">Log In</Button>
      <Link to="../signup" relative="path">
        <Button color="green">Sign up →</Button>
      </Link>
    </form>
  );
};

export default LoginForm;

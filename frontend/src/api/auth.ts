type LoginFunction = (config: {
  email: string;
  password: string;
}) => Promise<Response>;

export const login: LoginFunction = ({ email, password }) => {
  return fetch("http://localhost:8080/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

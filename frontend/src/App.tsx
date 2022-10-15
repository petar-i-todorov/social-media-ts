import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import styles from "./scss/App.module.scss";

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

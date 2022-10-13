import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

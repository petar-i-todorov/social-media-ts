import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import styles from "./scss/App.module.scss";
import SetNewPasswordPage from "./pages/Auth/SetNewPassword";
import Header from "./components/Header/Header";
import FeedPage from "./pages/Feed/Feed";
import AddPost from "./components/CreatePost/CreatePost";
import ReactDOM from "react-dom";
import { AddPostContext } from "./contexts/AddPostContext";
import { useState } from "react";
import { PostsContext } from "./contexts/PostsContext";
import { IPost } from "./types/post";

function App() {
  const [addPost, setAddPost] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  return (
    <BrowserRouter>
      <AddPostContext.Provider value={{ addPost, setAddPost }}>
        <PostsContext.Provider value={{ posts, setPosts }}>
          <div className={styles.app}>
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="reset/:token" element={<SetNewPasswordPage />} />
              <Route path="" element={<Header />}>
                <Route path="" element={<FeedPage />} />
              </Route>
            </Routes>
            {addPost &&
              ReactDOM.createPortal(
                <AddPost />,
                document.getElementById("add-product") as HTMLElement
              )}
          </div>
        </PostsContext.Provider>
      </AddPostContext.Provider>
    </BrowserRouter>
  );
}

export default App;

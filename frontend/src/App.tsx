import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./pages/Auth/ResetPassword/ResetPassword";
import LoginPage from "./pages/Auth/Login/Login";
import SignupPage from "./pages/Auth/Signup/Signup";
import styles from "./scss/App.module.scss";
import SetNewPasswordPage from "./pages/Auth/SetNewPassword/SetNewPassword";
import Header from "./components/Header/Header";
import FeedPage from "./pages/Feed/Feed";
import AddPost from "./components/CreatePost/CreatePost";
import ReactDOM from "react-dom";
import { ModalsManipulationContext } from "./contexts/ModalsManipulationContext";
import { useState } from "react";
import { PostsContext } from "./contexts/PostsContext";
import { IPost } from "./types/post";
import { PostIdContext } from "./contexts/PostIdContext";
import ConfirmationModal from "./components/ConfirmationModalBuilder/ConfirmationModalBuilder";
import ReportPost from "./components/ReportPost/ReportPost";

function App() {
  const [addPostVisibility, setAddPostVisibility] = useState(false);
  const [deletePostVisibility, setDeletePostVisibility] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postId, setPostId] = useState(""); //postId to be manipulated
  const [confirmClosingAddPostVisibility, setConfirmClosingAddPostVisibility] =
    useState(false);
  const [
    confirmClosingReportPostVisibility,
    setConfirmClosingReportPostVisibility,
  ] = useState(false);
  const [reportPostVisibility, setReportPostVisibility] = useState(false);
  return (
    <BrowserRouter>
      <PostIdContext.Provider value={{ postId, setPostId }}>
        <ModalsManipulationContext.Provider
          value={{
            addPostVisibility,
            setAddPostVisibility,
            deletePostVisibility,
            setDeletePostVisibility,
            reportPostVisibility,
            setReportPostVisibility,
          }}
        >
          <PostsContext.Provider value={{ posts, setPosts }}>
            <div className={styles.app} id="app">
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="reset/:token" element={<SetNewPasswordPage />} />
                <Route path="" element={<Header />}>
                  <Route path="" element={<FeedPage />} />
                </Route>
              </Routes>
              {reportPostVisibility &&
                ReactDOM.createPortal(
                  <ReportPost
                    setClosingConfirmationVisibility={
                      setConfirmClosingReportPostVisibility
                    }
                  />,
                  document.getElementById("modal") as HTMLElement
                )}
              {addPostVisibility &&
                ReactDOM.createPortal(
                  <AddPost
                    setClosingConfirmationVisibility={
                      setConfirmClosingAddPostVisibility
                    }
                  />,
                  document.getElementById("modal") as HTMLElement
                )}
              {deletePostVisibility &&
                ReactDOM.createPortal(
                  <ConfirmationModal
                    question="Are you sure you want to delete this post?"
                    onConfirmation={async () => {
                      try {
                        const res = await fetch(
                          `http://localhost:8080/posts/delete/${postId}`,
                          {
                            method: "DELETE",
                          }
                        );
                        const { updatedPosts } = await res.json();
                        setPosts(updatedPosts);
                        setDeletePostVisibility(false);
                      } catch (error) {
                        //todo
                      }
                    }}
                    setVisibility={setDeletePostVisibility}
                  />,
                  document.getElementById("modal") as HTMLElement
                )}
              {confirmClosingAddPostVisibility &&
                ReactDOM.createPortal(
                  <ConfirmationModal
                    question="Are you sure you want to close this modal?"
                    onConfirmation={() => {
                      setAddPostVisibility(false);
                    }}
                    setVisibility={setConfirmClosingAddPostVisibility}
                  />,
                  document.getElementById(
                    "confirm-closing-modal"
                  ) as HTMLElement
                )}
              {confirmClosingReportPostVisibility &&
                ReactDOM.createPortal(
                  <ConfirmationModal
                    question="Are you sure you want to close this modal?"
                    onConfirmation={() => {
                      setReportPostVisibility(false);
                    }}
                    setVisibility={setConfirmClosingReportPostVisibility}
                  />,
                  document.getElementById(
                    "confirm-closing-modal"
                  ) as HTMLElement
                )}
            </div>
          </PostsContext.Provider>
        </ModalsManipulationContext.Provider>
      </PostIdContext.Provider>
    </BrowserRouter>
  );
}

export default App;

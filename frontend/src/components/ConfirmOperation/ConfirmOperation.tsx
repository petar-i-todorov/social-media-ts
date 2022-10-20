import React, { useContext } from "react";
import createPostStyles from "../CreatePost/CreatePost.module.scss";
import formStyles from "../../scss/Form.module.scss";
import Button from "../Button/Button";
import styles from "./ConfirmOperation.module.scss";
import { PostsContext } from "../../contexts/PostsContext";
import { DeletePostContext } from "../../contexts/DeletePostContext";

const ConfirmOperation: React.FC<{ postId: string }> = ({ postId }) => {
  const { setPosts } = useContext(PostsContext);
  const { setDeletePost } = useContext(DeletePostContext);
  return (
    <div
      className={createPostStyles.overlay}
      onClick={() => {
        setDeletePost(false);
      }}
    >
      <div
        className={
          formStyles.mainContainer + " " + createPostStyles.nonAnimated
        }
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={formStyles.form}>
          <h2>Are you sure you want to delete this post?</h2>
          <div className={styles.btnsContainer}>
            <Button
              color="red"
              onClick={() => {
                setDeletePost(false);
              }}
            >
              Actually, no
            </Button>
            <Button
              color="green"
              onClick={async (event) => {
                event.preventDefault();
                try {
                  const res = await fetch(
                    `http://localhost:8080/posts/delete/${postId}`,
                    {
                      method: "DELETE",
                    }
                  );
                  const { updatedPosts } = await res.json();
                  setPosts(updatedPosts);
                } catch (error) {}
              }}
            >
              Yes, of course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOperation;

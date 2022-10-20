import React, { useContext } from "react";
import createPostStyles from "../CreatePost/CreatePost.module.scss";
import formStyles from "../../scss/Form.module.scss";
import Button from "../Button/Button";
import { MdDelete } from "react-icons/md";
import styles from "./ConfirmOperation.module.scss";
import { PostsContext } from "../../contexts/PostsContext";

const ConfirmOperation: React.FC<{ postId: string }> = ({ postId }) => {
  const { setPosts } = useContext(PostsContext);
  return (
    <div className={createPostStyles.overlay}>
      <div
        className={
          formStyles.mainContainer + " " + createPostStyles.nonAnimated
        }
      >
        <div className={formStyles.form}>
          <h2>Confirm</h2>
          <Button
            color="blue"
            onClick={async (event) => {
              event.preventDefault();
              const res = await fetch(
                `http://localhost:8080/posts/delete/${postId}`,
                {
                  method: "DELETE",
                }
              );
              const { message, updatedPosts } = await res.json();
              setPosts(updatedPosts);
            }}
          >
            <div className={styles.btnContent}>
              Delete post
              <MdDelete size="17" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOperation;

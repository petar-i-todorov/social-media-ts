import React, { useContext } from "react";
import { PostsContext } from "../../contexts/PostsContext";
import { DeletePostContext } from "../../contexts/DeletePostContext";
import Confirm from "./ConfirmationModal";

const DeletePost: React.FC<{ postId: string }> = ({ postId }) => {
  const { setPosts } = useContext(PostsContext);
  const { setDeletePost } = useContext(DeletePostContext);
  return (
    <Confirm
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
          setDeletePost(false);
        } catch (error) {}
      }}
      setConfirmModal={setDeletePost}
    />
  );
};

export default DeletePost;

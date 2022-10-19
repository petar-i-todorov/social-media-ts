import React, { useContext, useEffect, useState } from "react";
import { PostsContext } from "../../contexts/PostsContext";
import Button from "../Button/Button";
import styles from "./Post.module.scss";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiRedditFill,
  RiStackOverflowFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { SiUdemy } from "react-icons/si";
import { BsThreeDots } from "react-icons/bs";
import MoreOptionsMenu from "../MoreOptionsMenu/MoreOptionsMenu";

const Post: React.FC<{
  id: string;
  title: string;
  description: string;
  platform:
    | "YOUTUBE"
    | "STACKOVERFLOW"
    | "UDEMY"
    | "GITHUB"
    | "LINKEDIN"
    | "REDDIT"
    | "FACEBOOK"
    | "OTHER";
  upvotes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  isFlashMessage: boolean;
  setIsFlashMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setFlashMessageText: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  title,
  description,
  platform,
  upvotes,
  id,
  upvotedBy,
  downvotedBy,
  isFlashMessage,
  setIsFlashMessage,
  setFlashMessageText,
}) => {
  const { setPosts } = useContext(PostsContext);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  const [moreOptionsVisibility, setMoreOptionsVisibility] = useState(false);
  useEffect(() => {
    if (upvotedBy.find((userId) => userId === localStorage.getItem("userId"))) {
      setIsUpvoteLocked(true);
    } else {
      setIsUpvoteLocked(false);
    }
    if (
      downvotedBy.find((userId) => userId === localStorage.getItem("userId"))
    ) {
      setIsDownvoteLocked(true);
    } else {
      setIsDownvoteLocked(false);
    }
  }, [upvotedBy, downvotedBy]);
  return (
    <div className={styles.post}>
      <div className={styles.voteContainer}>
        <Button
          color="green"
          className={
            styles.voteBtn + " " + (isUpvoteLocked && styles.greenLocked)
          }
          isLocked={isUpvoteLocked}
          onClick={async () => {
            const response = await fetch(
              `http://localhost:8080/posts/upvote/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postId: id,
                  userId: localStorage.getItem("userId"),
                }),
              }
            );
            const resData = await response.json();
            if (response.status === 200) {
              setPosts(resData.updatedPosts);
            } else if (!isFlashMessage) {
              setFlashMessageText(resData.message);
              setIsFlashMessage(true);
              setTimeout(() => {
                setIsFlashMessage(false);
              }, 5000);
            }
          }}
        >
          +
        </Button>
        <span className={styles.votesQty}>{upvotes}</span>
        <Button
          isLocked={isDownvoteLocked}
          color="red"
          className={
            styles.voteBtn + " " + (isUpvoteLocked && styles.redLocked)
          }
          onClick={async () => {
            const response = await fetch(
              `http://localhost:8080/posts/downvote/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postId: id,
                  userId: localStorage.getItem("userId"),
                }),
              }
            );
            const resData = await response.json();
            if (response.status === 200) {
              setPosts(resData.updatedPosts);
            } else if (!isFlashMessage) {
              setFlashMessageText(resData.message);
              setIsFlashMessage(true);
              setTimeout(() => {
                setIsFlashMessage(false);
              }, 5000);
            }
          }}
        >
          -
        </Button>
      </div>
      <div className={styles.postInfo}>
        <h2>{title}</h2>
        <hr />
        <p>{description}</p>
      </div>
      <div className={styles.postSidebar}>
        <div className={styles.moreOptionsContainer}>
          <BsThreeDots
            size="30"
            color="gray"
            className={styles.threeDots}
            onClick={() => {
              if (!moreOptionsVisibility) {
                setMoreOptionsVisibility(true);
              } else {
                setMoreOptionsVisibility(false);
              }
            }}
          />
          {moreOptionsVisibility && <MoreOptionsMenu />}
        </div>
        {platform === "UDEMY" ? (
          <SiUdemy size="60" color="purple" />
        ) : platform === "STACKOVERFLOW" ? (
          <RiStackOverflowFill size="60" color="orange" />
        ) : platform === "GITHUB" ? (
          <RiGithubFill size="60" color="orange" />
        ) : platform === "YOUTUBE" ? (
          <RiYoutubeFill size="60" color="red" />
        ) : platform === "REDDIT" ? (
          <RiRedditFill size="60" color="red" />
        ) : platform === "LINKEDIN" ? (
          <RiLinkedinBoxFill size="60" color="blue" />
        ) : (
          <span className={styles.other}>OTHER</span>
        )}
      </div>
    </div>
  );
};

export default Post;

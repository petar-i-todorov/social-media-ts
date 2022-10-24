import React, { useContext, useEffect, useRef, useState } from "react";
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
  creatorId: string;
  creatorName: string;
  createdAt: Date;
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
  creatorId,
  creatorName,
  createdAt,
}) => {
  const { setPosts } = useContext(PostsContext);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  const [moreOptionsVisibility, setMoreOptionsVisibility] = useState(false);
  const isAuthor = useRef(creatorId === localStorage.getItem("userId"));
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
  const [showMoreVisibility, setShowMoreVisibility] = useState(
    description.length > 250
  );
  return (
    <div
      className={styles.post}
      onClick={() => setMoreOptionsVisibility(false)}
    >
      <div className={styles.postHeader}>
        <p>{`Created by ${creatorName} on ${new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
          hour: "2-digit",
          hour12: true,
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(createdAt))}`}</p>
        <div className={styles.moreOptionsContainer}>
          <BsThreeDots
            size="30"
            color="gray"
            className={styles.threeDots}
            onClick={(event) => {
              event.stopPropagation();
              if (!moreOptionsVisibility) {
                setMoreOptionsVisibility(true);
              } else {
                setMoreOptionsVisibility(false);
              }
            }}
          />
          {moreOptionsVisibility && (
            <MoreOptionsMenu isAuthor={isAuthor.current} postId={id} />
          )}
        </div>
      </div>
      <hr />
      <div className={styles.postContent}>
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
          <div className={styles.postDescritpion}>
            <p>
              {showMoreVisibility ? description.substring(0, 250) : description}{" "}
              {showMoreVisibility && (
                <span
                  className={styles.showMore}
                  onClick={() => {
                    setShowMoreVisibility(false);
                  }}
                >
                  Show More
                </span>
              )}
            </p>
          </div>
        </div>
        <div className={styles.postSidebar}>
          {platform === "UDEMY" ? (
            <SiUdemy size="60" color="purple" />
          ) : platform === "STACKOVERFLOW" ? (
            <RiStackOverflowFill size="60" color="orange" />
          ) : platform === "GITHUB" ? (
            <RiGithubFill size="60" color="black" />
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
    </div>
  );
};

export default Post;

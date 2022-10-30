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
import { sortAndSetPosts } from "../../utils/feed";
import { IoSend } from "react-icons/io5";
import Comment from "../Comment/Comment";
import ReactTimeAgo from "react-time-ago";
import { FaUserCircle } from "react-icons/fa";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { Link } from "react-router-dom";

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
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  comments: {
    _id: string;
    likedBy: string[];
    dislikedBy: string[];
    totalVotes: number;
    creator: { name: string };
    text: string;
    createdAt: Date;
  }[];
}> = ({
  title,
  description,
  platform,
  upvotes,
  id,
  upvotedBy,
  downvotedBy,
  creatorId,
  creatorName,
  createdAt,
  comments,
}) => {
  const {
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
    isFeedFlashMessage,
  } = useContext(FlashMessageContext);
  const [areCommentsVisible, setAreCommentsVisible] = useState(false);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  const [moreOptionsVisibility, setMoreOptionsVisibility] = useState(false);
  const isAuthor = useRef(creatorId === localStorage.getItem("userId"));
  const [commentText, setCommentText] = useState("");
  const { setPosts, sortBy } = useContext(PostsContext);
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
        <p>
          <span>Posted by </span>
          <Link to={"user/" + creatorId}>{creatorName} </Link>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </p>
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
                sortAndSetPosts(resData.updatedPosts, setPosts, sortBy);
              } else if (!isFeedFlashMessage) {
                setFeedFlashMessageConfiguration({
                  text: resData.message,
                  color: "red",
                });
                setIsFeedFlashMessage(true);
                setTimeout(() => {
                  setIsFeedFlashMessage(false);
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
                sortAndSetPosts(resData.updatedPosts, setPosts, sortBy);
              } else if (!isFeedFlashMessage) {
                setFeedFlashMessageConfiguration({
                  text: resData.message,
                  color: "red",
                });
                setIsFeedFlashMessage(true);
                setTimeout(() => {
                  setIsFeedFlashMessage(false);
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
      <hr />
      <section className={styles.writeComment}>
        <FaUserCircle size="35" />
        <input
          className={styles.commentInput}
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onKeyUp={async (event) => {
            if (event.key === "Enter") {
              if (commentText.length > 0) {
                const res = await fetch(
                  `http://localhost:8080/posts/addComment/${id}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      text: commentText,
                      creatorId: localStorage.getItem("userId"),
                    }),
                  }
                );
                setCommentText("");
                if (res.status === 200 || res.status === 201) {
                  const resData = await res.json();
                  sortAndSetPosts(resData.updatedPosts, setPosts, sortBy);
                } else {
                  setIsFeedFlashMessage(true);
                  setFeedFlashMessageConfiguration({
                    text: "Something went wrong. Please, try again later.",
                    color: "red",
                  });
                  setTimeout(() => {
                    setIsFeedFlashMessage(false);
                  }, 5000);
                }
              }
            }
          }}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setCommentText(target.value);
          }}
        />
        <div className={styles.send}>
          <IoSend size="35" color="lightblue" />
        </div>
      </section>
      {comments.length ? (
        <div className={styles.showComments}>
          <span
            onClick={() => {
              setAreCommentsVisible(!areCommentsVisible);
            }}
          >
            {!areCommentsVisible
              ? `Show comments (${comments.length})`
              : "Hide comments"}
          </span>
        </div>
      ) : (
        ""
      )}
      {areCommentsVisible && (
        <section className={styles.comments}>
          {comments.map((comment) => {
            return <Comment comment={comment} key={comment._id} />;
          })}
        </section>
      )}
    </div>
  );
};

export default Post;

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
import { IoSend } from "react-icons/io5";
import Comment from "../Comment/Comment";
import ReactTimeAgo from "react-time-ago";
import { FaUserCircle } from "react-icons/fa";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { Link } from "react-router-dom";
import { IPost } from "../../types/feed";

const Post: React.FC<{
  post: IPost;
  observer?: IntersectionObserver;
  userAvatar: string;
}> = ({ post, observer, userAvatar }) => {
  const [postObj, setPostObj] = useState<IPost>(post);
  const postRef = useRef(null);
  useEffect(() => {
    if (observer && postRef.current) {
      observer.observe(postRef.current);
    }
    setPostObj(post);
  }, [post]);
  const {
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
    activeFlashTimeout,
    setActiveFlashTimeout,
  } = useContext(FlashMessageContext);
  const [areCommentsVisible, setAreCommentsVisible] = useState(false);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  const [moreOptionsVisibility, setMoreOptionsVisibility] = useState(false);
  const isAuthor = useRef(
    postObj.creator._id === localStorage.getItem("userId")
  );
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    if (
      postObj.upvotedBy.find(
        (userId) => userId === localStorage.getItem("userId")
      )
    ) {
      setIsUpvoteLocked(true);
    } else {
      setIsUpvoteLocked(false);
    }
    if (
      postObj.downvotedBy.find(
        (userId) => userId === localStorage.getItem("userId")
      )
    ) {
      setIsDownvoteLocked(true);
    } else {
      setIsDownvoteLocked(false);
    }
  }, [postObj.upvotedBy, postObj.downvotedBy]);
  const [showMoreVisibility, setShowMoreVisibility] = useState(
    postObj.description.length > 250
  );
  return (
    <div
      ref={postRef}
      className={styles.post}
      onClick={() => setMoreOptionsVisibility(false)}
    >
      <div className={styles.postHeader}>
        <div className={styles.headerText}>
          <span>Posted by </span>
          <Link to={"/user/" + postObj.creator._id}>
            {postObj.creator.name}
          </Link>{" "}
          <ReactTimeAgo date={new Date(postObj.createdAt)} locale="en-US" />
        </div>
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
            <MoreOptionsMenu isAuthor={isAuthor.current} postId={postObj._id} />
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
                `http://localhost:8080/posts/upvote/${postObj._id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    postId: postObj._id,
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              const resData = await response.json();
              if (response.status === 200) {
                setPostObj(resData.updatedPost);
              } else {
                setFeedFlashMessageConfiguration({
                  text: resData.message,
                  color: "red",
                });
                setIsFeedFlashMessage(true);
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
              }
            }}
          >
            +
          </Button>
          <span className={styles.votesQty}>{postObj.upvotes}</span>
          <Button
            isLocked={isDownvoteLocked}
            color="red"
            className={
              styles.voteBtn + " " + (isUpvoteLocked && styles.redLocked)
            }
            onClick={async () => {
              const response = await fetch(
                `http://localhost:8080/posts/downvote/${postObj._id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    postId: postObj._id,
                    userId: localStorage.getItem("userId"),
                  }),
                }
              );
              const resData = await response.json();
              if (response.status === 200) {
                setPostObj(resData.updatedPost);
              } else {
                setFeedFlashMessageConfiguration({
                  text: resData.message,
                  color: "red",
                });
                setIsFeedFlashMessage(true);
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
              }
            }}
          >
            -
          </Button>
        </div>
        <div className={styles.postInfo}>
          <h2>{postObj.title}</h2>
          <div className={styles.postDescritpion}>
            <p>
              {showMoreVisibility
                ? postObj.description.substring(0, 250)
                : postObj.description}{" "}
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
          {postObj.platform === "UDEMY" ? (
            <SiUdemy size="60" color="purple" />
          ) : postObj.platform === "STACKOVERFLOW" ? (
            <RiStackOverflowFill size="60" color="orange" />
          ) : postObj.platform === "GITHUB" ? (
            <RiGithubFill size="60" color="black" />
          ) : postObj.platform === "YOUTUBE" ? (
            <RiYoutubeFill size="60" color="red" />
          ) : postObj.platform === "REDDIT" ? (
            <RiRedditFill size="60" color="red" />
          ) : postObj.platform === "LINKEDIN" ? (
            <RiLinkedinBoxFill size="60" color="blue" />
          ) : (
            <span className={styles.other}>OTHER</span>
          )}
        </div>
      </div>
      {localStorage.getItem("userId") && (
        <>
          <hr />
          <section className={styles.writeComment}>
            <Link to={`/user/${localStorage.getItem("userId")}`}>
              {userAvatar ? (
                <img
                  src={`http://localhost:8080/${userAvatar}`}
                  width="35"
                  height="35"
                  className={styles.userAvatar}
                />
              ) : (
                <FaUserCircle size="35" />
              )}
            </Link>
            <input
              className={styles.commentInput}
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onKeyUp={async (event) => {
                if (event.key === "Enter") {
                  if (commentText.length > 0) {
                    const res = await fetch(
                      `http://localhost:8080/posts/addComment/${postObj._id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
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
                      setPostObj(resData.updatedPost);
                    } else {
                      setIsFeedFlashMessage(true);
                      setFeedFlashMessageConfiguration({
                        text: "Something went wrong. Please, try again later.",
                        color: "red",
                      });
                      clearTimeout(activeFlashTimeout);
                      const timeout = setTimeout(() => {
                        setIsFeedFlashMessage(false);
                      }, 5000);
                      setActiveFlashTimeout(timeout);
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
        </>
      )}
      {postObj.comments.length ? (
        <div className={styles.showComments}>
          <span
            onClick={() => {
              setAreCommentsVisible(!areCommentsVisible);
            }}
          >
            {!areCommentsVisible
              ? `Show comments (${postObj.comments.length})`
              : "Hide comments"}
          </span>
        </div>
      ) : null}
      {areCommentsVisible && (
        <section className={styles.comments}>
          {postObj.comments.map((comment) => {
            return <Comment comment={comment} key={comment._id} />;
          })}
        </section>
      )}
    </div>
  );
};

export default Post;

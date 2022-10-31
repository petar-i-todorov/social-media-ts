import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { IComment, IPost } from "../../types/feed";
import styles from "./User.module.scss";
import { TbEdit } from "react-icons/tb";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import BouncingDotsLoader from "../../components/BouncingDotsLoader/BouncingDotsLoader";
import UserSkeleton from "./UserSkeleton";
import PostSkeleton from "../../components/Post/PostSkeleton";

const User = () => {
  const firstFetching = useRef(true);
  const [quote, setQuote] = useState("");
  const [user, setUser] = useState<any>();
  const params = useParams();
  const { posts } = useContext(PostsContext);
  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    useContext(FlashMessageContext);
  const [updateQuoteMode, setUpdateQuoteMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      firstFetching.current && setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/users/${params.userId}`
      );
      if (response.status === 200) {
        const resData = await response.json();
        firstFetching.current &&
          (() => {
            setIsLoading(false);
            firstFetching.current = false;
          })();
        setUser(resData.user);
        setQuote(resData.user.quote);
      } else {
        firstFetching.current &&
          (() => {
            setIsLoading(false);
            firstFetching.current = false;
          })();
        setFeedFlashMessageConfiguration({
          text: "Something went wrong. Please, try again later.",
          color: "red",
        });
        setIsFeedFlashMessage(true);
        setTimeout(() => {
          setIsFeedFlashMessage(false);
        }, 5000);
      }
    };
    fetchUser();
  }, [
    posts,
    params.userId,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
  ]); //w skeleton - first render
  return (
    <div className={styles.userPage}>
      {isLoading ? (
        <>
          <UserSkeleton />
          <div className={styles.skeletonsContainer}>
            Recent Activity
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </>
      ) : user ? (
        <>
          <header className={styles.pageHeader}>
            <span className={styles.userName}>{user.name}</span>
          </header>
          <section
            className={styles.userInfo}
            onClick={() => {
              setUpdateQuoteMode(false);
            }}
          >
            <TbEdit
              className={styles.editIcon}
              size="25"
              onClick={(event) => {
                event.stopPropagation();
                setUpdateQuoteMode((state) => !state);
              }}
            />
            <FaCircle size="150" color="gray" className={styles.userAvatar} />
            <div className={styles.userQuote}>
              {updateQuoteMode ? (
                <>
                  <TextArea
                    className={styles.editArea}
                    label=""
                    isValid={true}
                    value={quote}
                    onChange={(event: ChangeEvent) => {
                      setQuote((event.target as HTMLTextAreaElement).value);
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  />
                  <Button
                    color="blue"
                    children={
                      isUpdating ? (
                        <BouncingDotsLoader text="Updating" />
                      ) : (
                        "Update"
                      )
                    }
                    onClick={async (event) => {
                      event.stopPropagation();
                      setIsUpdating(true);
                      const res = await fetch(
                        `http://localhost:8080/users/${user._id}/updateQuote`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ quote: quote }),
                        }
                      );
                      if (res.status !== 200) {
                        setUpdateQuoteMode(false);
                        setIsUpdating(false);
                        setFeedFlashMessageConfiguration({
                          text: "Something went wrong. Please, try again later.",
                          color: "red",
                        });
                        setIsFeedFlashMessage(true);
                        setTimeout(() => {
                          setIsFeedFlashMessage(false);
                        }, 5000);
                      } else {
                        const resData = await res.json();
                        setUser(resData.updatedUser);
                        setUpdateQuoteMode(false);
                        setIsUpdating(false);
                        setFeedFlashMessageConfiguration({
                          text: "Quote was successfully updated.",
                          color: "green",
                        });
                        setIsFeedFlashMessage(true);
                        setTimeout(() => {
                          setIsFeedFlashMessage(false);
                        }, 5000);
                      }
                    }}
                  />
                </>
              ) : user.quote ? (
                user.quote
              ) : null}
            </div>
          </section>
          <main className={styles.posts}>
            <span>Recent activity</span>
            {user.posts.map((post: IPost) => {
              return (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  description={post.description}
                  platform={post.platform}
                  upvotes={post.upvotes}
                  upvotedBy={post.upvotedBy}
                  downvotedBy={post.downvotedBy}
                  creatorId={user._id}
                  creatorName={user.name}
                  createdAt={post.createdAt}
                  comments={post.comments.map((comment: IComment) => {
                    return {
                      _id: comment._id,
                      totalVotes: comment.totalVotes,
                      creator: { name: comment.creator.name },
                      text: comment.text,
                      createdAt: comment.createdAt,
                      likedBy: comment.votes
                        .filter((vote) => {
                          return vote.isLike;
                        })
                        .map((vote) => {
                          return vote.user;
                        }),
                      dislikedBy: comment.votes
                        .filter((vote) => {
                          return !vote.isLike;
                        })
                        .map((vote) => {
                          return vote.user;
                        }),
                    };
                  })}
                />
              );
            })}
          </main>
        </>
      ) : (
        <h1>Something went wrong.</h1>
      )}
    </div>
  );
};

export default User;

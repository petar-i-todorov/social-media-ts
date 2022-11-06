import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { IPost } from "../../types/feed";
import styles from "./User.module.scss";
import { TbEdit } from "react-icons/tb";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import BouncingDotsLoader from "../../components/BouncingDotsLoader/BouncingDotsLoader";
import UserSkeleton from "./UserSkeleton";
import PostSkeleton from "../../components/Post/PostSkeleton";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import { MdPhotoCamera } from "react-icons/md";

const User: React.FC<{ userAvatar: string }> = ({ userAvatar }) => {
  const postsPerPage = useRef(10);
  const firstFetching = useRef(true);
  const [quote, setQuote] = useState("");
  const [user, setUser] = useState<any>();
  const params = useParams();
  const { posts } = useContext(PostsContext);
  const {
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    activeFlashTimeout,
    setActiveFlashTimeout,
    setIsLoader,
  } = useContext(FlashMessageContext);
  const [updateQuoteMode, setUpdateQuoteMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postsCount, setPostsCount] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      !firstFetching.current && setIsLoader(true); //just show loader (for example on post editing)
      firstFetching.current && setIsLoading(true); //with skeleton - first render
      const response = await fetch(
        `http://localhost:8080/users/${params.userId}`
      );
      if (response.status === 200) {
        const resData = await response.json();
        !firstFetching.current && setIsLoader(false);
        firstFetching.current &&
          (() => {
            setIsLoading(false);
            firstFetching.current = false;
          })();
        setUser(resData.user);
        setQuote(resData.user.quote);
        setPostsCount(resData.postsCount);
        if (postsCount && resData.postsCount % postsPerPage.current === 0) {
          setCurrentPage((page) => page - 1);
        }
        setFetchedPosts(resData.user.posts);
      } else {
        !firstFetching.current && setIsLoader(false);
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
        clearTimeout(activeFlashTimeout);
        const timeout = setTimeout(() => {
          setIsFeedFlashMessage(false);
        }, 5000);
        setActiveFlashTimeout(timeout);
      }
    };
    fetchUser();
  }, [posts, params.userId]);
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
            {localStorage.getItem("userId") === user._id ? (
              <>
                <TbEdit
                  className={styles.editIcon}
                  size="25"
                  onClick={(event) => {
                    event.stopPropagation();
                    setUpdateQuoteMode((state) => !state);
                  }}
                />
                <label htmlFor="avatar">
                  <MdPhotoCamera size="25" className={styles.uploadLogo} />
                  {user.avatarUrl ? (
                    <img
                      src={`http://localhost:8080/${user.avatarUrl}`}
                      width="150"
                      height="150"
                      className={styles.userAvatar}
                    />
                  ) : (
                    <FaCircle
                      size="150"
                      color="gray"
                      className={styles.userAvatar}
                    />
                  )}
                </label>
              </>
            ) : user.avatarUrl ? (
              <img
                src={`http://localhost:8080/${user.avatarUrl}`}
                width="150"
                height="150"
                className={styles.userAvatar}
              />
            ) : (
              <FaCircle size="150" color="gray" className={styles.userAvatar} />
            )}
            <input
              type="file"
              id="avatar"
              className={styles.avatarInput}
              onChange={async (event) => {
                if (event.target.files) {
                  const formData = new FormData();
                  formData.append("avatar", event.target.files[0]);
                  try {
                    const response = await fetch(
                      `http://localhost:8080/users/${user._id}/updateAvatar`,
                      {
                        method: "PATCH",
                        body: formData,
                        headers: {
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
                        },
                      }
                    );
                    if (response.status === 200) {
                      const { updatedUser } = await response.json();
                      setUser(updatedUser);
                    } else if (response.status === 422) {
                      setFeedFlashMessageConfiguration({
                        text: "Please, check the file format of the avatar you're trying to upload. The only allowed formats are png, jpg and jpeg.",
                        color: "red",
                      });
                      setIsFeedFlashMessage(true);
                      clearTimeout(activeFlashTimeout);
                      const timeout = setTimeout(() => {
                        setIsFeedFlashMessage(false);
                      }, 5000);
                      setActiveFlashTimeout(timeout);
                    } else {
                      setFeedFlashMessageConfiguration({
                        text: "Something went wrong. Please, try again later",
                        color: "red",
                      });
                      setIsFeedFlashMessage(true);
                      clearTimeout(activeFlashTimeout);
                      const timeout = setTimeout(() => {
                        setIsFeedFlashMessage(false);
                      }, 5000);
                      setActiveFlashTimeout(timeout);
                    }
                  } catch (err) {
                    setFeedFlashMessageConfiguration({
                      text: "Something went wrong. Please, try again later.",
                      color: "red",
                    });
                    setIsFeedFlashMessage(true);
                    clearTimeout(activeFlashTimeout);
                    const timeout = setTimeout(() => {
                      setIsFeedFlashMessage(false);
                    }, 5000);
                    setActiveFlashTimeout(timeout);
                  }
                }
              }}
            />
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
                            Authorization:
                              "Bearer " + localStorage.getItem("token"),
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
                        clearTimeout(activeFlashTimeout);
                        const timeout = setTimeout(() => {
                          setIsFeedFlashMessage(false);
                        }, 5000);
                        setActiveFlashTimeout(timeout);
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
                        clearTimeout(activeFlashTimeout);
                        const timeout = setTimeout(() => {
                          setIsFeedFlashMessage(false);
                        }, 5000);
                        setActiveFlashTimeout(timeout);
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
            {fetchedPosts.map((post: IPost) => {
              return (
                <Post key={post._id} post={post} userAvatar={userAvatar} />
              );
            })}
            <section className={styles.pagination}>
              <Button
                isLocked={!(currentPage > 1)}
                color="green"
                children={<AiOutlineLeft />}
                onClick={async () => {
                  if (!(currentPage > 1)) {
                    setFeedFlashMessageConfiguration({
                      text:
                        localStorage.getItem("userId") === user._id
                          ? "You are already staring at the first page of your posts, dummy."
                          : "You are already staring at the first page of this user's posts, dummy.",
                      color: "red",
                    });
                    setIsFeedFlashMessage(true);
                    clearTimeout(activeFlashTimeout);
                    const timeout = setTimeout(() => {
                      setIsFeedFlashMessage(false);
                    }, 5000);
                    setActiveFlashTimeout(timeout);
                  } else {
                    const res = await fetch(
                      `http://localhost:8080/users/${user._id}/posts/?page=${
                        currentPage - 1
                      }`
                    );
                    if (res.status === 200) {
                      const resData = await res.json();
                      setCurrentPage((page) => page - 1);
                      setFetchedPosts(resData.posts);
                    } else {
                      setFeedFlashMessageConfiguration({
                        text: "Something went wrong.",
                        color: "red",
                      });
                      setIsFeedFlashMessage(true);
                      clearTimeout(activeFlashTimeout);
                      const timeout = setTimeout(() => {
                        setIsFeedFlashMessage(false);
                      }, 5000);
                      setActiveFlashTimeout(timeout);
                    }
                  }
                }}
              />
              <span className={styles.currentPage}>{currentPage}</span>
              <Button
                isLocked={
                  !(
                    postsCount &&
                    postsCount > currentPage * postsPerPage.current
                  )
                }
                color="green"
                onClick={async () => {
                  if (
                    !(
                      postsCount &&
                      postsCount > currentPage * postsPerPage.current
                    )
                  ) {
                    setFeedFlashMessageConfiguration({
                      text:
                        localStorage.getItem("userId") === user._id
                          ? "You have no more posts."
                          : "This user has no more posts.",
                      color: "red",
                    });
                    setIsFeedFlashMessage(true);
                    clearTimeout(activeFlashTimeout);
                    const timeout = setTimeout(() => {
                      setIsFeedFlashMessage(false);
                    }, 5000);
                    setActiveFlashTimeout(timeout);
                  } else {
                    const res = await fetch(
                      `http://localhost:8080/users/${user._id}/posts/?page=${
                        currentPage + 1
                      }`
                    );
                    if (res.status === 200) {
                      const resData = await res.json();
                      setCurrentPage((page) => page + 1);
                      setFetchedPosts(resData.posts);
                    } else {
                      setFeedFlashMessageConfiguration({
                        text: "Something went wrong.",
                        color: "red",
                      });
                    }
                  }
                }}
                children={<AiOutlineRight />}
              />
            </section>
          </main>
        </>
      ) : (
        <h1>Something went wrong.</h1>
      )}
    </div>
  );
};

export default User;

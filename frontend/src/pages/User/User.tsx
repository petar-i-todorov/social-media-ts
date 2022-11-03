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
  const [postsCount, setPostsCount] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      firstFetching.current && setIsLoading(true); //with skeleton - first render
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
        setPostsCount(resData.postsCount);
        console.log(resData.postsCount);
        setFetchedPosts(resData.user.posts);
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
  }, [posts]);
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
            {fetchedPosts.map((post: IPost) => {
              return <Post key={post._id} post={post} />;
            })}
            <section className={styles.pagination}>
              {currentPage > 1 ? (
                <Button
                  color="green"
                  children={<AiOutlineLeft />}
                  onClick={async () => {
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
                    }
                  }}
                />
              ) : null}
              {postsCount && postsCount > 2 ? (
                <Button color="blue" children={currentPage.toString()} />
              ) : null}
              {postsCount && postsCount > currentPage * 2 ? (
                <Button
                  color="green"
                  onClick={async () => {
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
                  }}
                  children={<AiOutlineRight />}
                />
              ) : null}
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

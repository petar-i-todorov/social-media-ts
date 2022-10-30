import { useContext, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { PostsContext } from "../../contexts/PostsContext";
import { IComment, IPost } from "../../types/feed";
import styles from "./User.module.scss";

const User = () => {
  const [user, setUser] = useState<any>();
  const params = useParams();
  const { posts } = useContext(PostsContext);
  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    useContext(FlashMessageContext);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8080/users/${params.userId}`
      );
      if (response.status === 200) {
        const resData = await response.json();
        setUser(resData.user);
      } else {
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
      {user ? (
        <>
          <header className={styles.pageHeader}>
            <span className={styles.userName}>{user.name}</span>
          </header>
          <section className={styles.userInfo}>
            <FaCircle size="150" color="gray" className={styles.userAvatar} />
            <div className={styles.userQuote}>
              Hey. I'm a Fullstack webdev who wants to improve =)
            </div>
            {/* {user.quote ? (
            ) : null} */}
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
                  creatorId={post.creator._id}
                  creatorName={post.creator.name}
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

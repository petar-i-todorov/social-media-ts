import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import Button from "../Button/Button";
import styles from "./Post.module.scss";
import { IoSend } from "react-icons/io5";
import Comment from "../Comment/Comment";
import { IPost } from "../../types/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { defaultFlashMessageConfig } from "../../constants/feed";
import { commentPost, downvotePost, upvotePost } from "../../api/posts";
import Avatar from "../Avatar/Avatar";
import MoreOptions from "../MoreOptions/MoreOptions";
import SourcePlatform from "../SourcePlatform/SourcePlatform";

interface PostProps {
  post: IPost;
  observer?: IntersectionObserver;
  userAvatar: string | undefined;
}

const Post: FC<PostProps> = ({ post, observer, userAvatar }) => {
  const { isDarkMode } = useContext(SwitchThemeContext);
  const { setIsFeedFlashMessage, setFeedFlashMessageConfiguration } =
    useContext(FlashMessageContext);

  const [postObj, setPostObj] = useState<IPost>(post);
  const [showMoreVisibility, setShowMoreVisibility] = useState(
    postObj.description.length > 250
  );
  const [areCommentsVisible, setAreCommentsVisible] = useState(false);
  const [isUpvoteLocked, setIsUpvoteLocked] = useState(false);
  const [isDownvoteLocked, setIsDownvoteLocked] = useState(false);
  const [moreOptionsVisibility, setMoreOptionsVisibility] = useState(false);
  const [commentText, setCommentText] = useState("");

  const postRef = useRef(null);

  const onUpvoteClick = useCallback(async () => {
    const response = await upvotePost(postObj._id);
    const resData = await response.json();
    if (response.status === 200) {
      setPostObj(resData.updatedPost);
    } else {
      setFeedFlashMessageConfiguration({
        text: resData.message,
        color: "red",
      });
      setIsFeedFlashMessage(true);
    }
  }, [postObj._id, setFeedFlashMessageConfiguration, setIsFeedFlashMessage]);

  const onDownvoteClick = useCallback(async () => {
    const response = await downvotePost(postObj._id);
    const resData = await response.json();
    if (response.status === 200) {
      setPostObj(resData.updatedPost);
    } else {
      setFeedFlashMessageConfiguration({
        text: resData.message,
        color: "red",
      });
      setIsFeedFlashMessage(true);
    }
  }, [postObj._id, setFeedFlashMessageConfiguration, setIsFeedFlashMessage]);

  useEffect(() => {
    if (observer && postRef.current) {
      observer.observe(postRef.current);
    }
    setPostObj(post);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

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

  const writeCommentHandler = async () => {
    if (commentText.length > 0) {
      const res = await commentPost({
        postId: postObj._id,
        comment: commentText,
      });
      setCommentText("");
      if (res.status === 200 || res.status === 201) {
        const resData = await res.json();
        setPostObj(resData.updatedPost);
        !areCommentsVisible && setAreCommentsVisible(true);
      } else {
        setIsFeedFlashMessage(true);
        setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
      }
    }
  };

  return (
    <div
      ref={postRef}
      className={`${styles.post} ${isDarkMode && styles.darkMode}`}
      onClick={() => setMoreOptionsVisibility(false)}
    >
      <div className={styles.postHeader}>
        <div className={styles.headerText}>
          <span>Posted by </span>
          <Link
            to={"/user/" + postObj.creator._id}
            className={(isDarkMode && styles.darkMode) || undefined}
          >
            {postObj.creator.name}
          </Link>{" "}
          <ReactTimeAgo date={new Date(postObj.createdAt)} locale="en-US" />
        </div>
        <MoreOptions
          moreOptionsVisibility={moreOptionsVisibility}
          setMoreOptionsVisibility={setMoreOptionsVisibility}
          post={postObj}
        />
      </div>
      <hr className={isDarkMode ? styles.darkMode : undefined} />
      <div className={styles.postContent}>
        <div className={styles.voteContainer}>
          <Button
            color="green"
            className={`${styles.voteBtn} ${
              isUpvoteLocked && styles.greenLocked
            }`}
            isLocked={isUpvoteLocked}
            onClick={onUpvoteClick}
          >
            +
          </Button>
          <span className={styles.votesQty}>{postObj.upvotes}</span>
          <Button
            isLocked={isDownvoteLocked}
            color="red"
            className={`${styles.voteBtn} ${
              isUpvoteLocked && styles.redLocked
            }`}
            onClick={onDownvoteClick}
          >
            -
          </Button>
        </div>
        <div className={styles.postInfo}>
          <h2>{postObj.title}</h2>
          <div
            className={`${styles.postDescritpion} ${
              isDarkMode && styles.darkMode
            }`}
          >
            <p>
              {showMoreVisibility
                ? postObj.description.substring(0, 250)
                : postObj.description}
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
          <SourcePlatform platform={postObj.platform} size={65} />
        </div>
      </div>
      {localStorage.getItem("userId") && (
        <>
          <hr className={isDarkMode ? styles.darkMode : undefined} />
          <section className={styles.writeComment}>
            <Avatar
              url={userAvatar}
              size={35}
              linkTo={`/user/${localStorage.getItem("userId")}`}
            />
            <input
              className={`${styles.commentInput} ${
                isDarkMode && styles.darkMode
              }`}
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onKeyUp={async (event) => {
                if (event.key === "Enter") {
                  writeCommentHandler();
                }
              }}
              onChange={(event) => {
                setCommentText((event.target as HTMLInputElement).value);
              }}
            />
            <div className={styles.send}>
              <IoSend
                size="35"
                color="lightblue"
                onClick={writeCommentHandler}
              />
            </div>
          </section>
        </>
      )}
      {postObj.comments.length ? (
        <div className={styles.showComments}>
          <span
            onClick={() => {
              setAreCommentsVisible((state) => !state);
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

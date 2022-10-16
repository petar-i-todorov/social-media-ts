import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";

const FeedPage = () => {
  return (
    <main className={styles.feed}>
      <Post
        title="This course is trash."
        description="I didn't like this course. It was a waste of time watching it. The instructor is unprofessional."
        platform="YOUTUBE"
        upvotes={0}
      />
    </main>
  );
};

export default FeedPage;

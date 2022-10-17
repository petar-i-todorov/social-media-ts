import Button from "../../components/Button/Button";
import Post from "../../components/Post/Post";
import styles from "./Feed.module.scss";

const FeedPage = () => {
  return (
    <main className={styles.feed}>
      <menu className={styles.feedMenu}>
        <Button color="blue" className={styles.addBtn}>
          Add a post
        </Button>
        <select id="sort" className={styles.sortDropdown}>
          <option value="date">Most recent</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </menu>
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

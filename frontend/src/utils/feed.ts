import { IPost } from "../types/feed";

export const sortAndSetPosts = (
  posts: IPost[],
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
  sortBy: string
) => {
  if (sortBy === "RECENCY") {
    setPosts(
      JSON.parse(JSON.stringify(posts)).sort(
        (postOne: IPost, postTwo: IPost) => {
          if (postTwo.createdAt > postOne.createdAt) {
            return 1;
          }
          return -1;
        }
      )
    );
  } else if (sortBy === "VOTES") {
    setPosts(
      JSON.parse(JSON.stringify(posts)).sort(
        (postOne: IPost, postTwo: IPost) => {
          return postTwo.upvotes - postOne.upvotes;
        }
      )
    );
  }
};

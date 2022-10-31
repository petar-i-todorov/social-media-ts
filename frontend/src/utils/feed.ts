import { DevRole, IPost } from "../types/feed";

export const sortAndSetPosts = (
  posts: IPost[],
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
  sortBy: string,
  devRole: DevRole
) => {
  if (sortBy === "RECENCY") {
    setPosts(
      JSON.parse(JSON.stringify(posts))
        .filter((post: IPost) => post.devRole.toUpperCase() === devRole)
        .sort((postOne: IPost, postTwo: IPost) => {
          if (postTwo.createdAt > postOne.createdAt) {
            return 1;
          }
          return -1;
        })
    );
  } else if (sortBy === "VOTES") {
    setPosts(
      JSON.parse(JSON.stringify(posts))
        .filter((post: IPost) => post.devRole.toUpperCase() === devRole)
        .sort((postOne: IPost, postTwo: IPost) => {
          return postTwo.upvotes - postOne.upvotes;
        })
    );
  }
};

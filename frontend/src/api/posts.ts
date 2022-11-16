import { DevRole, Platform, SortBy } from "../types/feed";

type GetPosts = (config: {
  sortBy: SortBy;
  devRole: DevRole;
  substring: string;
}) => Promise<Response>;

export const getPosts: GetPosts = ({ sortBy, devRole, substring }) => {
  return fetch(
    `http://localhost:8080/posts?sortBy=${sortBy}&devRole=${devRole}&substring=${substring}`
  );
};

type CommentPostFunction = (config: {
  postId: string;
  comment: string;
}) => Promise<Response>;

export const commentPost: CommentPostFunction = ({ postId, comment }) => {
  return fetch(`http://localhost:8080/posts/addComment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      text: comment,
      creatorId: localStorage.getItem("userId"),
    }),
  });
};

type VotePostFunction = (postId: string) => Promise<Response>;

export const upvotePost: VotePostFunction = (postId) => {
  return fetch(`http://localhost:8080/posts/upvote/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      postId,
      userId: localStorage.getItem("userId"),
    }),
  });
};

export const downvotePost: VotePostFunction = (postId) => {
  return fetch(`http://localhost:8080/posts/downvote/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      postId,
      userId: localStorage.getItem("userId"),
    }),
  });
};

type ReportPostFunction = (config: {
  postId: string;
  reportType: string;
  reportMessage: string;
}) => Promise<Response>;

export const reportPost: ReportPostFunction = ({
  postId,
  reportType,
  reportMessage,
}) => {
  return fetch(`http://localhost:8080/posts/report/${postId}`, {
    method: "POST",
    body: JSON.stringify({
      reportType: reportType,
      reportMessage: reportMessage || null,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
};

interface PostArgument {
  description: string;
  devRole: DevRole;
  platform: Platform | undefined;
  title: string;
  url: string;
}

interface PostArgumentWithId extends PostArgument {
  id: string;
}

type EditPostFunction = (arg: PostArgumentWithId) => Promise<Response>;

type CreatePostFunction = (arg: PostArgument) => Promise<Response>;

export const updatePost: EditPostFunction = ({
  description,
  devRole,
  id,
  platform,
  title,
  url,
}) => {
  return fetch(`http://localhost:8080/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      description,
      devRole,
      platform,
      title,
      url,
    }),
  });
};

export const createPost: CreatePostFunction = ({
  description,
  devRole,
  platform,
  title,
  url,
}) => {
  return fetch("http://localhost:8080/posts/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      creator: localStorage.getItem("userId"),
      description,
      devRole,
      platform,
      title,
      url,
    }),
  });
};

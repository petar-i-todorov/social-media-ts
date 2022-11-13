import { DevRole, Platform } from "../../types/feed";

interface PostArgument {
  title: string;
  description: string;
  url: string;
  devRole: DevRole;
  platform: Platform | undefined;
}

interface PostArgumentWithId extends PostArgument {
  id: string;
}

type EditPostFunction = (arg: PostArgumentWithId) => Promise<Response>;

type CreatePostFunction = (arg: PostArgument) => Promise<Response>;

export const updatePost: EditPostFunction = ({
  id,
  title,
  description,
  url,
  devRole,
  platform,
}) => {
  return fetch(`http://localhost:8080/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      title,
      description,
      url,
      devRole,
      platform,
    }),
  });
};

export const createPost: CreatePostFunction = ({
  title,
  description,
  url,
  devRole,
  platform,
}) => {
  return fetch("http://localhost:8080/posts/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      creator: localStorage.getItem("userId"),
      title,
      description,
      url,
      devRole,
      platform,
    }),
  });
};

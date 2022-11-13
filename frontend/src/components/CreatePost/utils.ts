import { DevRole, Platform } from "../../types/feed";

interface PostArgument {
  id: string;
  title: string;
  description: string;
  url: string;
  devRole: DevRole;
  platform: Platform;
}

type EditPostFunction = (arg: PostArgument) => Promise<Response>;

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
      id,
      title,
      description,
      url,
      devRole,
      platform,
    }),
  });
};

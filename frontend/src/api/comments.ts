type VoteCommentFunction = (config: {
  id: string;
  type: "like" | "dislike";
}) => Promise<Response>;

export const voteComment: VoteCommentFunction = ({ id, type }) => {
  return fetch(`http://localhost:8080/comments/${id}/${type}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      userId: localStorage.getItem("userId"),
    }),
  });
};

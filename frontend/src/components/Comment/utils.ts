export const voteComment = (id: string, type: "like" | "dislike") => {
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

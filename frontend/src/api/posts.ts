interface CommentPostArguments {
  postId: string;
  comment: string;
}

type CommentPostFunction = (config: CommentPostArguments) => Promise<Response>;

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

interface ReportPostArguments {
  postId: string;
  reportType: string;
  reportMessage: string;
}

type ReportPostFunction = (config: ReportPostArguments) => Promise<Response>;

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

import { Platform } from "../types/feed";

export const FRONTEND = "FRONTEND";

export const BACKEND = "BACKEND";

export const DEVOPS = "DEVOPS";

export const devRoles = [FRONTEND, BACKEND, DEVOPS];

export const searchSuggestions = [
  "Maximillian Schwarzmuller",
  "Bogdan Stashchuk",
  "Remix",
  "React",
  "Angular",
  "Vue",
  "AWS",
  "Github Actions",
  "MongoDB",
  "SQL",
  "Typescript",
  "Javascript",
  "HTML",
  "CSS",
  "SCSS",
];

export const YOUTUBE = "YOUTUBE";
export const GITHUB = "GITHUB";
export const UDEMY = "UDEMY";
export const LINKEDIN = "LINKEDIN";
export const REDDIT = "REDDIT";
export const STACKOVERFLOW = "STACKOVERFLOW";
export const OTHER = "OTHER";

export const PLATFORMS: Platform[] = [
  YOUTUBE,
  GITHUB,
  UDEMY,
  LINKEDIN,
  REDDIT,
  STACKOVERFLOW,
  OTHER,
];

export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

export const defaultFlashMessageConfig: {
  text: string;
  color: "red" | "green";
} = {
  text: "Something went wrong. Please, try again later.",
  color: "red",
};

export const reportOptions = [
  "Inappropriate language",
  "Scam",
  "Off-topic",
  "Other",
];

export const RECENCY = "RECENCY";
export const VOTES = "VOTES";

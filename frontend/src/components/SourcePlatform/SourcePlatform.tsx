import { FC } from "react";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiRedditFill,
  RiStackOverflowFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { SiUdemy } from "react-icons/si";
import { Platform } from "../../types/feed";
import {
  GITHUB,
  LINKEDIN,
  REDDIT,
  STACKOVERFLOW,
  UDEMY,
  YOUTUBE,
} from "../../constants/feed";
import styles from "./SourcePlatform.module.scss";

interface SourcePlatformProps {
  platform: Platform;
  size: number;
}

const SourcePlatform: FC<SourcePlatformProps> = ({ platform, size }) => {
  return (
    <div>
      {platform === UDEMY ? (
        <SiUdemy size={size} color="purple" />
      ) : platform === STACKOVERFLOW ? (
        <RiStackOverflowFill size={size} color="orange" />
      ) : platform === GITHUB ? (
        <RiGithubFill size={size} color="black" />
      ) : platform === YOUTUBE ? (
        <RiYoutubeFill size={size} color="red" />
      ) : platform === REDDIT ? (
        <RiRedditFill size={size} color="red" />
      ) : platform === LINKEDIN ? (
        <RiLinkedinBoxFill size={size} color="blue" />
      ) : (
        <span className={styles.other}>OTHER</span>
      )}
    </div>
  );
};

export default SourcePlatform;

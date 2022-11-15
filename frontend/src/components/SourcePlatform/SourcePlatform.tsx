import { FC, MouseEventHandler } from "react";
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
  className?: string;
  onClick?: MouseEventHandler;
}

const SourcePlatform: FC<SourcePlatformProps> = ({
  platform,
  size,
  className,
  onClick,
}) => {
  return (
    <div>
      {platform === UDEMY ? (
        <SiUdemy
          className={className}
          color="purple"
          onClick={onClick}
          size={size}
        />
      ) : platform === STACKOVERFLOW ? (
        <RiStackOverflowFill
          className={className}
          color="orange"
          onClick={onClick}
          size={size}
        />
      ) : platform === GITHUB ? (
        <RiGithubFill
          className={className}
          color="black"
          onClick={onClick}
          size={size}
        />
      ) : platform === YOUTUBE ? (
        <RiYoutubeFill
          className={className}
          color="red"
          onClick={onClick}
          size={size}
        />
      ) : platform === REDDIT ? (
        <RiRedditFill
          className={className}
          color="red"
          onClick={onClick}
          size={size}
        />
      ) : platform === LINKEDIN ? (
        <RiLinkedinBoxFill
          className={className}
          color="blue"
          onClick={onClick}
          size={size}
        />
      ) : (
        <span className={`${styles.other} ${className}`} onClick={onClick}>
          OTHER
        </span>
      )}
    </div>
  );
};

export default SourcePlatform;

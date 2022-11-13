import { useContext, FC, Dispatch, SetStateAction } from "react";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiRedditFill,
  RiStackOverflowFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { SiUdemy } from "react-icons/si";

import {
  GITHUB,
  LINKEDIN,
  OTHER,
  REDDIT,
  STACKOVERFLOW,
  UDEMY,
  YOUTUBE,
} from "../../constants/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { Platform } from "../../types/feed";
import styles from "./SourceOptions.module.scss";

interface SourceOptionsProps {
  isHighlighted: boolean;
  setIsHighlighted: Dispatch<SetStateAction<boolean>>;
  selectedOption: Platform | undefined;
  setSelectedOption: Dispatch<SetStateAction<Platform | undefined>>;
}

const SourceOptions: FC<SourceOptionsProps> = ({
  isHighlighted,
  setIsHighlighted,
  selectedOption,
  setSelectedOption,
}) => {
  const { isDarkMode } = useContext(SwitchThemeContext);
  return (
    <>
      <span>Source' social media</span>
      <div className={styles.optionsContainer}>
        <RiYoutubeFill
          className={`${styles.option} ${
            selectedOption === YOUTUBE && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          color="red"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(YOUTUBE);
          }}
        />
        <RiStackOverflowFill
          className={`${styles.option} ${
            selectedOption === STACKOVERFLOW && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          color="orange"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(STACKOVERFLOW);
          }}
        />
        <RiGithubFill
          className={`${styles.option} ${
            selectedOption === GITHUB && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(GITHUB);
          }}
        />
        <RiRedditFill
          className={`${styles.option} ${
            selectedOption === REDDIT && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          color="red"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(REDDIT);
          }}
        />
        <RiLinkedinBoxFill
          className={`${styles.option} ${
            selectedOption === LINKEDIN && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          color="blue"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(LINKEDIN);
          }}
        />
        <SiUdemy
          className={`${styles.option} ${
            selectedOption === UDEMY && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          size="50"
          color="purple"
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(UDEMY);
          }}
        />
        <p
          className={`${styles.option} ${
            selectedOption === OTHER && styles.selected
          } ${isHighlighted && styles.invalid} ${
            isDarkMode && styles.darkMode
          }`}
          onClick={() => {
            setIsHighlighted(false);
            setSelectedOption(OTHER);
          }}
        >
          OTHER
        </p>
      </div>
    </>
  );
};

export default SourceOptions;

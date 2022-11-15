import { useContext, FC, Dispatch, SetStateAction } from "react";
import { PLATFORMS } from "../../constants/feed";
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import { Platform } from "../../types/feed";
import SourcePlatform from "../SourcePlatform/SourcePlatform";
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
        {PLATFORMS.map((platform) => (
          <SourcePlatform
            key={platform}
            platform={platform}
            size={50}
            className={`${styles.option} ${
              selectedOption === platform && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(platform);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SourceOptions;

import { Dispatch, FC, SetStateAction, useState } from "react";
import { TiTick } from "react-icons/ti";
import styles from "./ReportPostOption.module.scss";

interface ReportPostOptionProps {
  isError: boolean;
  value: string;
  chosenOptions: string[];
  setChosenOptions: Dispatch<SetStateAction<string[]>>;
}

const ReportPostOption: FC<ReportPostOptionProps> = ({
  isError,
  value,
  setChosenOptions,
}) => {
  const [isChosen, setIsChosen] = useState(false);
  return (
    <div
      className={styles.checkBoxContainer}
      onClick={() => {
        if (isChosen) {
          setIsChosen(false);
          setChosenOptions((options) =>
            options.filter((option) => option !== value)
          );
        } else {
          setIsChosen(true);
          setChosenOptions((options) => [...options, value]);
        }
      }}
    >
      <div className={`${styles.checkBox} ${isError && styles.invalid}`}>
        {isChosen && <TiTick size="23"></TiTick>}
      </div>
      <span>{value}</span>
    </div>
  );
};

export default ReportPostOption;

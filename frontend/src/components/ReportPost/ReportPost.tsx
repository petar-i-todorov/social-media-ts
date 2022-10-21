import React, { useEffect, useMemo, useState } from "react";
import Button from "../Button/Button";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import styles from "./ReportPost.module.scss";
import { TiTick } from "react-icons/ti";
import TextArea from "../TextArea/TextArea";

const ReportPost: React.FC<{
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setVisibility }) => {
  const [verbalAbuseChosen, setVerbalAbuseChosen] = useState(false);
  const [offTopicChosen, setOffTopicChosen] = useState(false);
  const [scamChosen, setScamChosen] = useState(false);
  const [otherChosen, setOtherChosen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const canProceed = useMemo(() => {
    if (!verbalAbuseChosen && !offTopicChosen && !scamChosen && !otherChosen)
      return false;
    else {
      return true;
    }
  }, [verbalAbuseChosen, offTopicChosen, scamChosen, otherChosen]);
  useEffect(() => {
    if (verbalAbuseChosen || offTopicChosen || scamChosen || otherChosen) {
      setIsError(false);
    }
  }, [verbalAbuseChosen, offTopicChosen, scamChosen, otherChosen]);
  return (
    <ModalBuilder
      onOverlayClick={() => {
        setVisibility(false);
      }}
      onFormSubmit={() => {
        if (!canProceed) {
          setIsError(true);
        }
      }}
    >
      <h2>What's wrong with this post?</h2>
      <div className={styles.options}>
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            if (verbalAbuseChosen) {
              setVerbalAbuseChosen(false);
            } else {
              setVerbalAbuseChosen(true);
            }
          }}
        >
          <div className={styles.checkBox + " " + (isError && styles.invalid)}>
            {verbalAbuseChosen && <TiTick size="23"></TiTick>}
          </div>
          <span>Verbal abuse</span>
        </div>
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            if (offTopicChosen) {
              setOffTopicChosen(false);
            } else {
              setOffTopicChosen(true);
            }
          }}
        >
          <div className={styles.checkBox + " " + (isError && styles.invalid)}>
            {offTopicChosen && <TiTick size="23"></TiTick>}
          </div>
          <span>Off-topic</span>
        </div>
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            if (scamChosen) {
              setScamChosen(false);
            } else {
              setScamChosen(true);
            }
          }}
        >
          <div className={styles.checkBox + " " + (isError && styles.invalid)}>
            {scamChosen && <TiTick size="23"></TiTick>}
          </div>
          <span>Scam</span>
        </div>
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            if (otherChosen) {
              setOtherChosen(false);
            } else {
              setOtherChosen(true);
            }
          }}
        >
          <div className={styles.checkBox + " " + (isError && styles.invalid)}>
            {otherChosen && <TiTick size="23"></TiTick>}
          </div>
          <span>Other</span>
        </div>
      </div>
      <TextArea
        label="Describe the problem (optional):"
        isValid={true}
        onChange={(event) => {
          const target = event.target as HTMLTextAreaElement;
          setReportMessage(target.value);
        }}
      />
      <Button color="green" type="submit">
        Report
      </Button>
    </ModalBuilder>
  );
};

export default ReportPost;

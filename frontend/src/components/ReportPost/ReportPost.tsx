import React, { useContext, useEffect, useMemo, useState } from "react";
import Button from "../Button/Button";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import styles from "./ReportPost.module.scss";
import { TiTick } from "react-icons/ti";
import TextArea from "../TextArea/TextArea";
import { PostIdContext } from "../../contexts/PostIdContext";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";

const ReportPost: React.FC<{
  setClosingConfirmationVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = ({ setClosingConfirmationVisibility }) => {
  const {
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
    activeFlashTimeout,
    setActiveFlashTimeout,
  } = useContext(FlashMessageContext);
  const { postId } = useContext(PostIdContext);
  const [inappropriateLanguageChosen, setInappropriateLanguageChosen] =
    useState(false);
  const [offTopicChosen, setOffTopicChosen] = useState(false);
  const [scamChosen, setScamChosen] = useState(false);
  const [otherChosen, setOtherChosen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const { setReportPostVisibility } = useContext(ModalsManipulationContext);
  const canProceed = useMemo(() => {
    if (
      !inappropriateLanguageChosen &&
      !offTopicChosen &&
      !scamChosen &&
      !otherChosen
    ) {
      return false;
    }
    return true;
  }, [inappropriateLanguageChosen, offTopicChosen, scamChosen, otherChosen]);
  const reportType = useMemo(() => {
    const reportTypesArray = [];
    inappropriateLanguageChosen &&
      reportTypesArray.push("Inappropriate language");
    scamChosen && reportTypesArray.push("Scam");
    offTopicChosen && reportTypesArray.push("Off-topic");
    otherChosen && reportTypesArray.push("Other");
    return reportTypesArray.join(", ");
  }, [inappropriateLanguageChosen, offTopicChosen, scamChosen, otherChosen]);
  useEffect(() => {
    if (
      inappropriateLanguageChosen ||
      offTopicChosen ||
      scamChosen ||
      otherChosen
    ) {
      setIsError(false);
    }
  }, [inappropriateLanguageChosen, offTopicChosen, scamChosen, otherChosen]);
  return (
    <ModalBuilder
      onOverlayClick={() => {
        setClosingConfirmationVisibility(true);
      }}
      onFormSubmit={async () => {
        if (!canProceed) {
          setIsError(true);
        } else {
          const res = await fetch(
            `http://localhost:8080/posts/report/${postId}`,
            {
              method: "POST",
              body: JSON.stringify({
                reportType: reportType,
                reportMessage: reportMessage || null,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          if (res.status !== 200) {
            setIsFeedFlashMessage(true);
            setFeedFlashMessageConfiguration({
              text: "Something went wrong. Please, try again later.",
              color: "red",
            });
            clearTimeout(activeFlashTimeout);
            const timeout = setTimeout(() => {
              setIsFeedFlashMessage(false);
            }, 5000);
            setActiveFlashTimeout(timeout);
          } else {
            const resData = await res.json();
            setReportPostVisibility(false);
            setFeedFlashMessageConfiguration({
              text: resData.message,
              color: "green",
            });
            setIsFeedFlashMessage(true);
            clearTimeout(activeFlashTimeout);
            const timeout = setTimeout(() => {
              setIsFeedFlashMessage(false);
            }, 5000);
            setActiveFlashTimeout(timeout);
          }
        }
      }}
    >
      <h2>What's wrong with this post?</h2>
      <div className={styles.options}>
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            if (inappropriateLanguageChosen) {
              setInappropriateLanguageChosen(false);
            } else {
              setInappropriateLanguageChosen(true);
            }
          }}
        >
          <div className={styles.checkBox + " " + (isError && styles.invalid)}>
            {inappropriateLanguageChosen && <TiTick size="23"></TiTick>}
          </div>
          <span>Inappropriate language</span>
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

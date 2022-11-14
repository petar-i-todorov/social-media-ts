import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Button from "../Button/Button";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import styles from "./ReportPost.module.scss";
import TextArea from "../TextArea/TextArea";
import { PostIdContext } from "../../contexts/PostIdContext";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { defaultFlashMessageConfig, reportOptions } from "../../constants/feed";
import { reportPost } from "../../api/posts";
import ReportPostOption from "../ReportPostOption/ReportPostOption";

const ReportPost: FC<{
  setClosingConfirmationVisibility: Dispatch<SetStateAction<boolean>>;
}> = ({ setClosingConfirmationVisibility }) => {
  const [isError, setIsError] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [chosenOptions, setChosenOptions] = useState<string[]>([]);

  const { setReportPostVisibility } = useContext(ModalsManipulationContext);
  const {
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
    setIsLoader,
  } = useContext(FlashMessageContext);
  const { postId } = useContext(PostIdContext);

  const canProceed = useMemo(() => {
    if (!chosenOptions.length) {
      return false;
    }
    return true;
  }, [chosenOptions]);

  useEffect(() => {
    if (chosenOptions.length) {
      setIsError(false);
    }
  }, [chosenOptions]);
  return (
    <ModalBuilder
      onOverlayClick={() => {
        setClosingConfirmationVisibility(true);
      }}
      onFormSubmit={async () => {
        if (!canProceed) {
          setIsError(true);
        } else {
          setIsLoader(true);
          const res = await reportPost({
            postId,
            reportMessage,
            reportType: chosenOptions.join(", "),
          });
          setIsLoader(false);
          if (res.status !== 200) {
            setIsFeedFlashMessage(true);
            setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
          } else {
            const resData = await res.json();
            setReportPostVisibility(false);
            setFeedFlashMessageConfiguration({
              text: resData.message,
              color: "green",
            });
            setIsFeedFlashMessage(true);
          }
        }
      }}
    >
      <h2>What's wrong with this post?</h2>
      <div className={styles.options}>
        {reportOptions.map((value) => (
          <ReportPostOption
            chosenOptions={chosenOptions}
            isError={isError}
            key={value}
            setChosenOptions={setChosenOptions}
            value={value}
          />
        ))}
      </div>
      <TextArea
        label="Describe the problem (optional):"
        isValid={true}
        onChange={(event) => {
          setReportMessage((event.target as HTMLTextAreaElement).value);
        }}
      />
      <Button color="green" type="submit">
        Report
      </Button>
    </ModalBuilder>
  );
};

export default ReportPost;

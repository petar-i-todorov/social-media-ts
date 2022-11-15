import Button from "../Button/Button";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import styles from "./ConfirmationModalBuilder.module.scss";

interface ConfirmationModalBuilderProps {
  question: string;
  onConfirmation: React.MouseEventHandler;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmationModalBuilder: React.FC<ConfirmationModalBuilderProps> = ({
  question,
  onConfirmation,
  setVisibility,
}) => {
  return (
    <ModalBuilder onOverlayClick={() => setVisibility(false)}>
      <h2>{question}</h2>
      <div className={styles.buttonsContainer}>
        <Button color="red" onClick={() => setVisibility(false)}>
          Actually, no
        </Button>
        <Button
          color="green"
          onClick={async (event) => {
            setVisibility(false);
            onConfirmation(event);
          }}
        >
          Yes
        </Button>
      </div>
    </ModalBuilder>
  );
};

export default ConfirmationModalBuilder;

import React, { MouseEventHandler } from "react";
import Button from "../Button/Button";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import styles from "./ConfirmationModalBuilder.module.scss";

const Confirm: React.FC<{
  question: string;
  onConfirmation: MouseEventHandler;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ question, onConfirmation, setVisibility }) => {
  return (
    <ModalBuilder
      onOverlayClick={() => {
        setVisibility(false);
      }}
    >
      <h2>{question}</h2>
      <div className={styles.btnsContainer}>
        <Button
          color="red"
          onClick={() => {
            setVisibility(false);
          }}
        >
          Actually, no
        </Button>
        <Button
          color="green"
          onClick={async (event) => {
            event.preventDefault();
            setVisibility(false);
            onConfirmation(event);
          }}
        >
          Yes, of course
        </Button>
      </div>
    </ModalBuilder>
  );
};

export default Confirm;

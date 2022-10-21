import React, { MouseEventHandler } from "react";
import Button from "../Button/Button";
import Form from "../Form/Form";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import Overlay from "../ModalBuilder/ModalBuilder";
import styles from "./ConfirmationModal.module.scss";

const Confirm: React.FC<{
  question: string;
  onConfirmation: MouseEventHandler;
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ question, onConfirmation, setConfirmModal }) => {
  return (
    <ModalBuilder
      onOverlayClick={() => {
        setConfirmModal(false);
      }}
    >
      <h2>{question}</h2>
      <div className={styles.btnsContainer}>
        <Button
          color="red"
          onClick={() => {
            setConfirmModal(false);
          }}
        >
          Actually, no
        </Button>
        <Button
          color="green"
          onClick={async (event) => {
            event.preventDefault();
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

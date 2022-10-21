import React from "react";
import Form from "../Form/Form";
import styles from "./ModalBuilder.module.scss";

const ModalBuilder: React.FC<{
  children: React.ReactNode;
  onOverlayClick: React.MouseEventHandler;
  onFormSubmit?: React.FormEventHandler;
}> = ({ children, onOverlayClick, onFormSubmit }) => {
  return (
    <div className={styles.overlay} onClick={onOverlayClick}>
      <Form nonAnimated onSubmit={onFormSubmit}>
        {children}
      </Form>
    </div>
  );
};

export default ModalBuilder;

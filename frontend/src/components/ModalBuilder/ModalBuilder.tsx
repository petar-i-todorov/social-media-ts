import {
  FC,
  FormEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import Form from "../Form/Form";
import styles from "./ModalBuilder.module.scss";

interface ModalBuilderProps {
  onOverlayClick: MouseEventHandler;
  onFormSubmit?: FormEventHandler;
}

const ModalBuilder: FC<PropsWithChildren<ModalBuilderProps>> = ({
  children,
  onOverlayClick,
  onFormSubmit,
}) => {
  return (
    <div className={styles.overlay} onClick={onOverlayClick}>
      <Form
        nonAnimated
        onSubmit={(event) => {
          event.preventDefault();
          if (onFormSubmit) {
            onFormSubmit(event);
          }
        }}
      >
        {children}
      </Form>
    </div>
  );
};

export default ModalBuilder;

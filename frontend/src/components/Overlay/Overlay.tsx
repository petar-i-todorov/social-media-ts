import React from "react";
import styles from "./Overlay.module.scss";

const Modal: React.FC<{
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}> = ({ children, onClick }) => {
  return (
    <div className={styles.overlay} onClick={onClick}>
      {children}
    </div>
  );
};

export default Modal;

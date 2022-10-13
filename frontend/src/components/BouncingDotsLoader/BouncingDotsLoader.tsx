import React from "react";
import styles from "./BouncingDotsLoader.module.scss";

const BouncingDotsLoader: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.dotsContainer}>
      {text}
      <div className={styles.dot1}>.</div>
      <div className={styles.dot2}>.</div>
      <div className={styles.dot3}>.</div>
    </div>
  );
};

export default BouncingDotsLoader;

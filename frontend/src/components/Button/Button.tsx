import React, { MouseEventHandler, PropsWithChildren, useMemo } from "react";

import styles from "./Button.module.scss";

interface ButtonProps {
  color: "blue" | "green" | "red";
  onClick?: MouseEventHandler;
  type?: "submit";
  className?: string;
  isLocked?: boolean;
}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  className,
  color,
  type,
  isLocked,
  onClick,
  children,
}) => {
  let colorStyle = useMemo(() => {
    switch (color) {
      case "blue":
        return styles.blue;
      case "green":
        return styles.green;
      default:
        return styles.red;
    }
  }, [color]);
  return (
    <button
      type={type}
      className={`${styles.btn} ${colorStyle} ${className} ${
        isLocked && styles.locked
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

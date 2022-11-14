import { FC } from "react";
import { LEFT } from "../../constants/feed";
import { ErrorPosition } from "../../types/feed";
import styles from "./InputError.module.scss";

interface InputErrorProps {
  error: string;
  position: ErrorPosition;
  className?: string;
}

const InputError: FC<InputErrorProps> = ({ error, position, className }) => {
  return (
    <div
      className={`${styles.validationError} ${
        position === LEFT ? styles.left : styles.right
      } ${className}`}
    >
      {error}
    </div>
  );
};

export default InputError;

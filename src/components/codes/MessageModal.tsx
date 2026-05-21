import styles from "../styles/Modal.module.scss";
import cn from "classnames";

type MessageModalProps = {
  title: string;
  text: string;
  onClose: () => void;
  twoButton: boolean;
  onDelete: () => void;
  btnText: string;
};

const MessageModal = ({
  title,
  text,
  onClose,
  twoButton,
  onDelete,
  btnText,
}: MessageModalProps) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>{title}</h2>
        <p style={{ whiteSpace: "pre-line" }} className={styles.message}>
          {text}
        </p>

        {twoButton ? (
          <div className={styles.buttons}>
            <button
              className={cn(styles.deleteBtn, "button")}
              onClick={() => onDelete()}
            >
              {btnText}
            </button>
            <button
              className={cn(styles.backBtn, "button")}
              onClick={() => onClose()}
            >
              Back
            </button>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button
              className={cn(styles.backBtn, "button")}
              onClick={() => onClose()}
            >
              Ok
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageModal;

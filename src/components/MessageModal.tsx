import cn from "classnames";

import styles from "../styles/modules/Modal.module.scss";

type MessageModalProps = {
  title: string;
  text: string;
  onClose: () => void;
};

const MessageModal = ({ title, text, onClose }: MessageModalProps) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>{title}</h2>
        <p style={{ whiteSpace: "pre-line" }} className={styles.message}>
          {text}
        </p>
        <div className={styles.buttons}>
          <button
            className={cn(styles.backBtn, "button")}
            onClick={() => onClose()}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

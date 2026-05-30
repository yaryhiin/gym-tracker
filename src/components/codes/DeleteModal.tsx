import styles from "../styles/Modal.module.scss";
import cn from "classnames";

type DeleteModalProps = {
  title: string;
  text: string;
  onClose: () => void;
  onDelete: () => void;
};

const DeleteModal = ({
  title,
  text,
  onClose,
  onDelete,
}: DeleteModalProps) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>{title}</h2>
        <p style={{ whiteSpace: "pre-line" }} className={styles.message}>
          {text}
        </p>
        <div className={styles.buttons}>
          <button
            className={cn(styles.deleteBtn, "button")}
            onClick={() => onDelete()}
          >
            Delete
          </button>
          <button
            className={cn(styles.backBtn, "button")}
            onClick={() => onClose()}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

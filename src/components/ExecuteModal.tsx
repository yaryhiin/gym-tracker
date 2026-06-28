import cn from "classnames";

import styles from "../styles/modules/Modal.module.scss";

type ExecuteModalProps = {
  text: string;
  btnText: string;
  onClose: () => void;
  onDelete: () => void;
};

const ExecuteModal = ({
  text,
  onClose,
  onDelete,
  btnText,
}: ExecuteModalProps) => {
  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">Confirm Action</h2>
        <p style={{ whiteSpace: "pre-line" }} className={styles.message}>
          {text}
        </p>
        <div className="buttonContainer">
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
      </div>
    </div>
  );
};

export default ExecuteModal;

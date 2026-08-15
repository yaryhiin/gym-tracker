import cn from "classnames";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">{t("execute.title")}</h2>
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
            {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecuteModal;

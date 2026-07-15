import { CircleCheck, CircleX, LoaderCircle, Info } from "lucide-react";

import styles from "../styles/modules/InfoModal.module.scss";

const INFO_MODAL_MESSAGES = {
  saving: {
    icon: LoaderCircle,
    title: "Saving",
    text: "Saving your changes...",
    loading: true,
  },

  deleting: {
    icon: LoaderCircle,
    title: "Deleting",
    text: "Deleting item...",
    loading: true,
  },

  success: {
    icon: CircleCheck,
    title: "Success",
    text: "Completed successfully",
    loading: false,
  },

  error: {
    icon: CircleX,
    title: "Error",
    text: "Something went wrong. Please try again.",
    loading: false,
  },
};

export type InfoModalType = keyof typeof INFO_MODAL_MESSAGES;

type InfoModalProps = {
  type: string;
};

const InfoModal = ({ type }: InfoModalProps) => {
  const message = INFO_MODAL_MESSAGES[type as InfoModalType] || {
    icon: Info,
    title: "Information",
    text: "Here is something you should know.",
    loading: false,
  };

  const Icon = message.icon;
  
  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <h2 className={styles.icon}>
          {<Icon size={32} strokeWidth={2} className={message.loading ? styles.infoModal__spinner : ""} />}
        </h2>
        <div className={styles.message}>
          <h3 className={styles.title}>{message.title}</h3>
          <p className={styles.text}>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

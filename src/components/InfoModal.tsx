import styles from "../styles/modules/InfoModal.module.scss";

const INFO_MODAL_MESSAGES = {
  loading: {
    icon: "⏳",
    title: "Loading",
    text: "Please wait...",
  },

  saving: {
    icon: "💾",
    title: "Saving",
    text: "Saving your changes...",
  },

  deleting: {
    icon: "🗑️",
    title: "Deleting",
    text: "Deleting item...",
  },

  success: {
    icon: "✅",
    title: "Success",
    text: "Completed successfully.",
  },

  error: {
    icon: "❌",
    title: "Error",
    text: "Something went wrong. Please try again.",
  },
} as const;

export type InfoModalType = keyof typeof INFO_MODAL_MESSAGES;

type InfoModalProps = {
  type: string;
};

const InfoModal = ({ type }: InfoModalProps) => {
  const message = INFO_MODAL_MESSAGES[type as InfoModalType] || {
    icon: "❓",
    title: "Unknown",
    text: "Unknown modal type.",
  };
  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <h2 className={styles.icon}>{message.icon}</h2>
        <div className={styles.message}>
          <h3 className={styles.title}>{message.title}</h3>
          <p className={styles.text}>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

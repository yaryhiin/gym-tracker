import styles from '../styles/Modal.module.scss'
import cn from 'classnames';

type MessageModalProps = {
    title: string,
    text: string,
    onClose: () => void,
}

const MessageModal = ({title, text, onClose }: MessageModalProps) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.heading}>{title}</h2>
                <p style={{ whiteSpace: 'pre-line' }} className={styles.message}>{text}</p>
                <div className={styles.buttons}>
                    <button className={cn(styles.addBtn, "button")} onClick={() => onClose()}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageModal
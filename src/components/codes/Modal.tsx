import { useState } from "react";
import styles from "../styles/Modal.module.scss";
import cn from "classnames";

type ModalProps = {
  onClose: () => void;
  onAddExercise: (exerciseName: string) => void;
};

const Modal = ({ onClose, onAddExercise }: ModalProps) => {
  const [newExercise, setNewExercise] = useState("");
  const handleSubmit = () => {
    if (newExercise.trim()) {
      onAddExercise(newExercise);
      onClose(); // pass value to parent
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Add New Exercise</h2>
        <input
          className={styles.input}
          type="text"
          value={newExercise}
          onChange={(e) => setNewExercise(e.target.value)}
          placeholder="Exercise name"
        />
        <div className={styles.buttons}>
          <button
            className={cn(styles.addBtn, "button")}
            onClick={handleSubmit}
          >
            Add
          </button>
          <button className={cn(styles.backBtn, "button")} onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

import { useState } from "react";
import styles from "../styles/Modal.module.scss";
import cn from "classnames";

type CreateExerciseModalProps = {
  onClose: () => void;
  onAddExercise: (name: string, category: string) => void;
};

const CreateExerciseModal = ({
  onClose,
  onAddExercise,
}: CreateExerciseModalProps) => {
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] = useState("");
  const categories = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
    "Cardio",
    "Other",
  ];
  const handleSubmit = () => {
    if (newExerciseName.trim()) {
      onAddExercise(newExerciseName, newExerciseCategory);
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
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          placeholder="Exercise name"
        />
        <div className={styles.categoryContainer}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.categoryBtn} ${newExerciseCategory === category && styles.active}`}
              onClick={() => setNewExerciseCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
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

export default CreateExerciseModal;

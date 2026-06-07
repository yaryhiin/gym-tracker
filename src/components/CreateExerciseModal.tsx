import { useState } from "react";
import cn from "classnames";

import styles from "../styles//modules/Modal.module.scss";

import type { AddErrors } from "../types/errors";

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
  const [errors, setErrors] = useState<AddErrors>({
    name: false,
    category: false,
  });

  function handleSubmit() {
    if (!newExerciseName.trim()) {
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }
    if (!newExerciseCategory.trim()) {
      setErrors((prev) => ({ ...prev, category: true }));
      return;
    }
    onAddExercise(newExerciseName, newExerciseCategory);
    onClose();
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Add New Exercise</h2>
        <input
          className={cn(styles.input, errors.name && styles.error)}
          type="text"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          placeholder="Exercise name"
        />
        <div className={styles.categoryContainer}>
          <h2 className={styles.label}>Category:</h2>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={cn(
                styles.categoryBtn,
                newExerciseCategory === category && styles.active,
                errors.category && styles.error,
              )}
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

import { useState } from "react";
import cn from "classnames";

import styles from "../styles//modules/Modal.module.scss";

import type { AddErrors } from "../types/errors";
import type { ExerciseDB } from "../types/exercise";

type CreateExerciseModalProps = {
  exercise?: ExerciseDB;
  onClose: () => void;
  onAddExercise: (name: string, category: string) => void;
};

const ManageExerciseModal = ({
  exercise,
  onClose,
  onAddExercise,
}: CreateExerciseModalProps) => {
  const [newExerciseName, setNewExerciseName] = useState(exercise?.name || "");
  const [newExerciseCategory, setNewExerciseCategory] = useState(
    exercise?.category || "",
  );
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
    const newErrors = { name: false, category: false };
    if (!newExerciseName.trim()) newErrors.name = true;
    if (!newExerciseCategory.trim()) newErrors.category = true;
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    onAddExercise(newExerciseName, newExerciseCategory);
    onClose();
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>
          {exercise ? "Edit Exercise" : "Create New Exercise"}
        </h2>
        <div className={styles.input}>
          <input
            className={cn(styles.input, errors.name && styles.error)}
            type="text"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder="Exercise name"
          />
          {errors.name && (
            <p className={styles.errorMessage}>
              You need to enter exercise name
            </p>
          )}
        </div>
        <div className={styles.categoryContainer}>
          <h2 className={styles.label}>Category:</h2>
          <div className={styles.categories}>
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
            {errors.category && (
              <p className={styles.errorMessage}>
                You need to choose exercise category
              </p>
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={cn(styles.addBtn, "button")}
            onClick={handleSubmit}
          >
            Save
          </button>
          <button className={cn(styles.backBtn, "button")} onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageExerciseModal;

import cn from "classnames";
import { useState, useEffect } from "react";

import styles from "../styles/modules/ChooseExerciseModal.module.scss";

import type { ExerciseDB } from "../types/exercise";

import CreateExerciseModal from "./ManageExerciseModal";

type ChooseExerciseModalProps = {
  initialSelectedExerciseId?: string;
  exercises: ExerciseDB[];
  existingExercises: Set<string>;
  onClose: () => void;
  addExercise: (name: string, category: string) => void;
  chooseExercise: (exercise: ExerciseDB) => void;
};

const ChooseExerciseModal = ({
  initialSelectedExerciseId,
  exercises,
  existingExercises,
  onClose,
  addExercise,
  chooseExercise,
}: ChooseExerciseModalProps) => {
  const categories = [
    ...new Set(exercises.map((exercise) => exercise.category)),
  ];
  const [chosenExerciseCategory, setChosenExerciseCategory] = useState("");
  const [chosenExercise, setChosenExercise] = useState<ExerciseDB>();
  const availableExercises = exercises.filter(
    (exercise) => !existingExercises.has(exercise.id),
  );

  useEffect(() => {
    if (!initialSelectedExerciseId) return;
    setChosenExercise(
      exercises.find((exercise) => exercise.id === initialSelectedExerciseId),
    );
  }, [initialSelectedExerciseId]);

  const [showModal, setShowModal] = useState(false);
  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">
          {initialSelectedExerciseId ? "Replace Exercise" : "Choose Exercise"}
        </h2>
        <div className={styles.categoryContainer}>
          <p>Filter by Category</p>
          <div className={styles.categories}>
            <button
              type="button"
              className={`${styles.categoryBtn} ${chosenExerciseCategory === "" && "active"}`}
              onClick={() => setChosenExerciseCategory("")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.categoryBtn} ${chosenExerciseCategory === category ? "active" : ""}`}
                onClick={() => setChosenExerciseCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.exerciseContainer}>
          <div className={styles.exerciseList}>
            {availableExercises.length === 0 ? (
              <p>You dont have any exercises, add some first</p>
            ) : (
              availableExercises
                .filter((exercise) => {
                  if (chosenExerciseCategory === "") return true;
                  return exercise.category === chosenExerciseCategory;
                })
                .map((exercise) => (
                  <button
                    type="button"
                    key={exercise.id}
                    className={cn(
                      styles.exerciseElement,
                      chosenExercise?.id === exercise.id && styles.selected,
                    )}
                    onClick={() => setChosenExercise(exercise)}
                  >
                    <span>{exercise.name}</span>{" "}
                    <span className={styles.exerciseCategory}>
                      {exercise.category}
                    </span>
                  </button>
                ))
            )}
          </div>
          <div className={styles.hint}>
            <p className={styles.hint}>Selected exercise:</p>
            <p
              className={
                chosenExercise
                  ? styles.selectedExerciseName
                  : styles.selectedExerciseEmpty
              }
            >
              {chosenExercise ? chosenExercise.name : "Tap an exercise above"}
            </p>
          </div>
        </div>
        <button
          className={styles.createExerciseBtn}
          onClick={() => setShowModal(true)}
        >
          + Create Exercise
        </button>
        <div className="buttonContainer">
          <button
            className={cn(styles.addBtn, "button")}
            onClick={() => {
              if (chosenExercise) chooseExercise(chosenExercise);
            }}
          >
            {initialSelectedExerciseId ? "Replace" : "Add"}
          </button>
          <button className={cn(styles.backBtn, "button")} onClick={onClose}>
            Back
          </button>
        </div>
        {showModal && (
          <CreateExerciseModal
            onClose={() => setShowModal(false)}
            onAddExercise={addExercise}
          />
        )}
      </div>
    </div>
  );
};

export default ChooseExerciseModal;

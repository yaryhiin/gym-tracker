import cn from "classnames";
import { useState } from "react";

import styles from "../styles//modules/Modal.module.scss";

import type { ExerciseDB } from "../types/exercise";

import CreateExerciseModal from "./CreateExerciseModal";

type ChooseExerciseModalProps = {
  exercises: ExerciseDB[];
  onClose: () => void;
  addExercise: (name: string, category: string) => void;
  chooseExercise: (exercise: ExerciseDB) => void;
};

const ChooseExerciseModal = ({
  exercises,
  onClose,
  addExercise,
  chooseExercise,
}: ChooseExerciseModalProps) => {
  const categories = [
    ...new Set(exercises.map((exercise) => exercise.category)),
  ];
  const [chosenExerciseCategory, setChosenExerciseCategory] = useState("");
  const [chosenExercise, setChosenExercise] = useState<ExerciseDB>();

  const [showModal, setShowModal] = useState(false);
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Select Exercise</h2>
        <div className={styles.categoryContainer}>
          {exercises.length != 0 && <h2>Sort by Category</h2>}
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.categoryBtn} ${chosenExerciseCategory === category && styles.active}`}
              onClick={() => setChosenExerciseCategory(category)}
            >
              {category}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.categoryBtn} ${chosenExerciseCategory === "" && styles.active}`}
            onClick={() => setChosenExerciseCategory("")}
          >
            All
          </button>
        </div>
        <div className={styles.exerciseList}>
          {exercises.length === 0 ? (
            <p>You dont have any exercises, add some first</p>
          ) : (
            exercises
              .filter((exercise) => {
                if (chosenExerciseCategory === "") return true;
                return exercise.category === chosenExerciseCategory;
              })
              .map((exercise) => (
                <div key={exercise.id} className={styles.exerciseElement}>
                  <button
                    type="button"
                    className={cn(
                      styles.exerciseBtn,
                      chosenExercise?.id === exercise.id && styles.active,
                    )}
                    onClick={() => setChosenExercise(exercise)}
                  >
                    {exercise.name} - {exercise.category}
                  </button>
                </div>
              ))
          )}
        </div>
        <button
          className={styles.createExerciseBtn}
          onClick={() => setShowModal(true)}
        >
          + Create Exercise
        </button>
        <div className={styles.buttons}>
          <button
            className={cn(styles.addBtn, "button")}
            onClick={() => {
              if (chosenExercise) chooseExercise(chosenExercise);
            }}
          >
            Add
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

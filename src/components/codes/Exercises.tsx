import CreateExerciseModal from "./CreateExerciseModal";
import styles from "../styles/Exercises.module.scss";
import type { ExerciseDB } from "../../types";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

type ExercisesProps = {
  exercises: ExerciseDB[];
  addExercise: (name: string, category: string) => void;
  deleteExercise: (id: string) => void;
};

const Exercises = ({
  exercises,
  addExercise,
  deleteExercise,
}: ExercisesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;
  const [chosenExerciseId, setChosenExerciseId] = useState("");
  return (
    <div className={styles.exercisesContainer}>
      <h1 className={styles.title}>Exercises</h1>
      <div className={styles.exercisesList}>
        {exercises.map((exercise) => (
          <div key={exercise.id} className={styles.exerciseElement}>
            <p>
              {exercise.name} - {exercise.category}
            </p>
            <button className={styles.editExerciseBtn}>Edit</button>
            <button
              className={styles.deleteExerciseBtn}
              onClick={() => {
                setShowMessageModal(true);
                setChosenExerciseId(exercise.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.createExerciseBtn}
          onClick={() => setShowModal(true)}
        >
          + Create Exercise
        </button>
      </div>
      {showModal && (
        <CreateExerciseModal
          onClose={() => setShowModal(false)}
          onAddExercise={addExercise}
        />
      )}
      {showMessageModal && (
        <DeleteModal
          title={title}
          text={text}
          onClose={() => setShowMessageModal(false)}
          onDelete={() => {
            deleteExercise(chosenExerciseId);
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Exercises;

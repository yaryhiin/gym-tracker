import { useState, useEffect } from "react";
import styles from "../styles/RoutineBuilder.module.scss";

import DeleteModal from "./DeleteModal";
import ChooseExerciseModal from "./ChooseExerciseModal";

import type {
  Routine,
  ExerciseDB,
  RoutineExercise,
  RoutineDB,
} from "../../types";

type RoutineBuilderProps = {
  createRoutine: (routine: Routine) => void;
  exercises: ExerciseDB[];
  addExercise: (name: string, category: string) => void;
  routines: RoutineDB[];
};

const RoutineBuilder = ({
  createRoutine,
  exercises,
  addExercise,
  routines,
}: RoutineBuilderProps) => {
  const [routineName, setRoutineName] = useState<string>(() => {
    const savedRoutineName = localStorage.getItem("routineName");
    return savedRoutineName ?? "";
  });
  const [selectedExercisesDB, setSelectedExercisesDB] = useState<ExerciseDB[]>(
    () => {
      const savedExercisesDB = localStorage.getItem("routineExercisesDB");
      if (savedExercisesDB) {
        return JSON.parse(savedExercisesDB);
      }
      return [];
    },
  );
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>(
    () => {
      const savedExercises = localStorage.getItem("routineExercises");
      if (savedExercises) {
        return JSON.parse(savedExercises);
      }
      return [];
    },
  );
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [chosenExerciseId, setChosenExerciseId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChooseExerciseModal, setShowChooseExerciseModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise from your Routine?`;

  function chooseExercise(exercise: ExerciseDB) {
    setSelectedExercisesDB((prev) => [...prev, exercise]);
    setSelectedExercises((prev) => [
      ...prev,
      { exercise_id: exercise.id, order_index: orderIndex },
    ]);
    setOrderIndex((prev) => prev + 1);
    setShowChooseExerciseModal(false);
  }

  useEffect(() => {
    localStorage.setItem("routineName", routineName);
  }, [routineName]);

  useEffect(() => {
    localStorage.setItem("routineExercises", JSON.stringify(selectedExercises));
  }, [selectedExercises]);

  useEffect(() => {
    localStorage.setItem(
      "routineExercisesDB",
      JSON.stringify(selectedExercisesDB),
    );
  }, [selectedExercisesDB]);
  return (
    <div className={styles.routineBuilderContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Routine Name: </h2>
        <input
          className={styles.input}
          type="text"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
      <div className={styles.selectedExercisesList}>
        {selectedExercisesDB.map((exercise) => (
          <div key={exercise.id} className={styles.selectedExerciseElement}>
            <p>
              {exercise.name} - {exercise.category}
            </p>
            <button className={styles.editExerciseBtn}>Edit</button>
            <button
              className={styles.deleteExerciseBtn}
              onClick={() => {
                setShowDeleteModal(true);
                setChosenExerciseId(exercise.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className={styles.addExerciseBtn}
        onClick={() => setShowChooseExerciseModal(true)}
      >
        + Add Exercise
      </button>
      <div className={styles.buttonContainer}>
        <button
          className={styles.saveRoutine}
          onClick={() => {
            createRoutine({ name: routineName, exercises: selectedExercises });
            localStorage.removeItem("routineName");
            localStorage.removeItem("routineExercises");
            localStorage.removeItem("routineExercisesDB");
          }}
        >
          Save Routine
        </button>
      </div>
      {showDeleteModal && (
        <DeleteModal
          title={title}
          text={text}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            setSelectedExercisesDB((prev) =>
              prev.filter((exercise) => exercise.id != chosenExerciseId),
            );
            setSelectedExercises((prev) =>
              prev.filter(
                (exercise) => exercise.exercise_id != chosenExerciseId,
              ),
            );
            setOrderIndex((prev) => prev - 1);
            setShowDeleteModal(false);
          }}
        />
      )}
      {showChooseExerciseModal && (
        <ChooseExerciseModal
          exercises={exercises}
          onClose={() => setShowChooseExerciseModal(false)}
          addExercise={addExercise}
          chooseExercise={chooseExercise}
        />
      )}
    </div>
  );
};

export default RoutineBuilder;

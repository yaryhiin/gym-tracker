import { useState, useEffect } from "react";

import styles from "../styles/modules/Exercises.module.scss";

import type { ExerciseDB } from "../types/exercise";

import CreateExerciseModal from "../components/CreateExerciseModal";
import DeleteModal from "../components/DeleteModal";
import {
  createExercise,
  getExercises,
  deleteExercise,
} from "../services/exercises";

const Exercises = () => {
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;
  const [chosenExerciseId, setChosenExerciseId] = useState("");

  const [loading, setLoading] = useState(true);
  async function loadData() {
    setLoading(true);
    try {
      const exercisesData = await getExercises();
      setExercises(exercisesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  async function addExercise(name: string, category: string) {
    await createExercise({ name, category });
    await loadData();
  }

  async function handleDeleteExercise(id: string) {
    await deleteExercise(id);
    setExercises((prev) => prev.filter((exercise) => exercise.id != id));
  }

  if (loading) {
    return <p>Loading...</p>;
  }
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
            handleDeleteExercise(chosenExerciseId);
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Exercises;

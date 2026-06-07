import { useState, useEffect } from "react";

import styles from "../styles/modules/Exercises.module.scss";

import type { ExerciseDB } from "../types/exercise";

import CreateExerciseModal from "../components/CreateExerciseModal";
import ExecuteModal from "../components/ExecuteModal";
import {
  createExercise,
  getExercises,
  deleteExercise,
} from "../services/exercises";

const MODAL_TEXT = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;

const Exercises = () => {
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);
  const [chosenExerciseId, setChosenExerciseId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
      <div className={styles.header}>
        <h1 className={styles.title}>Exercises</h1>
        <p>Manage your exercises</p>
      </div>
      <div className={styles.exercisesList}>
        {exercises.map((exercise) => (
          <div key={exercise.id} className={styles.exerciseElement}>
            <div className={styles.exerciseElementTop}>
              <h3>{exercise.name}</h3>
              <p>{exercise.category}</p>
            </div>
            <div className={styles.exerciseElementButtons}>
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
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Delete"
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

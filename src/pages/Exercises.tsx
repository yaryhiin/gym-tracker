import { useState, useEffect } from "react";

import styles from "../styles/modules/Exercises.module.scss";

import type { ExerciseDB } from "../types/exercise";

import ManageExerciseModal from "../components/ManageExerciseModal";
import ExecuteModal from "../components/ExecuteModal";
import {
  createExercise,
  getExercises,
  deleteExercise,
  updateExercise,
} from "../services/exercises";

const MODAL_TEXT = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;

const Exercises = () => {
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);
  const [chosenExercise, setChosenExercise] = useState<ExerciseDB>(
    exercises[0],
  );
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  async function handleUpdateExercise(name: string, category: string) {
    await updateExercise(name, category, chosenExercise.id);
    await loadData();
  }

  async function handleDeleteExercise(exercise: ExerciseDB) {
    await deleteExercise(exercise.id);
    setExercises((prev) => prev.filter((ex) => ex.id != exercise.id));
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
              <button
                className={styles.editExerciseBtn}
                onClick={() => {
                  setShowEditModal(true);
                  setChosenExercise(exercise);
                }}
              >
                Edit
              </button>
              <button
                className={styles.deleteExerciseBtn}
                onClick={() => {
                  setShowMessageModal(true);
                  setChosenExercise(exercise);
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
          onClick={() => setShowCreateModal(true)}
        >
          + Create Exercise
        </button>
      </div>
      {showCreateModal && (
        <ManageExerciseModal
          onClose={() => setShowCreateModal(false)}
          onAddExercise={addExercise}
        />
      )}
      {showEditModal && (
        <ManageExerciseModal
          onClose={() => setShowEditModal(false)}
          onAddExercise={handleUpdateExercise}
          exercise={chosenExercise}
        />
      )}
      {showMessageModal && (
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Delete"
          onClose={() => setShowMessageModal(false)}
          onDelete={() => {
            handleDeleteExercise(chosenExercise);
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Exercises;

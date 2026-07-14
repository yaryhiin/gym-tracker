import { useState, useEffect } from "react";

import styles from "../styles/modules/Exercises.module.scss";

import type { ExerciseDB } from "../types/exercise";

import ManageExerciseModal from "../components/ManageExerciseModal";
import ExecuteModal from "../components/ExecuteModal";
import InfoModal from "../components/InfoModal";

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setSaving(true);
    try {
      await createExercise({ name, category });
      await loadData();
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding exercise:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateExercise(name: string, category: string) {
    setSaving(true);
    try {
      await updateExercise(name, category, chosenExercise.id);
      await loadData();
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating exercise:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExercise(exercise: ExerciseDB) {
    setDeleting(true);
    try {
      await deleteExercise(exercise.id);
      setExercises((prev) => prev.filter((ex) => ex.id != exercise.id));
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error deleting exercise:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.exercisesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Exercises</h1>
        {exercises.length > 0 ? (
          <p>Manage your exercises</p>
        ) : (
          <div className="emptyState">
            <p>No exercises yet</p>
            <p>Create your first exercise</p>
          </div>
        )}
        <button
          className={styles.createExerciseBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Create Exercise
        </button>
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
      {saving && <InfoModal type={"saving"} />}
      {deleting && <InfoModal type={"deleting"} />}
      {showErrorModal && <InfoModal type={"error"} />}
      {showSuccessModal && <InfoModal type={"success"} />}
    </div>
  );
};

export default Exercises;

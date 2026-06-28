import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/Routines.module.scss";

import type { RoutineDB } from "../types/routine";

import ExecuteModal from "../components/ExecuteModal";

import { getRoutines, deleteRoutine } from "../services/routines";

const MODAL_TEXT = `Are you sure you want to delete this routine?`;

const Routines = () => {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState<RoutineDB[]>([]);
  const [chosenRoutineId, setChosenRoutineId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const routinesData = await getRoutines();
      setRoutines(routinesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteRoutine(id: string) {
    await deleteRoutine(id);
    setRoutines((prev) => prev.filter((routine) => routine.id != id));
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.routinesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Routines</h1>
        {routines.length > 0 ? (
          <p>Manage your workout routines</p>
        ) : (
          <div className="emptyState">
            <p>No routines yet</p>
            <p>Create your first routine</p>
          </div>
        )}
      </div>
      <div className={styles.routinesList}>
        {routines.map((routine) => (
          <div key={routine.id} className={styles.routineElement}>
            <div className={styles.routineElementTop}>
              <h3>{routine.name}</h3>
              <p>{routine.exercises_count} Exercises</p>
              <p>{routine.categories.join(" • ")}</p>
            </div>
            <div className={styles.routineElementButtons}>
              <button
                className={styles.startRoutineBtn}
                onClick={() => navigate(`/workout/routine/${routine.id}`)}
              >
                Start
              </button>
              <button
                className={styles.editRoutineBtn}
                onClick={() => navigate(`/routines/${routine.id}/edit`)}
              >
                Edit
              </button>
              <button
                className={styles.deleteRoutineBtn}
                onClick={() => {
                  setShowMessageModal(true);
                  setChosenRoutineId(routine.id);
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
          className={styles.createRoutineBtn}
          onClick={() => navigate("/routines/new")}
        >
          + Create Routine
        </button>
      </div>
      {showMessageModal && (
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Delete"
          onClose={() => setShowMessageModal(false)}
          onDelete={() => {
            handleDeleteRoutine(chosenRoutineId);
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Routines;

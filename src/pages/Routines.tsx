import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/Routines.module.scss";

import type { RoutineDB } from "../types/routine";

import DeleteModal from "../components/DeleteModal";

import { getRoutines, deleteRoutine } from "../services/routines";

const Routines = () => {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState<RoutineDB[]>([]);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;
  const [chosenRoutineId, setChosenRoutineId] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteRoutine(id: string) {
    await deleteRoutine(id);
    setRoutines((prev) => prev.filter((routine) => routine.id != id));
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.routinesContainer}>
      <h1 className={styles.title}>Routines</h1>
      <div className={styles.routinesList}>
        {routines.map((routine) => (
          <div key={routine.id} className={styles.routineElement}>
            <p>{routine.name}</p>
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
        <DeleteModal
          title={title}
          text={text}
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

import { useState } from "react";
import styles from "../styles/Routines.module.scss";
import { useNavigate } from "react-router-dom";

import type { RoutineDB } from "../../types";
import DeleteModal from "./DeleteModal";

type RoutinesProps = {
  routines: RoutineDB[];
  deleteRoutine: (id: string) => void;
};

const Routines = ({ routines, deleteRoutine }: RoutinesProps) => {
  const navigate = useNavigate();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise? \n It will be removed from your existing routines`;
  const [chosenRoutineId, setChosenRoutineId] = useState("");
  return (
    <div className={styles.routinesContainer}>
      <h1 className={styles.title}>Routines</h1>
      <div className={styles.routinesList}>
        {routines.map((routine) => (
          <div key={routine.id} className={styles.routineElement}>
            <p>{routine.name}</p>
            <button className={styles.editRoutineBtn}>Edit</button>
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
            deleteRoutine(chosenRoutineId);
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Routines;

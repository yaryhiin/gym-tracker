import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/Home.module.scss";
import type { RoutineDB } from "../types/routine";

type ChooseRoutineModal = {
  routines: RoutineDB[];
  onClose: () => void;
};

const ChooseRoutineModal = ({ routines, onClose }: ChooseRoutineModal) => {
  const navigate = useNavigate();

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">Choose Routine:</h2>
        <div className={styles.routinesList}>
          {routines.map((routine) => (
            <button
              className={styles.routineElement}
              key={routine.id}
              onClick={() => navigate(`/workout/routine/${routine.id}`)}
            >
              <span className={styles.routineName}>{routine.name}</span>
              <span className={styles.routineMeta}>
                {routine.exercises_count} exercises
              </span>
            </button>
          ))}
          <br></br>
          <button
            className={`${styles.routineElement} ${styles.customWorkout}`}
            onClick={() => navigate("/workout")}
          >
            <span className={styles.routineName}>Custom Workout</span>
            <span className={styles.routineMeta}>Start without a routine</span>
          </button>
        </div>
        <div className="buttonContainer">
          <button
            className={`${styles.backBtn} button`}
            onClick={() => onClose()}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoutineModal;

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "../styles/modules/Home.module.scss";
import type { RoutineDB } from "../types/routine";

type ChooseRoutineModal = {
  routines: RoutineDB[];
  onClose: () => void;
};

const ChooseRoutineModal = ({ routines, onClose }: ChooseRoutineModal) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">{t("chooseRoutine.title")}</h2>
        <div className={styles.routinesList}>
          {routines.map((routine) => (
            <button
              className={styles.routineElement}
              key={routine.id}
              onClick={() => navigate(`/workout/routine/${routine.id}`)}
            >
              <span className={styles.routineName}>{routine.name}</span>
              <span className={styles.routineMeta}>
                {routine.exercises_count} {t("chooseRoutine.exercises")}
              </span>
            </button>
          ))}
          <br></br>
          <button
            className={`${styles.routineElement} ${styles.customWorkout}`}
            onClick={() => navigate("/workout")}
          >
            <span className={styles.routineName}>
              {t("chooseRoutine.emptyState.title")}
            </span>
            <span className={styles.routineMeta}>
              {t("chooseRoutine.emptyState.description")}
            </span>
          </button>
        </div>
        <div className="buttonContainer">
          <button
            className={`${styles.backBtn} button`}
            onClick={() => onClose()}
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoutineModal;

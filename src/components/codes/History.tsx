import styles from "../styles/History.module.scss";
import type { WorkoutDB } from "../../types";
import { useNavigate } from "react-router-dom";

import { formatDate, formatTime } from "../../utils";

type HistoryProps = {
  workouts: WorkoutDB[];
};

const History = ({ workouts }: HistoryProps) => {
  const navigate = useNavigate();
  return (
    <div className={styles.historyContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.workouts}>
          <thead>
            <tr>
              <td>Date</td>
              <td>Workout</td>
              <td>Duration</td>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr
                key={workout.id}
                onClick={() => navigate(`/changeWorkout/${workout.id}`)}
              >
                <td>{formatDate(workout.created_at)}</td>
                <td>{workout.name}</td>
                <td>{formatTime(workout.duration_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default History;

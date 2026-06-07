import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/History.module.scss";

import type { WorkoutDB } from "../types/workout";

import { formatDate, formatTime } from "../services/utils";
import { getWorkoutsHistory } from "../services/workouts";

const History = () => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const workoutsData = await getWorkoutsHistory();
        setWorkouts(workoutsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.historyContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.workouts}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Workout</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout.id}>
                <td>{formatDate(workout.created_at)}</td>
                <td>{workout.name}</td>
                <td>{formatTime(workout.duration_seconds)} </td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => navigate(`/history/${workout.id}`)}>
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/history/${workout.id}/edit`)}
                    >
                      Change
                    </button>
                  </div>
                </td>
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

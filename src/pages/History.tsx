import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/History.module.scss";

import type { WorkoutDB } from "../types/workout";

import { formatDate, formatDuration } from "../services/utils";
import { getWorkoutsHistory } from "../services/workouts";

type SortKey = "duration_seconds" | "started_at" | "name";

type SortDirection = "asc" | "desc";

type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};

const History = () => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "started_at",
    direction: "desc",
  });
  const arrow = sortConfig.direction === "asc" ? "▴" : "▾";

  const sortedWorkouts = [...workouts].sort((a: WorkoutDB, b: WorkoutDB) => {
    const { key, direction } = sortConfig as SortConfig;

    let aValue: string | number | Date;
    let bValue: string | number | Date;

    if (key === "started_at") {
      aValue = new Date(a.started_at ?? a.created_at);
      bValue = new Date(b.started_at ?? b.created_at);
    } else if (key === "duration_seconds") {
      aValue = Number(a.duration_seconds);
      bValue = Number(b.duration_seconds);
    } else {
      aValue = a.name;
      bValue = b.name;
    }

    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    if (aValue < bValue) return direction === "asc" ? -1 : 1;

    return 0;
  });

  function handleSort(key: SortKey) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

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
              <th onClick={() => handleSort("started_at")}>
                <span className={styles.tableHeaderContent}>
                  Date <span>{sortConfig.key === "started_at" && arrow}</span>
                </span>
              </th>
              <th onClick={() => handleSort("name")}>
                <span className={styles.tableHeaderContent}>
                  Workout <span>{sortConfig.key === "name" && arrow}</span>
                </span>
              </th>
              <th onClick={() => handleSort("duration_seconds")}>
                <span className={styles.tableHeaderContent}>
                  Duration{" "}
                  <span>{sortConfig.key === "duration_seconds" && arrow}</span>
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedWorkouts.map((workout) => (
              <tr key={workout.id}>
                <td>{formatDate(workout.created_at)}</td>
                <td>{workout.name}</td>
                <td>{formatDuration(workout.duration_seconds)} </td>
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

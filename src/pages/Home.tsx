import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/Home.module.scss";

import type { RoutineDB } from "../types/routine";
import type { WorkoutDB } from "../types/workout";

import { getWorkoutsHistory } from "../services/workouts";
import { getRoutines } from "../services/routines";

import { formatDate, formatTime } from "../services/utils";

type homeProps = {
  userName: string;
};

const Home = ({ userName }: homeProps) => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [routines, setRoutines] = useState<RoutineDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const workoutsData = await getWorkoutsHistory();
        setWorkouts(workoutsData);
        const routinesData = await getRoutines();
        setRoutines(routinesData);
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
    <div className={styles.home}>
      <h1 className={styles.title}>Good evening, {userName}</h1>
      <div className={styles.routinesContainer}>
        <h2 className={styles.routinesTitle}>Start Workout</h2>
        <div className={styles.routinesList}>
          <p>Choose Routine:</p>
          {routines.map((routine) => (
            <div className={styles.routineElement} key={routine.id}>
              <button
                className={styles.button}
                onClick={() => navigate(`/workout/routine/${routine.id}`)}
              >
                {routine.name}
              </button>
            </div>
          ))}
          <button
            className={styles.button}
            onClick={() => navigate("/workout")}
          >
            Custom Workout
          </button>
        </div>
      </div>
      <div className={styles.history}>
        <h2 className={styles.title}>Recent workouts</h2>

        {workouts
          .toSorted(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 3)
          .map((workout) => (
            <div
              className={styles.historyElement}
              onClick={() => navigate(`/changeWorkout/${workout.id}`)}
              key={workout.id}
            >
              <p className={styles.descName}>
                {workout.name} - {formatDate(workout.created_at)}
              </p>
              <div className={styles.descWorkout}>
                <p>Duration: {formatTime(workout.duration_seconds)}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;

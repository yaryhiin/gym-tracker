import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/Home.module.scss";

import type { RoutineDB } from "../types/routine";
import type { WorkoutDB } from "../types/workout";

import { getWorkoutsHistory } from "../services/workouts";
import { getRoutines } from "../services/routines";

import { formatDate, formatDuration } from "../services/utils";

import ChooseRoutineModal from "../components/ChooseRoutineModal";

type HomeProps = {
  name: string;
};

const Home = ({ name }: HomeProps) => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [routines, setRoutines] = useState<RoutineDB[]>([]);
  const [loading, setLoading] = useState(true);

  const [showChooseRoutineModal, setShowChooseRoutineModal] = useState(false);

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
      <h1 className={styles.title}>
        {new Date().getHours() < 4
          ? "Good night"
          : new Date().getHours() < 12
            ? "Good morning"
            : new Date().getHours() < 18
              ? "Good afternoon"
              : "Good evening"}
        , {name}
      </h1>
      <button
        className={styles.startBtn}
        onClick={() => setShowChooseRoutineModal(true)}
      >
        Start Workout
      </button>
      {showChooseRoutineModal && (
        <ChooseRoutineModal
          routines={routines}
          onClose={() => setShowChooseRoutineModal(false)}
        />
      )}
      <div className={styles.history}>
        <h2 className={styles.title}>Recent workouts</h2>

        {workouts.length > 0 ? (
          workouts
            .toSorted(
              (a, b) =>
                new Date(b.finished_at).getTime() -
                new Date(a.finished_at).getTime(),
            )
            .slice(0, 3)
            .map((workout) => (
              <div
                className={styles.historyElement}
                onClick={() => navigate(`/history/${workout.id}`)}
                key={workout.id}
              >
                <p className={styles.descName}>
                  {workout.name} - {formatDate(workout.started_at)}
                </p>
                <div className={styles.descWorkout}>
                  <p>Duration: {formatDuration(workout.duration_seconds)}</p>
                </div>
              </div>
            ))
        ) : (
          <div className={styles.emptyText}>
            <h3>No recent workouts.</h3>
            <p>Finish your first workout to see it here.</p>
          </div>
        )}

        {workouts.length > 3 && (
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/history")}
          >
            View All
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

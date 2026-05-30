import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import type { RoutineDB, WorkoutDB } from "../../types";
import { formatDate, formatTime } from "../../utils";

type homeProps = {
  userName: string;
  workouts: WorkoutDB[];
  routines: RoutineDB[];
};

const Home = ({ userName, workouts, routines }: homeProps) => {
  const navigate = useNavigate();
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

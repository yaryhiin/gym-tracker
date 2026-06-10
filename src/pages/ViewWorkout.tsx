import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { Workout } from "../types/workout";

import WorkoutForm from "../components/WorkoutForm";

import { getWorkoutDetails } from "../services/workouts";
import { formatTime } from "../services/utils";

const ChangeWorkout = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout>({
    name: "Custom Workout",
    started_at: Date.now().toString(),
    finished_at: "",
    duration_seconds: 0,
    exercises: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const workoutDetails = await getWorkoutDetails(String(workoutId));
        setWorkout({
          name: workoutDetails.name,
          started_at: workoutDetails.started_at,
          finished_at: workoutDetails.finished_at,
          duration_seconds: workoutDetails.duration_seconds,
          exercises: [...workoutDetails.workout_exercises]
            .sort((a, b) => a.order_index - b.order_index)
            .map((item) => ({
              id: item.id,
              exercise_id: item.exercise_id,
              exercise_name: item.exercise_name,
              category: item.exercise_category,
              order_index: item.order_index,
              notes: "",
              sets: [...item.workout_sets]
                .sort((a, b) => a.set_number - b.set_number)
                .map((item) => ({
                  set_number: item.set_number,
                  weight: item.weight,
                  reps: item.reps,
                  rest_seconds: item.rest_seconds,
                  done: item.done,
                })),
            })),
        });
      } catch (error) {
        console.error("Error loading data: ", error);
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
    <div className={styles.workoutContainer}>
      <div className={styles.header}>
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/history/${workoutId}/edit`)}
        >
          Edit
        </button>
        <div>
          <h3 className={styles.title}>{workout?.name}</h3>

          <p className={styles.stopwatch}>
            {formatTime(workout?.duration_seconds)}
          </p>
        </div>
      </div>
      <WorkoutForm workout={workout} readonly={true} />
      <div className={styles.buttonContainerChange}>
        <button
          className={styles.backBtn}
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ChangeWorkout;

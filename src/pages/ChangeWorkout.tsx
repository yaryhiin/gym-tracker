import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { Workout } from "../types/workout";

import ExecuteModal from "../components/ExecuteModal";
import WorkoutForm from "../components/WorkoutForm";

import {
  getWorkoutDetails,
  deleteWorkout,
  updateWorkout,
} from "../services/workouts";
import { formatTime } from "../services/utils";

const CHANGE_WORKOUT_KEY = "changeWorkout";

const MODAL_TEXT = `Are you sure you want to delete this workout? \n This action cannot be undone.`;

function createEmptyWorkout(): Workout {
  return {
    name: "Custom Workout",
    started_at: Date.now().toString(),
    finished_at: "",
    duration_seconds: 0,
    exercises: [],
  };
}

function getInitialWorkout() {
  const savedWorkout = localStorage.getItem(CHANGE_WORKOUT_KEY);

  if (savedWorkout) {
    try {
      return JSON.parse(savedWorkout) as Workout;
    } catch {
      localStorage.removeItem(CHANGE_WORKOUT_KEY);
    }
  }

  return createEmptyWorkout();
}

const ChangeWorkout = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout>(getInitialWorkout);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedWorkout = localStorage.getItem(CHANGE_WORKOUT_KEY);
    if (savedWorkout) {
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    localStorage.setItem(CHANGE_WORKOUT_KEY, JSON.stringify(workout));
  }, [workout]);

  async function handleDelete() {
    await deleteWorkout(String(workoutId));
    localStorage.removeItem(CHANGE_WORKOUT_KEY);
    setShowModal(false);
    navigate("/");
  }

  async function handleUpdate() {
    await updateWorkout(workout, String(workoutId));
    localStorage.removeItem(CHANGE_WORKOUT_KEY);
    navigate("/");
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.workoutContainer}>
      <div className={styles.header}>
        <button className={styles.saveBtn} onClick={handleUpdate}>
          Save Changes
        </button>
        <div>
          <h3 className={styles.title}>{workout?.name}</h3>
          <p className={styles.stopwatch}>
            {formatTime(workout?.duration_seconds)}
          </p>
        </div>
      </div>

      <WorkoutForm workout={workout} readonly={false} setWorkout={setWorkout} />
      {showModal && (
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Delete"
          onClose={() => {
            setShowModal(false);
          }}
          onDelete={handleDelete}
        />
      )}
      <div className={styles.buttonContainerChange}>
        <button
          className={styles.backBtn}
          onClick={() => {
            navigate("/");
            localStorage.removeItem(CHANGE_WORKOUT_KEY);
          }}
        >
          Back
        </button>
        <button className={styles.deleteBtn} onClick={() => setShowModal(true)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ChangeWorkout;

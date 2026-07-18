import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { ExerciseDB } from "../types/exercise";
import type { Workout } from "../types/workout";

import ExecuteModal from "../components/ExecuteModal";
import WorkoutForm from "../components/WorkoutForm";

import InfoModal from "../components/InfoModal";

import { createExercise, getExercises } from "../services/exercises";
import {
  getWorkoutDetails,
  deleteWorkout,
  updateWorkout,
} from "../services/workouts";
import { formatTime } from "../services/utils";
import { getProfile } from "../services/profiles";
import type { PreferredWeightUnit } from "../types/profile";

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
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);
  const [preferredUnit, setPreferredUnit] = useState<PreferredWeightUnit>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
              notes: item.notes,
              sets: [...item.workout_sets]
                .sort((a, b) => a.set_number - b.set_number)
                .map((item) => ({
                  set_number: item.set_number,
                  weight:
                    preferredUnit === "lb"
                      ? Math.round(item.weight * 2.20462262 * 10) / 10
                      : item.weight,
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
    setDeleting(true);
    try {
      await deleteWorkout(String(workoutId));
      localStorage.removeItem(CHANGE_WORKOUT_KEY);
      setShowModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error deleting workout:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setDeleting(false);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const exercisesData = await getExercises();
      if (exercisesData) {
        setExercises(exercisesData);
      }
      const data = await getProfile();
      if (data) {
        setPreferredUnit(data.preferred_workout_unit);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addExercise(name: string, category: string) {
    setSaving(true);
    try {
      await createExercise({ name, category });
      await loadData();
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding exercise:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    const formattedWorkoutExercises = workout.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        ...set,
        weight:
          preferredUnit === "lb"
            ? Math.round((set.weight / 2.20462262) * 100) / 100
            : set.weight,
      })),
    }));
    setSaving(true);
    try {
      await updateWorkout(
        { ...workout, exercises: formattedWorkoutExercises },
        String(workoutId),
      );
      localStorage.removeItem(CHANGE_WORKOUT_KEY);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error updating workout:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.workoutContainer}>
      <div className={styles.header}>
        <div>
          <button
            className={styles.backBtn}
            onClick={() => {
              navigate("/");
              localStorage.removeItem(CHANGE_WORKOUT_KEY);
            }}
          >
            Back
          </button>
        </div>
        <div>
          <h3 className={styles.title}>{workout?.name}</h3>
          <p className={styles.stopwatch}>
            {formatTime(workout?.duration_seconds)}
          </p>
        </div>
        <div></div>
      </div>

      <WorkoutForm
        workout={workout}
        readonly={false}
        setWorkout={setWorkout}
        exercises={exercises}
        addExercise={addExercise}
        preferredUnit={preferredUnit}
      />
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
      <div className={styles.buttonContainer}>
        <button className={styles.deleteBtn} onClick={() => setShowModal(true)}>
          Delete
        </button>
        <button className={styles.saveBtn} onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
      {saving && <InfoModal type={"saving"} />}
      {deleting && <InfoModal type={"deleting"} />}
      {showErrorModal && <InfoModal type={"error"} />}
      {showSuccessModal && <InfoModal type={"success"} />}
    </div>
  );
};

export default ChangeWorkout;

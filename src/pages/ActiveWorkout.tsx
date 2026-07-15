import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { Workout } from "../types/workout";
import type { ExerciseDB } from "../types/exercise";

import ExecuteModal from "../components/ExecuteModal";
import WorkoutForm from "../components/WorkoutForm";

import { getRoutineDetails } from "../services/routines";
import { createExercise, getExercises } from "../services/exercises";
import { createWorkout, getPreviousExerciseData } from "../services/workouts";
import { formatTime } from "../services/utils";
import InfoModal from "../components/InfoModal";
import type { PreferredWeightUnit } from "../types/profile";
import { getProfile } from "../services/profiles";

const ACTIVE_WORKOUT_KEY = "activeWorkout";
const ACTIVE_WORKOUT_SECONDS_KEY = "activeWorkoutSeconds";

const BACK_TEXT = `Are you sure you want to exit workout? \n The data will be lost`;
const FINISH_TEXT = `Are you sure you want to finish this workout?`;

function createEmptyWorkout(): Workout {
  return {
    name: "Custom Workout",
    started_at: new Date().toISOString(),
    finished_at: "",
    duration_seconds: 0,
    exercises: [],
  };
}

function getInitialSeconds() {
  const savedSeconds = localStorage.getItem(ACTIVE_WORKOUT_SECONDS_KEY);
  if (!savedSeconds) return 0;

  const parsedSeconds = Number(savedSeconds);
  return Number.isNaN(parsedSeconds) ? 0 : parsedSeconds;
}

function getInitialWorkout() {
  const savedWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);

  if (savedWorkout) {
    try {
      return JSON.parse(savedWorkout) as Workout;
    } catch {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }

  return createEmptyWorkout();
}

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();

  const [workout, setWorkout] = useState<Workout>(getInitialWorkout);
  const [seconds, setSeconds] = useState(getInitialSeconds);
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);
  const [preferredUnit, setPreferredUnit] = useState<PreferredWeightUnit>();
  const [previousData, setPreviousData] = useState<Record<string, any>>({});
  const exerciseIdsKey = workout.exercises
    .map((exercise) => exercise.exercise_id)
    .join(",");
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showBackModal, setShowBackModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const savedWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (savedWorkout) {
      return;
    }
    if (routineId) {
      async function getDetails() {
        try {
          const routine = await getRoutineDetails(String(routineId));
          if (routine) {
            setWorkout({
              name: routine.name,
              started_at: new Date().toISOString(),
              finished_at: "",
              duration_seconds: seconds,
              exercises: [...routine.routine_exercises]
                .sort((a, b) => a.order_index - b.order_index)
                .map((item) => ({
                  id: item.id,
                  exercise_id: item.exercise_id,
                  exercise_name: item.exercises.name,
                  category: item.exercises.category,
                  order_index: item.order_index,
                  notes: "",
                  sets: [
                    {
                      set_number: 1,
                      weight: 0,
                      reps: 0,
                      rest_seconds: 0,
                      done: false,
                    },
                  ],
                })),
            });
          }
        } catch (error) {
          console.error("Error loading data: ", error);
        }
      }

      getDetails();
    } else {
      setWorkout({
        name: "Custom Workout",
        started_at: new Date().toISOString(),
        finished_at: "",
        duration_seconds: seconds,
        exercises: [],
      });
    }
  }, [routineId]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
  }, [workout]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_WORKOUT_SECONDS_KEY, String(seconds));
  }, [seconds]);

  useEffect(() => {
    async function loadPreviousData() {
      const exerciseIds = workout.exercises
        .map((exercise) => exercise.exercise_id)
        .filter(Boolean);
      if (exerciseIds.length === 0) return;

      const data = await getPreviousExerciseData(exerciseIds);
      setPreviousData(data);
    }

    loadPreviousData();
  }, [exerciseIdsKey]);

  async function loadData() {
    setLoading(true);
    try {
      const exercisesData = await getExercises();
      if (exercisesData.length) {
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

  async function finishWorkout() {
    setSaving(true);

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
    const finishedWorkout: Workout = {
      ...workout,
      exercises: formattedWorkoutExercises,
      finished_at: new Date().toISOString(),
      duration_seconds: seconds,
    };
    try {
      await createWorkout(finishedWorkout);

      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      localStorage.removeItem(ACTIVE_WORKOUT_SECONDS_KEY);

      setShowFinishModal(false);
      setIsRunning(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setShowFinishModal(false);
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
        <button
          className={cn(styles.backBtn, styles.button)}
          onClick={() => setShowBackModal(true)}
        >
          Exit
        </button>
        <div>
          <h3 className={styles.title}>{workout.name}</h3>
          <p className={styles.stopwatch}>{formatTime(seconds)}</p>
        </div>
      </div>
      <WorkoutForm
        workout={workout}
        setWorkout={setWorkout}
        exercises={exercises}
        previousData={previousData}
        addExercise={addExercise}
        readonly={false}
        preferredUnit={preferredUnit}
      />
      {showBackModal && (
        <ExecuteModal
          text={BACK_TEXT}
          btnText="Exit"
          onClose={() => setShowBackModal(false)}
          onDelete={() => {
            setShowBackModal(false);
            localStorage.removeItem(ACTIVE_WORKOUT_KEY);
            localStorage.removeItem(ACTIVE_WORKOUT_SECONDS_KEY);
            navigate("/");
          }}
        />
      )}
      {showFinishModal && (
        <ExecuteModal
          text={FINISH_TEXT}
          btnText="Finish"
          onDelete={finishWorkout}
          onClose={() => {
            setShowFinishModal(false);
          }}
        />
      )}

      <div className={styles.buttonContainer}>
        {!isRunning ? (
          <button
            className={cn(styles.button, styles.pauseBtn)}
            onClick={() => setIsRunning(true)}
          >
            Resume Workout
          </button>
        ) : (
          <button
            className={cn(styles.button, styles.pauseBtn)}
            onClick={() => setIsRunning(false)}
          >
            Pause Workout
          </button>
        )}

        <button
          className={cn(styles.button, styles.finishBtn)}
          onClick={() => setShowFinishModal(true)}
        >
          Finish Workout
        </button>
      </div>
      {saving && <InfoModal type={"saving"} />}
      {showErrorModal && <InfoModal type={"error"} />}
      {showSuccessModal && <InfoModal type={"success"} />}
    </div>
  );
};

export default ActiveWorkout;

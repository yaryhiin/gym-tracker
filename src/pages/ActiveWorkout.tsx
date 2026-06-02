import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { Workout, WorkoutSet } from "../types/workout";
import type { ExerciseDB } from "../types/exercise";

import ExecuteModal from "../components/ExecuteModal";
import ChooseExerciseModal from "../components/ChooseExerciseModal";

import { getRoutineDetails } from "../services/routines";
import { createExercise, getExercises } from "../services/exercises";
import { createWorkout } from "../services/workouts";
import { formatTime } from "../services/utils";

const ACTIVE_WORKOUT_KEY = "activeWorkout";
const ACTIVE_WORKOUT_SECONDS_KEY = "activeWorkoutSeconds";

const BACK_TEXT = `Are you sure you want to exit workout? \n The data will be lost`;
const FINISH_TEXT = `Are you sure you want to finish this workout?`;

function createEmptyWorkout(): Workout {
  return {
    name: "Custom Workout",
    started_at: Date.now().toString(),
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
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

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
              started_at: Date.now().toString(),
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
        started_at: Date.now().toString(),
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

  async function loadData() {
    setLoading(true);
    try {
      const exercisesData = await getExercises();
      setExercises(exercisesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addExercise(name: string, category: string) {
    await createExercise({ name, category });
    await loadData();
  }

  function addSet(exerciseId: string) {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  set_number: exercise.sets.length + 1,
                  weight: 0,
                  reps: 0,
                  rest_seconds: 0,
                  done: false,
                },
              ],
            }
          : exercise,
      ),
    }));
  }

  function updateSet(
    exerciseId: string,
    setNumber: number,
    field: keyof WorkoutSet,
    value: number | boolean,
  ) {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.set_number === setNumber ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    }));
  }

  function chooseExercise(exercise: ExerciseDB) {
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: exercise.id,
          exercise_name: exercise.name,
          exercise_id: exercise.id,
          category: exercise.category,
          order_index: prev.exercises.length + 1,
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
        },
      ],
    }));
    setShowModal(false);
  }

  async function finishWorkout() {
    setShowFinishModal(false);
    setIsRunning(false);

    const finishedWorkout: Workout = {
      ...workout,
      finished_at: Date.now().toString(),
      duration_seconds: seconds,
    };

    await createWorkout(finishedWorkout);

    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    localStorage.removeItem(ACTIVE_WORKOUT_SECONDS_KEY);

    setWorkout(finishedWorkout);
    setSeconds(0);
    navigate("/");
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.workoutContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>{workout.name}</h3>
        <p className={styles.stopwatch}>{formatTime(seconds)}</p>
        <button
          className={styles.backBtn}
          onClick={() => setShowBackModal(true)}
        >
          Back
        </button>
      </div>
      <div className={styles.exerciseContainer}>
        {workout.exercises.map((exercise) => (
          <div className={styles.exerciseCard} key={exercise.id}>
            <h2 className={styles.exerciseName}>{exercise.exercise_name}</h2>
            <p className={styles.exercisePrev}>Last time: 60kg x 8</p>
            <p className={styles.exerciseSuggest}>Suggested: 52.5kg x 6-8</p>

            <div className={styles.sets}>
              <table className={styles.set}>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight</th>
                    <th>Reps</th>
                    <th>Done</th>
                  </tr>
                </thead>

                <tbody>
                  {exercise.sets.map((set) => (
                    <tr key={set.set_number}>
                      <td>{set.set_number}</td>
                      <td>
                        <input
                          disabled={!isRunning}
                          type="number"
                          placeholder="Enter weight"
                          onChange={(e) =>
                            updateSet(
                              exercise.id,
                              set.set_number,
                              "weight",
                              Number(e.target.value),
                            )
                          }
                          value={set.weight === 0 ? "" : set.weight}
                        />
                      </td>
                      <td>
                        <input
                          disabled={!isRunning}
                          type="number"
                          placeholder="Enter reps"
                          onChange={(e) =>
                            updateSet(
                              exercise.id,
                              set.set_number,
                              "reps",
                              Number(e.target.value),
                            )
                          }
                          value={set.reps === 0 ? "" : set.reps}
                        />
                      </td>
                      <td>
                        <input
                          disabled={!isRunning}
                          type="checkbox"
                          onChange={(e) =>
                            updateSet(
                              exercise.id,
                              set.set_number,
                              "done",
                              e.target.checked,
                            )
                          }
                          checked={set.done}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                disabled={!isRunning}
                className={styles.addSet}
                onClick={() => addSet(exercise.id)}
              >
                Add Set
              </button>
            </div>
          </div>
        ))}

        <button
          className={styles.addExercise}
          onClick={() => setShowModal(true)}
          disabled={!isRunning}
        >
          Add Exercise
        </button>

        {showModal && (
          <ChooseExerciseModal
            exercises={exercises}
            onClose={() => setShowModal(false)}
            addExercise={addExercise}
            chooseExercise={chooseExercise}
          />
        )}
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
      </div>

      <div className={styles.buttonContainer}>
        {!isRunning ? (
          <button
            className={styles.pauseBtn}
            onClick={() => setIsRunning(true)}
          >
            Resume Workout
          </button>
        ) : (
          <button
            className={styles.pauseBtn}
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
    </div>
  );
};

export default ActiveWorkout;

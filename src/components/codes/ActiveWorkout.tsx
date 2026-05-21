import { useEffect, useState } from "react";
import Modal from "./Modal";
import styles from "../styles/ActiveWorkout.module.scss";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import MessageModal from "./MessageModal";

type WorkoutSet = {
  set_number: number;
  weight: number;
  reps: number;
  rest_seconds: number;
  done: boolean;
};

type Exercise = {
  id: string;
  exercise_name: string;
  category: string;
  order_index: number;
  notes: string;
  sets: WorkoutSet[];
};

type Workout = {
  name: string;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  exercises: Exercise[];
};

type ActiveWorkoutProps = {
  addWorkout: (workout: Workout) => Promise<void>;
};

const ActiveWorkout = ({ addWorkout }: ActiveWorkoutProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const title = "Confirm Action";
  const textBack = `Are you sure you want to exit workout? \n The data will be lost`;
  const textFinish = `Are you sure you want to finish this workout?`;

  const navigate = useNavigate();

  function home() {
    navigate("/");
  }

  const [workout, setWorkout] = useState<Workout>(() => ({
    name: "Push Day",
    started_at: Date.now().toString(),
    finished_at: "",
    duration_seconds: 0,
    exercises: [
      {
        id: `${Date.now().toString()}-bench`,
        exercise_name: "Bench Press",
        category: "chest",
        order_index: 1,
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

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  function formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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

  function addExercise(exerciseName: string) {
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: `${Date.now().toString()}-${exerciseName}`,
          exercise_name: exerciseName,
          category: "",
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
  }

  async function finishWorkout() {
    setShowFinishModal(false);
    setIsRunning(false);

    const finishedWorkout: Workout = {
      ...workout,
      finished_at: Date.now().toString(),
      duration_seconds: seconds,
    };

    setWorkout(finishedWorkout);

    await addWorkout(finishedWorkout);
    home();
  }

  return (
    <div className={styles.workoutContainer}>
      <h3 className={styles.title}>Push Day</h3>
      <p className={styles.stopwatch}>{formatTime(seconds)}</p>

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
          <Modal
            onClose={() => setShowModal(false)}
            onAddExercise={addExercise}
          />
        )}
        {showBackModal && (
          <MessageModal
            title={title}
            text={textBack}
            onDelete={() => {
              setShowBackModal(false);
              home();
            }}
            onClose={() => {
              setShowBackModal(false);
            }}
            twoButton={true}
            btnText="Exit"
          />
        )}
        {showFinishModal && (
          <MessageModal
            title={title}
            text={textFinish}
            onDelete={finishWorkout}
            onClose={() => {
              setShowFinishModal(false);
            }}
            twoButton={true}
            btnText="Finish"
          />
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.backBtn}
          onClick={() => setShowBackModal(true)}
        >
          Back
        </button>
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

import { useState } from "react";
import cn from "classnames";

import styles from "../styles/modules/WorkoutForm.module.scss";

import type { Workout, WorkoutSet } from "../types/workout";
import type { ExerciseDB } from "../types/exercise";
import type { Dispatch, SetStateAction } from "react";

import ChooseExerciseModal from "../components/ChooseExerciseModal";

type WorkoutFormProps = {
  workout: Workout;
  readonly: boolean;

  setWorkout?: Dispatch<SetStateAction<Workout>>;
  exercises?: ExerciseDB[];
  previousData?: Record<string, any>;
  addExercise?: (name: string, category: string) => Promise<void>;
};

const WorkoutForm = ({
  workout,
  readonly,
  setWorkout,
  exercises,
  previousData,
  addExercise,
}: WorkoutFormProps) => {
  const [showModal, setShowModal] = useState(false);

  function formatPreviousSets(previousExercise: any) {
    if (!previousExercise) return "No previous data";

    return [...previousExercise.workout_sets]
      .sort((a, b) => a.set_number - b.set_number)
      .map((set) => `${set.weight}kg x ${set.reps}`)
      .join(", ");
  }

  function addSet(exerciseId: string) {
    if (!setWorkout || readonly) return;

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
                  weight: exercise.sets[exercise.sets.length - 1].weight,
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
    if (!setWorkout) return;

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
    if (!setWorkout || readonly) return;

    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: crypto.randomUUID(),
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

  return (
    <div className={styles.exerciseContainer}>
      {workout.exercises.map((exercise) => (
        <div className={styles.exerciseCard} key={exercise.id}>
          <h2 className={styles.exerciseName}>{exercise.exercise_name}</h2>
          {previousData && (
            <p className={styles.exercisePrev}>
              Last time:{" "}
              {formatPreviousSets(previousData[exercise.exercise_id])}
            </p>
          )}
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
                        disabled={readonly}
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
                        disabled={readonly}
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
                        disabled={readonly}
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
            {!readonly && (
              <button
                className={cn(styles.addSet, styles.button)}
                onClick={() => addSet(exercise.id)}
              >
                Add Set
              </button>
            )}
          </div>
        </div>
      ))}

      {!readonly && (
        <button
          className={cn(styles.addExercise, styles.button)}
          onClick={() => setShowModal(true)}
        >
          Add Exercise
        </button>
      )}

      {showModal && exercises && addExercise && (
        <ChooseExerciseModal
          exercises={exercises}
          onClose={() => setShowModal(false)}
          addExercise={addExercise}
          chooseExercise={chooseExercise}
        />
      )}
    </div>
  );
};

export default WorkoutForm;

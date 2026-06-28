import { useState, useEffect } from "react";
import cn from "classnames";

import styles from "../styles/modules/WorkoutForm.module.scss";

import type { Workout, WorkoutSet } from "../types/workout";
import type { ExerciseDB } from "../types/exercise";
import type { PreferredWeightUnit } from "../types/profile";
import type { Dispatch, SetStateAction } from "react";

import ExecuteModal from "./ExecuteModal";
import ChooseExerciseModal from "../components/ChooseExerciseModal";

import { createLocalId } from "../services/utils";
import { getProfile } from "../services/profiles";

const MODAL_TEXT =
  "You sure you want to delete this exercise from workout \n All sets will be lost";

type WorkoutFormProps = {
  workout: Workout;
  readonly: boolean;

  setWorkout?: Dispatch<SetStateAction<Workout>>;
  exercises?: ExerciseDB[];
  previousData?: Record<string, any>;
  addExercise?: (name: string, category: string) => Promise<void>;
};

type PreviousExercise = {
  workout_sets: WorkoutSet[];
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
  const [showRemoveExerciseModal, setShowRemoveExerciseModal] = useState(false);
  const [chosenExerciseId, setChosenExerciseId] = useState("");
  const [preferredUnit, setPreferredUnit] = useState<PreferredWeightUnit>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getProfile();
        if (data) {
          setPreferredUnit(data.preferred_workout_unit);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function formatPreviousSets(previousExercise?: PreviousExercise | null) {
    if (!previousExercise) return "No previous data";

    const grouped = new Map<number, number[]>();

    [...previousExercise.workout_sets]
      .sort((a, b) => a.set_number - b.set_number)
      .filter((set) => set.done)
      .filter((set) => set.reps > 0)
      .forEach((set) => {
        const reps = grouped.get(set.weight) ?? [];
        reps.push(set.reps);
        grouped.set(set.weight, reps);
      });

    return [...grouped.entries()]
      .map(([weight, reps]) => {
        if (weight === 0) {
          return `BW × ${reps.join(", ")}`;
        }

        return `${preferredUnit === "lb" ? Math.round(weight * 2.20462262 * 10) / 10 : weight}${preferredUnit} x ${reps.join(", ")}`;
      })
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

  function deleteSet(exerciseId: string, setNumber: number) {
    if (!setWorkout) return;

    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.set_number !== setNumber)
                .map((set, index) => ({ ...set, set_number: index + 1 })),
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
          id: createLocalId(),
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

  function removeExercise(exerciseId: string) {
    if (exerciseId === "" || !setWorkout) return;
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises
          .filter((exercise) => exercise.id !== exerciseId)
          .map((exercise, index) => ({ ...exercise, order_index: index + 1 })),
      ],
    }));
    setChosenExerciseId("");
    setShowRemoveExerciseModal(false);
  }

  if (loading) {
    return <p>Loading...</p>;
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
          <div className={styles.exercises}>
            <table className={styles.sets}>
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight ({preferredUnit})</th>
                  <th>Reps</th>
                  <th className={styles.actionsTitle}>Done</th>
                </tr>
              </thead>

              <tbody>
                {exercise.sets.map((set) => (
                  <tr key={set.set_number} className={styles.set}>
                    <td>{set.set_number}</td>
                    <td>
                      <input
                        disabled={readonly}
                        type="number"
                        placeholder="0"
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
                        placeholder="0"
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
                    <td className={styles.actionsColumn}>
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
                      <button
                        hidden={readonly || exercise.sets.length < 2}
                        className={styles.deleteSet}
                        onClick={() => deleteSet(exercise.id, set.set_number)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!readonly && (
              <div className={styles.buttons}>
                <button
                  className={styles.addSet}
                  onClick={() => addSet(exercise.id)}
                >
                  Add Set
                </button>
                <button
                  className={styles.removeExercise}
                  onClick={() => {
                    setShowRemoveExerciseModal(true);
                    setChosenExerciseId(exercise.id);
                  }}
                >
                  Remove Exercise
                </button>
              </div>
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
      {showRemoveExerciseModal && (
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Delete"
          onClose={() => setShowRemoveExerciseModal(false)}
          onDelete={() => removeExercise(chosenExerciseId)}
        />
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

import { useState, useEffect } from "react";
import cn from "classnames";
import { MessageSquarePlus } from "lucide-react";

import styles from "../styles/modules/WorkoutForm.module.scss";

import type { WorkoutExercise, Workout, WorkoutSet } from "../types/workout";
import type { ExerciseDB } from "../types/exercise";
import type { PreferredWeightUnit } from "../types/profile";
import type { Dispatch, SetStateAction } from "react";

import ExecuteModal from "./ExecuteModal";
import ChooseExerciseModal from "../components/ChooseExerciseModal";

import { createLocalId } from "../services/utils";
import { formatTime } from "../services/utils";

const MODAL_TEXT =
  "You sure you want to delete this exercise from workout \n All sets will be lost";

const WORKOUT_SELECTED_EXERCISE_KEY = "workoutSelectedExercise";
const WORKOUT_SELECTED_SET_KEY = "workoutSelectedSet";
const WORKOUT_REST_START_KEY = "workoutRestStart";

type WorkoutFormProps = {
  workout: Workout;
  pageType: string;
  preferredUnit?: PreferredWeightUnit | null;

  setWorkout?: Dispatch<SetStateAction<Workout>>;
  exercises?: ExerciseDB[];
  previousData?: Record<string, any>;
  addExercise?: (name: string, category: string) => Promise<void>;
  handleUpdate?: () => Promise<void>;
};

type PreviousExercise = {
  workout_sets: WorkoutSet[];
};

const WorkoutForm = ({
  workout,
  pageType,
  setWorkout,
  exercises,
  previousData,
  addExercise,
  preferredUnit,
  handleUpdate,
}: WorkoutFormProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showRemoveExerciseModal, setShowRemoveExerciseModal] = useState(false);
  const [chosenExerciseId, setChosenExerciseId] = useState("");
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(
    getInitialSelectedSet,
  );
  const [restStart, setRestStart] = useState(getInitialRestStart);
  const [selectedExercise, setSelectedExercise] =
    useState<WorkoutExercise | null>(getInitialSelectedExercise);

  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (workout.exercises.length > 0) {
      const newExercise = selectedExercise
        ? (workout.exercises.find(
            (exercise) => exercise.id === selectedExercise.id,
          ) ?? null)
        : (workout.exercises[0] ?? null);
      setSelectedExercise(newExercise);
      if (selectedSet) return;
      setSelectedSet(newExercise?.sets[0] ?? null);
    }
  }, [workout.exercises]);

  useEffect(() => {
    if (pageType === "view") return;
    localStorage.setItem(
      WORKOUT_SELECTED_EXERCISE_KEY,
      JSON.stringify(selectedExercise),
    );
  }, [selectedExercise]);

  useEffect(() => {
    if (pageType === "view") return;
    localStorage.setItem(WORKOUT_SELECTED_SET_KEY, JSON.stringify(selectedSet));
  }, [selectedSet]);

  useEffect(() => {
    if (pageType === "view") return;
    localStorage.setItem(WORKOUT_REST_START_KEY, restStart);
  }, [restStart]);

  useEffect(() => {
    if (
      !restStart ||
      !selectedExercise ||
      !selectedSet ||
      pageType === "view" ||
      pageType === "change"
    )
      return;

    const interval = setInterval(() => {
      const timePassed = Date.now() - new Date(restStart).getTime();
      let setNumber = 0;
      let exerciseId = "";
      let completedSetFound = false;

      const exerciseIndex = selectedExercise.order_index - 1;

      for (let i = exerciseIndex; i >= 0 && !completedSetFound; i--) {
        const currentExercise = workout.exercises[i];
        const startingSetIndex =
          i === exerciseIndex
            ? selectedSet.set_number - 2
            : currentExercise.sets.length - 1;

        for (let j = startingSetIndex; j >= 0; j--) {
          const previousSet = currentExercise.sets[j];

          if (previousSet.done) {
            setNumber = previousSet.set_number;
            exerciseId = currentExercise.id;
            completedSetFound = true;
            break;
          }
        }
      }
      if (!setNumber || !exerciseId) return;

      updateSet(
        exerciseId,
        setNumber,
        "rest_seconds",
        Math.floor(timePassed / 1000),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [restStart, selectedExercise, selectedSet]);

  function getInitialSelectedExercise() {
    const savedSelectedExercise = localStorage.getItem(
      WORKOUT_SELECTED_EXERCISE_KEY,
    );

    if (savedSelectedExercise) {
      try {
        return JSON.parse(savedSelectedExercise) as WorkoutExercise;
      } catch {
        localStorage.removeItem(WORKOUT_SELECTED_EXERCISE_KEY);
      }
    }

    return workout?.exercises[0] ?? null;
  }

  function getInitialRestStart() {
    const savedRestStart = localStorage.getItem(WORKOUT_REST_START_KEY);

    if (savedRestStart) {
      try {
        return savedRestStart;
      } catch {
        localStorage.removeItem(WORKOUT_REST_START_KEY);
      }
    }

    return new Date().toISOString();
  }

  function getInitialSelectedSet() {
    const savedSelectedSet = localStorage.getItem(WORKOUT_SELECTED_SET_KEY);

    if (savedSelectedSet) {
      try {
        return JSON.parse(savedSelectedSet) as WorkoutSet;
      } catch {
        localStorage.removeItem(WORKOUT_SELECTED_SET_KEY);
      }
    }

    return workout?.exercises[0]?.sets[0] ?? null;
  }

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

  // function formatPreviousNote

  function addSet(exerciseId: string) {
    if (!setWorkout || pageType === "view" || !selectedExercise) return;

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
    if (!setWorkout || pageType === "view") return;

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
    const updatedExercise = selectedExercise
      ? {
          ...selectedExercise,
          sets: selectedExercise.sets
            .filter((set) => set.set_number !== setNumber)
            .map((set, index) => ({ ...set, set_number: index + 1 })),
        }
      : null;
    setSelectedExercise(updatedExercise);
    setSelectedSet(
      updatedExercise?.sets[updatedExercise?.sets.length - 1] ?? null,
    );
  }

  function updateSet(
    exerciseId: string,
    setNumber: number,
    field: keyof WorkoutSet,
    value: number | boolean,
  ) {
    if (!setWorkout || pageType === "view") return;

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
    setSelectedSet((prev) => (prev ? { ...prev, [field]: value } : null));
  }

  function chooseExercise(exercise: ExerciseDB) {
    if (!setWorkout || pageType === "view") return;

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
    if (exerciseId === "" || !setWorkout || pageType === "view") return;
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

  function updateExerciseNote(exerciseId: string, note: string) {
    if (!setWorkout || pageType === "view") return;

    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, notes: note } : exercise,
      ),
    }));
  }

  return (
    <div className={styles.workoutFormContainer}>
      <div
        className={`${styles.exerciseContainer} ${pageType !== "view" ? styles.addTopMargin : ""}`}
      >
        {workout.exercises.map((exercise) => (
          <div
            className={`${styles.exerciseCard} ${exercise.id === selectedExercise?.id ? styles.selected : ""}`}
            key={exercise.id}
            id={exercise.id}
          >
            <h2 className={styles.exerciseName}>{exercise.exercise_name}</h2>
            {previousData?.[exercise.exercise_id] && (
              <p className={styles.exercisePrev}>
                Last time:{" "}
                {formatPreviousSets(previousData[exercise.exercise_id])}
              </p>
            )}
            {previousData?.[exercise.exercise_id]?.notes && (
              <p className={styles.exercisePrev}>
                Previous note: {previousData[exercise.exercise_id].notes}
              </p>
            )}
            {showNotes[exercise.id] || exercise.notes ? (
              <input
                className={styles.exerciseNote}
                type="text"
                maxLength={60}
                placeholder="Exercise note..."
                readOnly={pageType === "view"}
                value={exercise.notes}
                onChange={(e) =>
                  updateExerciseNote(exercise.id, e.target.value)
                }
              />
            ) : (
              pageType !== "view" && (
                <button
                  className={styles.addNoteBtn}
                  onClick={() =>
                    setShowNotes((prev) => ({ ...prev, [exercise.id]: true }))
                  }
                >
                  <MessageSquarePlus size={15} />
                  Add note
                </button>
              )
            )}
            <div className={styles.exercises}>
              <table className={styles.sets}>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight ({preferredUnit})</th>
                    <th>Reps</th>
                    <th className={styles.actionsTitle}>Done</th>
                    <th>Rest</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {exercise.sets.map((set) => (
                    <tr
                      key={set.set_number}
                      className={`${styles.set} ${exercise.id === selectedExercise?.id && set.set_number === selectedSet?.set_number ? styles.selected : ""}`}
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setSelectedSet(set);
                        let restTime = 0;
                        let completedSetFound = false;

                        const exerciseIndex = exercise.order_index - 1;

                        for (
                          let i = exerciseIndex;
                          i >= 0 && !completedSetFound;
                          i--
                        ) {
                          const currentExercise = workout.exercises[i];

                          const startingSetIndex =
                            i === exerciseIndex
                              ? set.set_number - 2
                              : currentExercise.sets.length - 1;

                          for (let j = startingSetIndex; j >= 0; j--) {
                            const previousSet = currentExercise.sets[j];

                            if (previousSet.done) {
                              restTime = previousSet.rest_seconds;
                              completedSetFound = true;
                              break;
                            }
                          }
                        }
                        setRestStart(
                          restTime > 0
                            ? new Date(
                                Date.now() - restTime * 1000,
                              ).toISOString()
                            : new Date().toISOString(),
                        );
                      }}
                    >
                      <td>{set.set_number}</td>
                      <td>
                        <p>{set.weight}</p>
                      </td>
                      <td>
                        <p>{set.reps}</p>
                      </td>
                      <td>
                        <p>{set.done && "✅"}</p>
                      </td>
                      <td>{formatTime(set.rest_seconds, "rest")}</td>
                      <td>
                        <button
                          hidden={
                            pageType === "view" || exercise.sets.length < 2
                          }
                          className={styles.deleteSet}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSet(exercise.id, set.set_number);
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pageType !== "view" && (
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
        {pageType !== "view" && (
          <button
            className={cn(styles.addExercise, styles.button)}
            onClick={() => setShowModal(true)}
          >
            Add Exercise
          </button>
        )}
      </div>

      {workout.exercises.length > 0 &&
        selectedExercise &&
        selectedSet &&
        pageType !== "view" && (
          <div className={styles.buttonContainer}>
            <div className={styles.barHeader}>
              <p>{selectedExercise.exercise_name}</p>
              <p>Set {selectedSet.set_number}</p>
            </div>
            <p>Rest: {formatTime(selectedSet.rest_seconds, "rest")}</p>
            <div className={styles.barInputs}>
              <label>
                Weight ({preferredUnit})
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1000"
                  placeholder="0"
                  onFocus={() => {
                    document
                      .getElementById(selectedExercise.id)
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  onChange={(e) =>
                    updateSet(
                      selectedExercise.id,
                      selectedSet.set_number,
                      "weight",
                      Number(e.target.value),
                    )
                  }
                  value={selectedSet.weight === 0 ? "" : selectedSet.weight}
                />
              </label>
              <label>
                Reps
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="1000"
                  placeholder="0"
                  onFocus={() => {
                    document
                      .getElementById(selectedExercise.id)
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  onChange={(e) =>
                    updateSet(
                      selectedExercise.id,
                      selectedSet.set_number,
                      "reps",
                      Number(e.target.value),
                    )
                  }
                  value={selectedSet.reps === 0 ? "" : selectedSet.reps}
                />
              </label>
              {pageType === "active" &&
                (selectedSet.set_number === selectedExercise.sets.length ? (
                  <button
                    className={styles.completeSet}
                    hidden={selectedSet.done}
                    onClick={() => {
                      updateSet(
                        selectedExercise.id,
                        selectedSet.set_number,
                        "done",
                        true,
                      );
                      const nextExercise =
                        workout.exercises.find((exercise) =>
                          selectedExercise
                            ? selectedExercise?.order_index + 1 ===
                              exercise.order_index
                            : null,
                        ) ?? null;
                      if (nextExercise)
                        document
                          .getElementById(nextExercise.id)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      setSelectedExercise(nextExercise);
                      setSelectedSet(nextExercise?.sets[0] ?? null);
                      setRestStart(new Date().toISOString());
                    }}
                  >
                    Complete Exercise
                  </button>
                ) : (
                  <button
                    className={styles.completeSet}
                    hidden={selectedSet.done}
                    onClick={() => {
                      updateSet(
                        selectedExercise.id,
                        selectedSet.set_number,
                        "done",
                        true,
                      );
                      document
                        .getElementById(selectedExercise.id)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      const newSet = {
                        set_number: selectedSet.set_number + 1,
                        weight: selectedSet.weight,
                        reps: 0,
                        rest_seconds: 0,
                        done: false,
                      };
                      setSelectedSet(newSet ? newSet : null);
                      setRestStart(new Date().toISOString());
                    }}
                  >
                    Complete Set
                  </button>
                ))}
              {pageType === "change" && (
                <button className={styles.saveBtn} onClick={handleUpdate}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
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
          existingExercises={
            new Set(workout.exercises.map((exercise) => exercise.exercise_id))
          }
          onClose={() => setShowModal(false)}
          addExercise={addExercise}
          chooseExercise={chooseExercise}
        />
      )}
    </div>
  );
};

export default WorkoutForm;

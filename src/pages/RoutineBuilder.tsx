import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../styles/modules/RoutineBuilder.module.scss";

import type { Routine, RoutineDraft } from "../types/routine";
import type { ExerciseDB } from "../types/exercise";

import DeleteModal from "../components/DeleteModal";
import ChooseExerciseModal from "../components/ChooseExerciseModal";
import MessageModal from "../components/MessageModal";

import {
  getRoutineDetails,
  createRoutine,
  updateRoutine,
} from "../services/routines";
import { getExercises, createExercise } from "../services/exercises";

const RoutineBuilder = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();

  const draftKey = routineId ? `routineDraft:${routineId}` : "routineDraft:new";

  const [exercises, setExercises] = useState<ExerciseDB[]>([]);

  const textBack = `Are you sure you want to exit? \n All unsaved progress will be lost.`;
  const [routineDraft, setRoutineDraft] = useState<RoutineDraft>(() => {
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        return JSON.parse(savedDraft) as RoutineDraft;
      } catch {
        localStorage.removeItem(draftKey);
      }
    }

    return {
      name: "",
      exercises: [],
    };
  });

  const [chosenExerciseId, setChosenExerciseId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChooseExerciseModal, setShowChooseExerciseModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const title = "Confirm Action";
  const text = `Are you sure you want to delete this exercise from your Routine?`;

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const savedRoutine = localStorage.getItem(draftKey);
    if (savedRoutine) return;
    if (!routineId) return;
    async function getDetails() {
      try {
        const routine = await getRoutineDetails(String(routineId));
        if (!routine) return;
        setRoutineDraft({
          name: routine.name,
          exercises: [...routine.routine_exercises]
            .sort((a, b) => a.order_index - b.order_index)
            .map((item) => ({
              exercise_id: item.exercise_id,
              exercise_name: item.exercises.name,
              category: item.exercises.category,
              order_index: item.order_index,
            })),
        });
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    }

    getDetails();
  }, [routineId]);

  function chooseExercise(exercise: ExerciseDB) {
    setRoutineDraft((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          category: exercise.category,
          order_index: prev.exercises.length + 1,
        },
      ],
    }));
    setShowChooseExerciseModal(false);
  }

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify(routineDraft));
  }, [routineDraft]);

  async function addRoutine(routine: Routine) {
    await createRoutine(routine);
    await loadData();
  }

  async function handleUpdateRoutine(routine: Routine, routineId: string) {
    await updateRoutine(routine, routineId);
    await loadData();
  }

  async function addExercise(name: string, category: string) {
    await createExercise({ name, category });
    await loadData();
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.routineBuilderContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Routine Name: </h2>
        <input
          className={styles.input}
          type="text"
          value={routineDraft.name}
          onChange={(e) =>
            setRoutineDraft((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter name"
        />
      </div>
      <div className={styles.selectedExercisesList}>
        {routineDraft.exercises.map((exercise) => (
          <div
            key={exercise.exercise_id}
            className={styles.selectedExerciseElement}
          >
            <p>
              {exercise.exercise_name} - {exercise.category}
            </p>
            <button className={styles.editExerciseBtn}>Edit</button>
            <button
              className={styles.deleteExerciseBtn}
              onClick={() => {
                setShowDeleteModal(true);
                setChosenExerciseId(exercise.exercise_id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className={styles.addExerciseBtn}
        onClick={() => setShowChooseExerciseModal(true)}
      >
        + Add Exercise
      </button>
      <div className={styles.buttonContainer}>
        <button
          className={styles.saveRoutine}
          onClick={() => {
            const routineToSave = {
              name: routineDraft.name,
              exercises: routineDraft.exercises.map((exercise) => ({
                exercise_id: exercise.exercise_id,
                order_index: exercise.order_index,
              })),
            };
            if (routineId) {
              console.log(routineToSave);
              console.log(routineId);
              handleUpdateRoutine(routineToSave, routineId);
            } else {
              addRoutine(routineToSave);
            }
            localStorage.removeItem(draftKey);
            navigate("/routines");
          }}
        >
          Save Routine
        </button>
        <button
          className={styles.backBtn}
          onClick={() => setShowBackModal(true)}
        >
          Back
        </button>
      </div>
      {showDeleteModal && (
        <DeleteModal
          title={title}
          text={text}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            setRoutineDraft((prev) => ({
              ...prev,
              exercises: prev.exercises.filter(
                (exercise) => exercise.exercise_id != chosenExerciseId,
              ),
            }));
            setShowDeleteModal(false);
          }}
        />
      )}
      {showChooseExerciseModal && (
        <ChooseExerciseModal
          exercises={exercises}
          onClose={() => setShowChooseExerciseModal(false)}
          addExercise={addExercise}
          chooseExercise={chooseExercise}
        />
      )}
      {showBackModal && (
        <MessageModal
          title={title}
          text={textBack}
          onDelete={() => {
            setShowBackModal(false);
            localStorage.removeItem(draftKey);
            navigate("/routines");
          }}
          onClose={() => {
            setShowBackModal(false);
          }}
          twoButton={true}
          btnText="Exit"
        />
      )}
    </div>
  );
};

export default RoutineBuilder;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "../styles/modules/ActiveWorkout.module.scss";

import type { WorkoutDetails } from "../types/workout";

import ExecuteModal from "../components/ExecuteModal";

import { getWorkoutDetails, deleteWorkout } from "../services/workouts";

const MODAL_TEXT = `Are you sure you want to delete this workout? \n This action cannot be undone.`;

const ChangeWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<WorkoutDetails>();
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const workoutDetails = await getWorkoutDetails(String(id));
        setWorkout(workoutDetails);
      } catch (error) {
        console.error("Error loading data: ", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleDelete() {
    await deleteWorkout(String(id));
    setShowModal(false);
    navigate("/");
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.workoutContainer}>
      <h3 className={styles.title}>Push Day</h3>
      <p className={styles.stopwatch}>{workout?.duration_seconds}</p>

      <div className={styles.exerciseContainer}>
        {workout?.workout_exercises.map((exercise) => (
          <div className={styles.exerciseCard} key={exercise.id}>
            <h2 className={styles.exerciseName}>{exercise.exercise_name}</h2>
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
                  {exercise.workout_sets.map((set) => (
                    <tr key={set.set_number}>
                      <td>{set.set_number}</td>
                      <td>{set.weight}</td>
                      <td>{set.reps}</td>
                      <td>
                        <input type="checkbox" disabled checked={set.done} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
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
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
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

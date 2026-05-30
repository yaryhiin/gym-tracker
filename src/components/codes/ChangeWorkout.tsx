import styles from "../styles/ActiveWorkout.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getWorkoutDetails } from "../../utils";

import type { WorkoutDetails } from "../../types";
import MessageModal from "./MessageModal";

type ChangeWorkoutProps = {
  deleteWorkout: (id: string) => void;
};

const ChangeWorkout = ({ deleteWorkout }: ChangeWorkoutProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  function home() {
    navigate("/");
  }

  const [workout, setWorkout] = useState<WorkoutDetails>();
  const [showModal, setShowModal] = useState(false);

  const title = "Confirm Action";
  const text = `Are you sure you want to delete this workout? \n This action cannot be undone.`;

  useEffect(() => {
    async function getDetails() {
      try {
        const workoutDetails = await getWorkoutDetails(String(id));
        setWorkout(workoutDetails);
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    }

    getDetails();
  }, []);

  async function handleDelete() {
    setShowModal(false);
    await deleteWorkout(String(id));
    home();
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
          <MessageModal
            title={title}
            text={text}
            onDelete={handleDelete}
            onClose={() => {
              setShowModal(false);
            }}
            twoButton={true}
            btnText="Delete"
          />
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={() => home()}>
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

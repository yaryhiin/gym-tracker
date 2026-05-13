import { useEffect, useState } from 'react';
import Modal from './Modal'
import styles from '../styles/ActiveWorkout.module.scss'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom';

type WorkoutSet = {
  number: number,
  weight: number,
  reps: number,
  done: boolean
}

type Exercise = {
  id: string,
  name: string,
  sets: WorkoutSet[]
}

type Workout = {
  id: string,
  name: string,
  exercises: Exercise[]
}

const ActiveWorkout = () => {
  const [seconds, setSeconds]= useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  function home () {
    navigate('/');
  }

  const [workout, setWorkout] = useState<Workout>(() => ({
    id: Date.now().toString(),
    name: 'Push Day',
    exercises: 
    [
      {
        id: `${Date.now().toString()}-bench`,
        name: 'Bench Press',
        sets: [
          {
            number: 1,
            weight: 0,
            reps: 0,
            done: false
          },
        ]
      }
    ]
  }))

  useEffect(() => {
    if(!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev+1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning])

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
            number: exercise.sets.length + 1,
            weight: 0,
            reps: 0,
            done: false
          }
        ]
      }
      : exercise
      )
    }))
  }

  function updateSet(
    exerciseId: string,
    setNumber: number,
    field: keyof WorkoutSet,
    value: number | boolean
  ) {
    setWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.map((exercise) => 
          exercise.id === exerciseId
        ? {
          ...exercise,
          sets: exercise.sets.map((set) =>
          set.number === setNumber
          ? { ...set, [field]: value}
          : set
        )
        }
        : exercise
      ),
    }))
  }

  function addExercise(
    exerciseName: string
  ) {
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: `${Date.now().toString()}-${exerciseName}`,
          name: exerciseName,
          sets: [
            {
              number: 1,
              weight: 0,
              reps: 0,
              done: false
            }
          ]
        }
      ]
  }))
  }

  return (
  <div className={styles.workoutContainer}>
    <h3 className={styles.title}>Push Day</h3>
    <p className={styles.stopwatch}>{formatTime(seconds)}</p>

    <div className={styles.exerciseContainer}>
      {workout.exercises.map((exercise) => (
        <div className={styles.exerciseCard} key={exercise.id}>
          <h2 className={styles.exerciseName}>{exercise.name}</h2>
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
                  <tr key={set.number}>
                    <td>{set.number}</td>
                    <td>
                      <input
                        type="number"
                        onChange={(e) =>
                          updateSet(
                            exercise.id,
                            set.number,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        value={set.weight}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        onChange={(e) =>
                          updateSet(
                            exercise.id,
                            set.number,
                            "reps",
                            Number(e.target.value)
                          )
                        }
                        value={set.reps}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          updateSet(
                            exercise.id,
                            set.number,
                            "done",
                            e.target.checked
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
      >
        Add Exercise
      </button>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onAddExercise={addExercise}
        />
      )}
    </div>

<div className={styles.buttonContainer}>
  <button className={styles.backBtn} onClick={() => home()}>Back</button>
    <button
      className={cn(styles.button, styles.finishBtn)}
      onClick={() => {
        setIsRunning(false);
        console.log(workout, seconds);
        home()
      }}
    >
      Finish Workout
    </button>
    </ div>
  </div>
);
}

export default ActiveWorkout
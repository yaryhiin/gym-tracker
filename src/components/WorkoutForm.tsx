// import styles from "../styles/WorkoutForm.module.scss";
// import { formatTime } from "../../utils";
// import type { Workout, WorkoutSet, ExerciseDB } from "../../types";
// import { useState } from "react";

// type WorkoutFormProps = {
//   workout: Workout;
//   setShowBackModal: (show: boolean) => void;
//   addSet: (exerciseId: string) => void;
//   isRunning: boolean;
//   setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
// };

// const WorkoutForm = ({ workout, setShowBackModal, isRunning, setWorkout }: WorkoutFormProps) => {
//     function addSet(exerciseId: string) {
//         setWorkout((prev) => ({
//           ...prev,
//           exercises: prev.exercises.map((exercise) =>
//             exercise.id === exerciseId
//               ? {
//                   ...exercise,
//                   sets: [
//                     ...exercise.sets,
//                     {
//                       set_number: exercise.sets.length + 1,
//                       weight: 0,
//                       reps: 0,
//                       rest_seconds: 0,
//                       done: false,
//                     },
//                   ],
//                 }
//               : exercise,
//           ),
//         }));
//       }

//       function updateSet(
//         exerciseId: string,
//         setNumber: number,
//         field: keyof WorkoutSet,
//         value: number | boolean,
//       ) {
//         setWorkout((prev) => ({
//           ...prev,
//           exercises: prev.exercises.map((exercise) =>
//             exercise.id === exerciseId
//               ? {
//                   ...exercise,
//                   sets: exercise.sets.map((set) =>
//                     set.set_number === setNumber ? { ...set, [field]: value } : set,
//                   ),
//                 }
//               : exercise,
//           ),
//         }));
//       }

//       function chooseExercise(exercise: ExerciseDB) {
//         setWorkout((prev) => ({
//           ...prev,
//           exercises: [
//             ...prev.exercises,
//             {
//               id: exercise.id,
//               exercise_name: exercise.name,
//               exercise_id: exercise.id,
//               category: exercise.category,
//               order_index: prev.exercises.length + 1,
//               notes: "",
//               sets: [
//                 {
//                   set_number: 1,
//                   weight: 0,
//                   reps: 0,
//                   rest_seconds: 0,
//                   done: false,
//                 },
//               ],
//             },
//           ],
//         }));
//         setShowModal(false);
//       }
//   return (
//     <div className={styles.workoutFormContainer}>
//       <div className={styles.header}>
//         <h3 className={styles.title}>{workout.name}</h3>
//         <p className={styles.stopwatch}>
//           {formatTime(workout.duration_seconds)}
//         </p>
//         <button
//           className={styles.backBtn}
//           onClick={() => setShowBackModal(true)}
//         >
//           Back
//         </button>
//       </div>
//       <div className={styles.exerciseContainer}>
//         {workout.exercises.map((exercise) => (
//           <div className={styles.exerciseCard} key={exercise.id}>
//             <h2 className={styles.exerciseName}>{exercise.exercise_name}</h2>
//             <p className={styles.exercisePrev}>Last time: 60kg x 8</p>
//             <p className={styles.exerciseSuggest}>Suggested: 52.5kg x 6-8</p>

//             <div className={styles.sets}>
//               <table className={styles.set}>
//                 <thead>
//                   <tr>
//                     <th>Set</th>
//                     <th>Weight</th>
//                     <th>Reps</th>
//                     <th>Done</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {exercise.sets.map((set) => (
//                     <tr key={set.set_number}>
//                       <td>{set.set_number}</td>
//                       <td>
//                         <input
//                           disabled={!isRunning}
//                           type="number"
//                           placeholder="Enter weight"
//                           onChange={(e) =>
//                             updateSet(
//                               exercise.id,
//                               set.set_number,
//                               "weight",
//                               Number(e.target.value),
//                             )
//                           }
//                           value={set.weight === 0 ? "" : set.weight}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           disabled={!isRunning}
//                           type="number"
//                           placeholder="Enter reps"
//                           onChange={(e) =>
//                             updateSet(
//                               exercise.id,
//                               set.set_number,
//                               "reps",
//                               Number(e.target.value),
//                             )
//                           }
//                           value={set.reps === 0 ? "" : set.reps}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           disabled={!isRunning}
//                           type="checkbox"
//                           onChange={(e) =>
//                             updateSet(
//                               exercise.id,
//                               set.set_number,
//                               "done",
//                               e.target.checked,
//                             )
//                           }
//                           checked={set.done}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <button
//                 disabled={!isRunning}
//                 className={styles.addSet}
//                 onClick={() => addSet(exercise.id)}
//               >
//                 Add Set
//               </button>
//             </div>
//           </div>
//         ))}

//         <button
//           className={styles.addExercise}
//           onClick={() => setShowModal(true)}
//           disabled={!isRunning}
//         >
//           Add Exercise
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WorkoutForm;

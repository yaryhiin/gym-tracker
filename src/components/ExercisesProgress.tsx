// import { useState, useEffect } from "react";

// import styles from "../styles/modules/ProgressComponents.module.scss";

// import Chart from "./Chart";
// import { getExercises } from "../services/exercises";

// import type { ChartBriefInfo, ChartData } from "../types/chart";
// import type { ExerciseDB } from "../types/exercise";

// type ExercisesProgressProps = {
//   unit: "lb" | "kg";
// };

// const ExercisesProgress = ({ unit }: ExercisesProgressProps) => {
//   const [exercisesData, setExercisesData] = useState([]);
//   const [exercises, setExercises] = useState<ExerciseDB[]>();

//   const [chosenExercise, setChosenExercise] = useState<ExerciseDB>();
//   const [filteredData, setFilteredData] = useState<ChartData[]>([]);
//   const [briefData, setBriefData] = useState<ChartBriefInfo>();
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     async function getData() {
//       setLoading(true);
//       try {
//         const exercisesList = await getExercises();
//         const logs = await getMeasurementsHistory();
//         if (!exercisesList || !logs) {
//           return;
//         }
//         setExercises(exercisesList);
//         setExercisesData(logs);
//         setChosenExercise(exercisesList[0]);
//       } catch (error) {
//         console.error("Error fetching exercises data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     getData();
//   }, []);

//   useEffect(() => {
//     if (loading) return;
//     const chosenData = measurementsData.filter(
//       (data) => data.measurement_type_id === chosenType?.id,
//     );
//     setFilteredData(
//       chosenData.map((data) => ({
//         date: data.measured_at,
//         value:
//           unit === "lb"
//             ? Math.round((data.value_cm / 2.54) * 10) / 10
//             : data.value_cm,
//       })),
//     );
//     const current =
//       unit === "lb"
//         ? Math.round((chosenData[0].value_cm / 2.54) * 10) / 10
//         : chosenData[0].value_cm;
//     const entries = chosenData.length;
//     const change =
//       unit === "lb"
//         ? Math.round(
//             (current -
//               Math.round((chosenData[entries - 1].value_cm / 2.54) * 10) / 10) *
//               10,
//           ) / 10
//         : current - chosenData[entries - 1].value_cm;
//     setBriefData({ current, change, entries });
//   }, [chosenExercise]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }
//   return (
//     <div className={styles.mainContainer}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Measurements</h1>
//         <p>Choose measurement</p>
//         {exercises && exercises.length > 0 ? (
//           <select
//             value={chosenExercise?.id}
//             onChange={(e) => {
//               const selectedType = exercises.find(
//                 (type) => type.id === e.target.value,
//               );

//               setChosenExercise(selectedType);
//             }}
//           >
//             {exercises?.map((exercise) => (
//               <option key={exercise.id} value={exercise.id}>
//                 {exercise.name}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <p>You dont have any data saved</p>
//         )}
//       </div>
//       <Chart chartData={filteredData} yPadding={2} />
//       <div className={styles.briefInfo}>
//         <p>
//           Last weight: <b>{briefData?.current}</b>
//           {unit}
//         </p>
//         <p>
//           Change: <b>{briefData?.change}</b>
//           {unit}
//         </p>
//         <p>Total sets: {briefData?.entries}</p>
//       </div>
//     </div>
//   );
// };

// export default ExercisesProgress;

import { useState, useEffect } from "react";

import styles from "../styles/modules/ProgressComponents.module.scss";

import Chart from "./Chart";
import { getExercises, getExercisesLogs } from "../services/exercises";

import type { ChartBriefInfo, ChartData } from "../types/chart";
import type { ExerciseDB, ExerciseLogsDB } from "../types/exercise";

type ExercisesProgressProps = {
  unit: "lb" | "kg";
};

const ExercisesProgress = ({ unit }: ExercisesProgressProps) => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogsDB[]>();
  const [exercises, setExercises] = useState<ExerciseDB[]>();

  const [chosenExercise, setChosenExercise] = useState<ExerciseDB>();
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);
  const [briefData, setBriefData] = useState<ChartBriefInfo>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const list = await getExercises();
        const logs = await getExercisesLogs();
        if (!list || !logs) {
          return;
        }
        setExercises(list);
        setExerciseLogs(logs);
        setChosenExercise(list[0] ?? null);
      } catch (error) {
        console.error("Error fetching exercises data:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!chosenExercise) return;
    if (!exerciseLogs) return;

    const formattedData = exerciseLogs
      .flatMap((workout) =>
        workout.workout_exercises.map((exercise) => ({
          date: workout.finished_at ?? workout.created_at,
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.exercise_name,
          sets: exercise.workout_sets,
        })),
      )
      .filter((entry) => entry.exercise_id === chosenExercise.id)
      .map((entry) => {
        const completedSets = entry.sets.filter((set) => set.done);

        if (completedSets.length === 0) return null;

        const bestSet = completedSets.reduce((best, current) => {
          const bestVolume = best.weight * best.reps;
          const currentVolume = current.weight * current.reps;

          return currentVolume > bestVolume ? current : best;
        });

        const displayedWeight =
          unit === "lb"
            ? Math.round(bestSet.weight * 2.20462262 * 10) / 10
            : bestSet.weight;

        return {
          date: entry.date.split("T")[0],
          value: displayedWeight * bestSet.reps,
          label: `${displayedWeight} * ${bestSet.reps}`,
        };
      })
      .filter((entry) => entry !== null);
    if (formattedData.length === 0) {
      setFilteredData([]);
      setBriefData({
        current: 0,
        change: 0,
        entries: 0,
      });

      return;
    }

    const entries = formattedData.length;

    const firstEntry = formattedData[0];
    const currentEntry = formattedData[formattedData.length - 1];

    const current = currentEntry.value ?? 0;

    const change =
      currentEntry && firstEntry ? currentEntry.value - firstEntry.value : 0;

    setBriefData({ current, change, entries });
    setFilteredData(formattedData);
  }, [chosenExercise, exerciseLogs]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Measurements</h1>
        <p>Choose measurement</p>
        {exercises && exercises.length > 0 ? (
          <select
            value={chosenExercise?.id}
            onChange={(e) => {
              const selectedType = exercises.find(
                (type) => type.id === e.target.value,
              );

              setChosenExercise(selectedType);
            }}
          >
            {exercises?.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        ) : (
          <p>You dont have any data saved</p>
        )}
      </div>
      <Chart chartData={filteredData} yPadding={2} />
      <div className={styles.briefInfo}>
        <p>
          Last weight: <b>{briefData?.current}</b>
          {unit}
        </p>
        <p>
          Change: <b>{briefData?.change}</b>
          {unit}
        </p>
        <p>Total sets: {briefData?.entries}</p>
      </div>
    </div>
  );
};

export default ExercisesProgress;

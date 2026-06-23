import { useState } from "react";

import styles from "../styles/modules/Progress.module.scss";

import WeightProgress from "../components/WeightProgress";
import MeasurementsProgress from "../components/MeasurementsProgress";
import ExercisesProgress from "../components/ExercisesProgress";

type ProgressProps = {
  unit: "kg" | "lb";
};

const Progress = ({ unit }: ProgressProps) => {
  const [progressType, setProgressType] = useState<
    "weight" | "measurements" | "exercises"
  >("weight");

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress</h1>
        <p className={styles.description}>
          Choose the Data that you want to check
        </p>
        <div className={styles.toggle}>
          <button
            type="button"
            className={progressType === "weight" ? styles.active : ""}
            onClick={() => setProgressType("weight")}
          >
            Weight
          </button>
          <button
            type="button"
            className={progressType === "measurements" ? styles.active : ""}
            onClick={() => setProgressType("measurements")}
          >
            Measurements
          </button>
          <button
            type="button"
            className={progressType === "exercises" ? styles.active : ""}
            onClick={() => setProgressType("exercises")}
          >
            Exercises
          </button>
        </div>
      </div>
      {progressType === "weight" && <WeightProgress unit={unit} />}
      {progressType === "measurements" && (
        <MeasurementsProgress unit={unit === "lb" ? "in" : "cm"} />
      )}
      {progressType === "exercises" && <ExercisesProgress unit={unit} />}
    </div>
  );
};

export default Progress;

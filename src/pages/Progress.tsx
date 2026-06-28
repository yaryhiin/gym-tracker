import { useState } from "react";

import styles from "../styles/modules/Progress.module.scss";

import WeightProgress from "../components/WeightProgress";
import MeasurementsProgress from "../components/MeasurementsProgress";
import ExercisesProgress from "../components/ExercisesProgress";

import type {
  PreferredMeasurementUnit,
  PreferredWeightUnit,
} from "../types/profile";

type ProgressProps = {
  weight: PreferredWeightUnit;
  workout: PreferredWeightUnit;
  measurement: PreferredMeasurementUnit;
};

const Progress = ({ weight, workout, measurement }: ProgressProps) => {
  const [progressType, setProgressType] = useState<
    "weight" | "measurements" | "exercises"
  >("weight");

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress</h1>
        <p className={styles.description}>Choose what you want to track</p>
        <div className="toggle">
          <button
            type="button"
            className={progressType === "weight" ? "active" : ""}
            onClick={() => setProgressType("weight")}
          >
            Weight
          </button>
          <button
            type="button"
            className={progressType === "measurements" ? "active" : ""}
            onClick={() => setProgressType("measurements")}
          >
            Measurements
          </button>
          <button
            type="button"
            className={progressType === "exercises" ? "active" : ""}
            onClick={() => setProgressType("exercises")}
          >
            Exercises
          </button>
        </div>
      </div>
      {progressType === "weight" && <WeightProgress unit={weight} />}
      {progressType === "measurements" && (
        <MeasurementsProgress unit={measurement} />
      )}
      {progressType === "exercises" && <ExercisesProgress unit={workout} />}
    </div>
  );
};

export default Progress;

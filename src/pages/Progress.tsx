import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "../styles/modules/Progress.module.scss";

import type { ProfileDB } from "../types/profile";

import WeightProgress from "../components/WeightProgress";
import MeasurementsProgress from "../components/MeasurementsProgress";
import ExercisesProgress from "../components/ExercisesProgress";

type ProgressProps = {
  profile: ProfileDB;
};

const Progress = ({ profile }: ProgressProps) => {
  const { t } = useTranslation();

  const [progressType, setProgressType] = useState<
    "weight" | "measurements" | "exercises"
  >("weight");

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("progress.title")}</h1>
        <p className={styles.description}>{t("progress.description")}</p>
        <div className="toggle">
          <button
            type="button"
            className={progressType === "weight" ? "active" : ""}
            onClick={() => setProgressType("weight")}
          >
            {t("progress.weight")}
          </button>
          <button
            type="button"
            className={progressType === "measurements" ? "active" : ""}
            onClick={() => setProgressType("measurements")}
          >
            {t("progress.measurements")}
          </button>
          <button
            type="button"
            className={progressType === "exercises" ? "active" : ""}
            onClick={() => setProgressType("exercises")}
          >
            {t("progress.exercises")}
          </button>
        </div>
      </div>
      {progressType === "weight" && (
        <WeightProgress
          unit={profile.preferred_weight_unit}
          firstDayOfTheWeek={profile.first_day_of_week}
        />
      )}
      {progressType === "measurements" && (
        <MeasurementsProgress
          unit={profile.preferred_measurement_unit}
          firstDayOfTheWeek={profile.first_day_of_week}
        />
      )}
      {progressType === "exercises" && (
        <ExercisesProgress
          unit={profile.preferred_workout_unit}
          firstDayOfTheWeek={profile.first_day_of_week}
        />
      )}
    </div>
  );
};

export default Progress;

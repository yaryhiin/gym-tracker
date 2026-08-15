import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import styles from "../styles/modules/Home.module.scss";

import type { RoutineDB } from "../types/routine";
import type { WorkoutDB } from "../types/workout";

import { getWorkoutsHistory } from "../services/workouts";
import { getRoutines } from "../services/routines";

import { formatDate, formatDuration } from "../services/utils";

import ChooseRoutineModal from "../components/ChooseRoutineModal";

type HomeProps = {
  name: string;
};

const Home = ({ name }: HomeProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [routines, setRoutines] = useState<RoutineDB[]>([]);
  const [loading, setLoading] = useState(true);

  const [showChooseRoutineModal, setShowChooseRoutineModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const workoutsData = await getWorkoutsHistory();
        setWorkouts(workoutsData);
        const routinesData = await getRoutines();
        setRoutines(routinesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <LoaderCircle size={20} className="loading__spinner" />
        {t("common.loading")}
      </div>
    );
  }
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>
        {new Date().getHours() < 4
          ? t("home.greeting.night")
          : new Date().getHours() < 12
            ? t("home.greeting.morning")
            : new Date().getHours() < 18
              ? t("home.greeting.afternoon")
              : t("home.greeting.evening")}
        , {name}
      </h1>
      <button
        className={styles.startBtn}
        onClick={() => setShowChooseRoutineModal(true)}
      >
        {t("home.start")}
      </button>
      {showChooseRoutineModal && (
        <ChooseRoutineModal
          routines={routines}
          onClose={() => setShowChooseRoutineModal(false)}
        />
      )}
      <div className={styles.history}>
        <h2 className={styles.title}>{t("home.recent")}</h2>

        {workouts.length > 0 ? (
          workouts
            .toSorted(
              (a, b) =>
                new Date(b.finished_at).getTime() -
                new Date(a.finished_at).getTime(),
            )
            .slice(0, 3)
            .map((workout) => (
              <div
                className={styles.historyElement}
                onClick={() => navigate(`/history/${workout.id}`)}
                key={workout.id}
              >
                <p className={styles.descName}>
                  {workout.name} - {formatDate(workout.started_at)}
                </p>
                <div className={styles.descWorkout}>
                  <p>
                    {t("history.duration")}{": "}
                    {formatDuration(workout.duration_seconds)}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <div className={styles.emptyText}>
            <h3>{t("home.emptyState.title")}</h3>
            <p>{t("home.emptyState.description")}</p>
          </div>
        )}

        {workouts.length > 3 && (
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/history")}
          >
            {t("home.viewAll")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

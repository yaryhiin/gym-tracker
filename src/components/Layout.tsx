import { Outlet, useLocation, matchPath, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import NavButtons from "./NavButtons";
import ExecuteModal from "./ExecuteModal";

const ACTIVE_WORKOUT_ROUTINE_KEY = "activeWorkoutRoutine";
const ACTIVE_WORKOUT_KEY = "activeWorkout";
const ACTIVE_WORKOUT_SECONDS_KEY = "activeWorkoutSeconds";
const ACTIVE_WORKOUT_EXERCISES_KEY = "activeWorkoutExercises";
const ACTIVE_WORKOUT_PREFERRED_UNIT_KEY = "activeWorkoutPreferredUnit";
const ACTIVE_WORKOUT_PREVIOUS_DATA_KEY = "activeWorkoutPreviousData";
const WORKOUT_SELECTED_EXERCISE_KEY = "workoutSelectedExercise";
const WORKOUT_SELECTED_SET_KEY = "workoutSelectedSet";
const WORKOUT_REST_START_KEY = "workoutRestStart";

type LayoutProps = {
  toggleTheme: () => void;
  theme: string;
  session: boolean;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
};

export default function Layout({
  toggleTheme,
  theme,
  session,
  language,
  setLanguage,
}: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const activeWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (
      !activeWorkout ||
      matchPath("/workout/*", location.pathname) ||
      !session
    )
      return;

    setShowModal(true);
  }, [location.pathname]);

  const isActiveWorkout =
    matchPath("/workout", location.pathname) ||
    matchPath("/workout/*", location.pathname) ||
    matchPath("history/:id/edit", location.pathname);

  return (
    <div className={"appShell"}>
      {!isActiveWorkout && (
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          session={session}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      <main className="container">
        <Outlet />
        {showModal && (
          <ExecuteModal
            text={t("modal.continueWorkout")}
            btnText={t("common.delete")}
            onClose={() => {
              const routineId = localStorage.getItem(
                ACTIVE_WORKOUT_ROUTINE_KEY,
              );
              if (routineId) navigate(`workout/routine/${routineId}`);
              else navigate("workout");
              setShowModal(false);
            }}
            onDelete={() => {
              setShowModal(false);
              localStorage.removeItem(ACTIVE_WORKOUT_KEY);
              localStorage.removeItem(ACTIVE_WORKOUT_SECONDS_KEY);
              localStorage.removeItem(ACTIVE_WORKOUT_EXERCISES_KEY);
              localStorage.removeItem(ACTIVE_WORKOUT_PREVIOUS_DATA_KEY);
              localStorage.removeItem(ACTIVE_WORKOUT_PREFERRED_UNIT_KEY);
              localStorage.removeItem(WORKOUT_SELECTED_EXERCISE_KEY);
              localStorage.removeItem(WORKOUT_SELECTED_SET_KEY);
              localStorage.removeItem(WORKOUT_REST_START_KEY);
              localStorage.removeItem(ACTIVE_WORKOUT_ROUTINE_KEY);
            }}
          />
        )}
      </main>
      {!isActiveWorkout && session && <NavButtons />}
    </div>
  );
}

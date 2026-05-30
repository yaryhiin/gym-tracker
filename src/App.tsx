import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import type { Session } from "@supabase/supabase-js";
import type {
  WorkoutDB,
  Workout,
  ExerciseDB,
  RoutineDB,
  Routine,
} from "./types";

import {
  getWorkoutsHistory,
  createWorkout,
  deleteWorkout,
  getExercises,
  createExercise,
  deleteExercise,
  getRoutines,
  createRoutine,
  deleteRoutine,
} from "./utils";

import Home from "./components/codes/Home";
import ActiveWorkout from "./components/codes/ActiveWorkout";
import History from "./components/codes/History";
import Progress from "./components/codes/Progress";
import SignUp from "./components/codes/SignUp";
import Login from "./components/codes/Login";
import WelcomeScreen from "./components/codes/WelcomeScreen";
import ChangeWorkout from "./components/codes/ChangeWorkout";
import Layout from "./Layout";
import Exercises from "./components/codes/Exercises";
import Routines from "./components/codes/Routines";
import RoutineBuilder from "./components/codes/RoutineBuilder";

function App() {
  const userName = "Tim";

  const [session, setSession] = useState<Session | null>();
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);
  const [exercises, setExercises] = useState<ExerciseDB[]>([]);
  const [routines, setRoutines] = useState<RoutineDB[]>([]);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    async function loadSession() {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error fetching session:", error);
      }
      setSession(data.session);
      if (data.session !== null) {
        setUserId(data.session.user.id);
      }
      setAuthLoading(false);
      console.log("Session loaded:", data.session);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session !== null) {
        setUserId(session.user.id);
      }
      setAuthLoading(false);
      console.log("Auth state changed:", session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadData() {
    setDataLoading(true);
    try {
      const workoutsData = await getWorkoutsHistory();
      setWorkouts(workoutsData);
      const exercisesData = await getExercises();
      setExercises(exercisesData);
      const routinesData = await getRoutines();
      setRoutines(routinesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (!session) {
      setDataLoading(false);
      return;
    }
    loadData();
  }, [session]);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  async function addWorkout(workout: Workout) {
    await createWorkout(workout, userId);
    await loadData();
  }

  async function addExercise(name: string, category: string) {
    await createExercise({ name, category }, userId);
    await loadData();
  }

  async function addRoutine(routine: Routine) {
    await createRoutine(routine, userId);
    await loadData();
  }

  async function handleDeleteWorkout(id: string) {
    await deleteWorkout(id, userId);
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  }

  async function handleDeleteExercise(id: string) {
    await deleteExercise(id, userId);
    setExercises((prev) => prev.filter((exercise) => exercise.id != id));
  }

  async function handleDeleteRoutine(id: string) {
    await deleteRoutine(id, userId);
    setRoutines((prev) => prev.filter((routine) => routine.id != id));
  }

  if (authLoading) return <div>Loading...</div>;
  if (session && dataLoading) return <div>Loading...</div>;
  return (
    <Router>
      <Routes>
        {!session ? (
          <Route
            element={
              <Layout toggleTheme={toggleTheme} theme={theme} session={false} />
            }
          >
            <Route path="/" element={<WelcomeScreen />} />

            <Route path="/signup" element={<SignUp />} />

            <Route path="/login" element={<Login />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route
            element={
              <Layout toggleTheme={toggleTheme} theme={theme} session={true} />
            }
          >
            <Route
              path="/"
              element={
                <Home
                  workouts={workouts}
                  userName={userName}
                  routines={routines}
                />
              }
            />
            <Route
              path="/workout"
              element={<ActiveWorkout addWorkout={addWorkout} />}
            />
            <Route
              path="/workout/routine/:routineId"
              element={<ActiveWorkout addWorkout={addWorkout} />}
            />
            <Route path="/history" element={<History workouts={workouts} />} />
            <Route path="/progress" element={<Progress />} />
            <Route
              path="changeWorkout/:id"
              element={<ChangeWorkout deleteWorkout={handleDeleteWorkout} />}
            />
            <Route
              path="/exercises"
              element={
                <Exercises
                  exercises={exercises}
                  addExercise={addExercise}
                  deleteExercise={handleDeleteExercise}
                />
              }
            />
            <Route
              path="/routines"
              element={
                <Routines
                  routines={routines}
                  deleteRoutine={handleDeleteRoutine}
                />
              }
            />
            <Route
              path="/routines/new"
              element={
                <RoutineBuilder
                  exercises={exercises}
                  createRoutine={addRoutine}
                  addExercise={addExercise}
                  routines={routines}
                />
              }
            />
            <Route
              path="/routines/:id/edit"
              element={
                <RoutineBuilder
                  exercises={exercises}
                  createRoutine={addRoutine}
                  addExercise={addExercise}
                  routines={routines}
                />
              }
            />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;

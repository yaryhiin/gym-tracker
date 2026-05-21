import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import type { Session } from "@supabase/supabase-js";
import type { WorkoutDB, Workout } from "./types";

import { getWorkoutsHistory, createWorkout, deleteWorkout } from "./utils";

import Home from "./components/codes/Home";
import ActiveWorkout from "./components/codes/ActiveWorkout";
import History from "./components/codes/History";
import Progress from "./components/codes/Progress";
import SignUp from "./components/codes/SignUp";
import Login from "./components/codes/Login";
import WelcomeScreen from "./components/codes/WelcomeScreen";
import ChangeWorkout from "./components/codes/ChangeWorkout";
import Layout from "./Layout";

function App() {
  const userName = "Tim";

  const [session, setSession] = useState<Session | null>();
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const [workouts, setWorkouts] = useState<WorkoutDB[]>([]);

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

  async function handleDeleteWorkout(id: string) {
    await deleteWorkout(id, userId);
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  }

  if (authLoading) return <div>Loading...</div>;
  if (session && dataLoading) return <div>Loading...</div>;
  return (
    <Router>
      <div className="App">
        <Routes>
          {!session ? (
            <>
              <Route path="/" element={<WelcomeScreen />} />

              <Route path="/signup" element={<SignUp />} />

              <Route path="/login" element={<Login />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route element={<Layout toggleTheme={toggleTheme} theme={theme} />}>
              <Route path="/" element={<Home userName={userName} />} />
              <Route
                path="/workout"
                element={<ActiveWorkout addWorkout={addWorkout} />}
              />
              <Route
                path="/history"
                element={<History workouts={workouts} />}
              />
              <Route path="/progress" element={<Progress />} />
              <Route
                path="changeWorkout/:id"
                element={<ChangeWorkout deleteWorkout={handleDeleteWorkout} />}
              />
            </Route>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

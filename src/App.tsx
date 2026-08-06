import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import Home from "./pages/Home";
import ActiveWorkout from "./pages/ActiveWorkout";
import History from "./pages/History";
import Progress from "./pages/Progress";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import WelcomeScreen from "./pages/WelcomeScreen";
import ChangeWorkout from "./pages/ChangeWorkout";
import ViewWorkout from "./pages/ViewWorkout";
import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import Routines from "./pages/Routines";
import RoutineBuilder from "./pages/RoutineBuilder";
import ProfilePage from "./pages/ProfilePage";

import ProfileSetupModal from "./components/ProfileSetupModal";
import WeightCheckinModal from "./components/WeightCheckinModal";
import MeasurementsCheckinModal from "./components/MeasurementsCheckinModal";

import type {
  PreferredWeightUnit,
  PreferredMeasurementUnit,
  Profile,
  ProfileDB,
} from "./types/profile";

import { getProfile, createProfile, updateProfile } from "./services/profiles";
import { getLatestWeightLog } from "./services/weightLogs";
import { getDaysSince, getTodayDateString } from "./services/utils";
import { getLatestMeasurementLog } from "./services/measurements";
import { createDefaultExercises } from "./services/exercises";

const WEIGHT_CHECKIN_SKIPPED_DATE_KEY = "weightCheckinSkippedDate";
const MEASUREMENTS_CHECKIN_SKIPPED_DATE_KEY = "measurementsCheckinSkippedDate";

function getInitialProfile(): ProfileDB | null {
  const savedProfile = localStorage.getItem("profile");

  if (!savedProfile) return null;

  try {
    return JSON.parse(savedProfile) as ProfileDB;
  } catch {
    localStorage.removeItem("profile");
    return null;
  }
}

function App() {
  const [session, setSession] = useState<Session | null>();
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileDB | null>(getInitialProfile);

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showWeightCheckinModal, setShowWeightCheckinModal] = useState(false);
  const [showMeasurementsCheckinModal, setShowMeasurementsCheckinModal] =
    useState(false);

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
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error fetching session:", error);
      }
      setSession(data.session);
      setAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      setProfile(null);
      localStorage.removeItem("profile");
      localStorage.removeItem(WEIGHT_CHECKIN_SKIPPED_DATE_KEY);
      localStorage.removeItem(MEASUREMENTS_CHECKIN_SKIPPED_DATE_KEY);
      setProfileLoading(false);
      return;
    }

    async function setupProfile() {
      if (!profile) {
        setProfileLoading(true);
      }

      try {
        const profileData = await getProfile();

        if (profileData) {
          setProfile(profileData);
          localStorage.setItem("profile", JSON.stringify(profileData));
        } else {
          setShowProfileSetup(true);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    setupProfile();
  }, [session?.user.id, session]);

  useEffect(() => {
    async function checkWeightReminder() {
      const skippedDay = localStorage.getItem(WEIGHT_CHECKIN_SKIPPED_DATE_KEY);
      if (skippedDay === getTodayDateString()) {
        return;
      }
      if (!session || !profile) return;
      const latestWeightLog = await getLatestWeightLog();
      if (!latestWeightLog) {
        if (profile?.weight_checkin_frequency !== "off") {
          setShowWeightCheckinModal(true);
        }
        return;
      }
      const dayDifference = getDaysSince(latestWeightLog.measured_at);
      if (dayDifference >= 1 && profile?.weight_checkin_frequency === "daily") {
        setShowWeightCheckinModal(true);
        return;
      }
      if (
        dayDifference >= 7 &&
        profile?.weight_checkin_frequency === "weekly"
      ) {
        setShowWeightCheckinModal(true);
        return;
      }
    }

    checkWeightReminder();
  }, [session?.user.id, profile?.weight_checkin_frequency]);

  useEffect(() => {
    async function checkMeasurementsReminder() {
      const skippedDay = localStorage.getItem(
        MEASUREMENTS_CHECKIN_SKIPPED_DATE_KEY,
      );
      if (skippedDay === getTodayDateString()) {
        return;
      }
      if (!session || !profile) return;
      const latestMeasurementLog = await getLatestMeasurementLog();
      if (!latestMeasurementLog) {
        if (profile?.measurements_checkin_frequency !== "off") {
          setShowMeasurementsCheckinModal(true);
        }
        return;
      }
      const dayDifference = getDaysSince(latestMeasurementLog.measured_at);
      if (
        dayDifference >= 14 &&
        profile?.measurements_checkin_frequency === "biweekly"
      ) {
        setShowMeasurementsCheckinModal(true);
        return;
      }
      if (
        dayDifference >= 28 &&
        profile?.measurements_checkin_frequency === "monthly"
      ) {
        setShowMeasurementsCheckinModal(true);
        return;
      }
    }

    checkMeasurementsReminder();
  }, [session?.user.id, profile?.measurements_checkin_frequency]);

  useEffect(() => {
    if (!profile) return;

    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleCreateProfile(
    name: string,
    preferredWeightUnit: PreferredWeightUnit,
    preferredWorkoutUnit: PreferredWeightUnit,
    preferredMeasurementUnit: PreferredMeasurementUnit,
  ) {
    try {
      await createDefaultExercises();
      const profileData = await createProfile(
        name,
        preferredWeightUnit,
        preferredWorkoutUnit,
        preferredMeasurementUnit,
      );
      setProfile(profileData);
      setShowProfileSetup(false);
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  }

  async function handleUpdateProfile(profile: Profile) {
    const profileData = await updateProfile(profile);
    if (!profileData) return;
    setProfile(profileData);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  if (authLoading || profileLoading) return <div>Loading...</div>;
  return (
    <>
      <Router>
        <Routes>
          {!session ? (
            <Route
              element={
                <Layout
                  toggleTheme={toggleTheme}
                  theme={theme}
                  session={false}
                />
              }
            >
              <Route path="/" element={<WelcomeScreen />} />

              <Route path="/signup" element={<SignUp />} />

              <Route path="/login" element={<Login />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            profile && (
              <Route
                element={
                  <Layout
                    session={true}
                    toggleTheme={toggleTheme}
                    theme={theme}
                  />
                }
              >
                <Route path="/" element={<Home name={profile.name} />} />
                <Route path="/workout" element={<ActiveWorkout />} />
                <Route
                  path="/workout/routine/:routineId"
                  element={<ActiveWorkout />}
                />

                <Route path="/history" element={<History />} />
                <Route
                  path="/history/:workoutId/edit"
                  element={<ChangeWorkout />}
                />
                <Route path="/history/:workoutId" element={<ViewWorkout />} />

                <Route path="/routines" element={<Routines />} />
                <Route path="/routines/new" element={<RoutineBuilder />} />
                <Route
                  path="/routines/:routineId/edit"
                  element={<RoutineBuilder />}
                />

                <Route path="/exercises" element={<Exercises />} />

                <Route
                  path="/profile"
                  element={
                    <ProfilePage
                      toggleTheme={toggleTheme}
                      theme={theme}
                      profile={profile}
                      handleUpdateProfile={handleUpdateProfile}
                    />
                  }
                />

                <Route
                  path="/progress"
                  element={<Progress profile={profile} />}
                />
              </Route>
            )
          )}
        </Routes>
      </Router>
      {showProfileSetup && <ProfileSetupModal onCreate={handleCreateProfile} />}
      {showWeightCheckinModal && profile && (
        <WeightCheckinModal
          name={profile.name}
          unit={profile.preferred_weight_unit}
          onSkip={() => {
            localStorage.setItem(
              WEIGHT_CHECKIN_SKIPPED_DATE_KEY,
              getTodayDateString(),
            );
            setShowWeightCheckinModal(false);
          }}
        />
      )}

      {showMeasurementsCheckinModal && profile && (
        <MeasurementsCheckinModal
          name={profile.name}
          unit={profile?.preferred_measurement_unit}
          onSkip={() => {
            localStorage.setItem(
              MEASUREMENTS_CHECKIN_SKIPPED_DATE_KEY,
              getTodayDateString(),
            );
            setShowMeasurementsCheckinModal(false);
          }}
        />
      )}
    </>
  );
}

export default App;

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

import type { PreferredUnit, Profile, ProfileDB } from "./types/profile";

import { getProfile, createProfile, updateProfile } from "./services/profiles";
import { createWeightLog } from "./services/weightLogs";

function App() {
  const [session, setSession] = useState<Session | null>();
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileDB>();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showWeightCheckinModal, setShowWeightCheckinModal] = useState(false);
  const [showMeasurementsCheckinModal, setShowMeasurementsCheckinModal] =
    useState(true);

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
      setAuthLoading(false);
      console.log("Session loaded:", data.session);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
      console.log("Auth state changed:", session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfileLoading(false);
      return;
    }

    async function setupProfile() {
      setProfileLoading(true);
      try {
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
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
  }, [session]);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleCreateProfile(
    name: string,
    preferredUnit: PreferredUnit,
  ) {
    const profileData = await createProfile(name, preferredUnit);
    setProfile(profileData);
    setShowProfileSetup(false);
  }

  async function handleUpdateProfile(profile: Profile) {
    const profileData = await updateProfile(profile);
    if (!profileData) return;
    setProfile(profileData);
  }

  async function handleCreateWeightLog(weight: number, measuredAt: string) {
    const weightInKg =
      profile?.preferred_unit === "lb" ? weight / 2.20462262 : weight;
    const finalMeasuredAt =
      measuredAt || new Date().toISOString().split("T")[0];
    const roundedWeight = Math.round(weightInKg * 10) / 10;
    const weightLog = await createWeightLog(roundedWeight, finalMeasuredAt);
    console.log(weightLog);
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
                <Route path="/" element={<Home />} />
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

                <Route path="/progress" element={<Progress />} />
              </Route>
            )
          )}
        </Routes>
      </Router>
      {showProfileSetup && <ProfileSetupModal onCreate={handleCreateProfile} />}
      {showWeightCheckinModal && profile && (
        <WeightCheckinModal
          name={profile.name}
          unit={profile.preferred_unit}
          previousWeight={74.2}
          previousDate="June 10"
          onSave={(weight) => {
            handleCreateWeightLog(
              weight,
              new Date().toISOString().split("T")[0],
            );
            setShowWeightCheckinModal(false);
          }}
          onSkip={() => setShowWeightCheckinModal(false)}
        />
      )}

      {showMeasurementsCheckinModal && profile && (
        <MeasurementsCheckinModal
          name={profile.name}
          unit={profile?.preferred_unit === "kg" ? "cm" : "in"}
          // previousDate="May 28"
          // previousMeasurements={{
          //   waist: "30",
          //   chest: "20",
          //   shoulders: "10",
          //   hips: "50",
          //   biceps: "40",
          //   quads: "50",
          //   calves: "20",
          // }}
          onSave={(measurements) => {
            console.log(measurements);
            setShowMeasurementsCheckinModal(false);
          }}
          onSkip={() => setShowMeasurementsCheckinModal(false)}
        />
      )}
    </>
  );
}

export default App;

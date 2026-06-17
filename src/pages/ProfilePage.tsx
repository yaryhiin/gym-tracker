import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/Profile.module.scss";

import type { ProfileDB, Profile } from "../types/profile";

import { supabase } from "../supabase";

import ExecuteModal from "../components/ExecuteModal";

type ProfilePageProps = {
  toggleTheme: () => void;
  theme: string;
  profile: ProfileDB;
  handleUpdateProfile: (profile: Profile) => void;
};

const MODAL_TEXT = "You sure you want to Log Out?";

const ProfilePage = ({
  toggleTheme,
  theme,
  profile,
  handleUpdateProfile,
}: ProfilePageProps) => {
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState<Profile>({
    name: profile.name || "",
    date_of_birth: profile.date_of_birth || "",
    preferred_unit: profile.preferred_unit || "kg",
    first_day_of_week: profile.first_day_of_week || "monday",
    weight_checkin_frequency: profile.weight_checkin_frequency || "off",
    measurements_checkin_frequency:
      profile.measurements_checkin_frequency || "off",
  });

  useEffect(() => {
    setProfileForm({
      name: profile.name ?? "",
      date_of_birth: profile.date_of_birth ?? "",
      preferred_unit: profile.preferred_unit,
      first_day_of_week: profile.first_day_of_week,
      weight_checkin_frequency: profile.weight_checkin_frequency,
      measurements_checkin_frequency: profile.measurements_checkin_frequency,
    });
  }, [profile]);

  const [showLogOutModal, setShowLogOutModal] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      setShowLogOutModal(false);
      return;
    }

    setShowLogOutModal(false);
    navigate("/");
  }

  async function handleSave() {
    await handleUpdateProfile(profileForm);
    navigate("/");
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>
      <div className={styles.sections}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.title}>Personal</h2>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Name</p>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  name: e.target.value.trim(),
                }))
              }
              value={profileForm.name}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Birthday</p>
            <input
              className={styles.input}
              type="date"
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  date_of_birth: e.target.value.trim(),
                }))
              }
              value={profileForm.date_of_birth}
            />
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.title}>Preferences</h2>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Preferred units</p>
            <div className={styles.toggle}>
              <button
                type="button"
                className={
                  profileForm.preferred_unit === "kg" ? styles.active : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    preferred_unit: "kg",
                  }))
                }
              >
                kg
              </button>

              <button
                type="button"
                className={
                  profileForm.preferred_unit === "lb" ? styles.active : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    preferred_unit: "lb",
                  }))
                }
              >
                lb
              </button>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>First day of the week</p>
            <select
              className={styles.input}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  first_day_of_week: e.target.value.trim(),
                }))
              }
              value={profileForm.first_day_of_week}
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Theme</p>
            <div className={styles.toggle}>
              <button
                onClick={toggleTheme}
                className={cn(
                  "button",
                  styles.themeSwitch,
                  theme === "light" && styles.activeTheme,
                )}
                title="Switch to light"
              >
                ☀️ Light
              </button>
              <button
                onClick={toggleTheme}
                className={cn(
                  "button",
                  styles.themeSwitch,
                  theme === "dark" && styles.activeTheme,
                )}
                title="Switch to dark"
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.title}>Reminders</h2>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Weight check-in</p>
            <div className={styles.toggle}>
              <button
                type="button"
                className={
                  profileForm.weight_checkin_frequency === "daily"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    weight_checkin_frequency: "daily",
                  }))
                }
              >
                Daily
              </button>

              <button
                type="button"
                className={
                  profileForm.weight_checkin_frequency === "weekly"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    weight_checkin_frequency: "weekly",
                  }))
                }
              >
                Weekly
              </button>
              <button
                type="button"
                className={
                  profileForm.weight_checkin_frequency === "off"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    weight_checkin_frequency: "off",
                  }))
                }
              >
                Off
              </button>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Measurments</p>
            <div className={styles.toggle}>
              <button
                type="button"
                className={
                  profileForm.measurements_checkin_frequency === "biweekly"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    measurements_checkin_frequency: "biweekly",
                  }))
                }
              >
                2 weeks
              </button>

              <button
                type="button"
                className={
                  profileForm.measurements_checkin_frequency === "monthly"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    measurements_checkin_frequency: "monthly",
                  }))
                }
              >
                Montly
              </button>
              <button
                type="button"
                className={
                  profileForm.measurements_checkin_frequency === "off"
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    measurements_checkin_frequency: "off",
                  }))
                }
              >
                Off
              </button>
            </div>
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.title}>Account</h2>
          <button
            className={cn("button", styles.logOut)}
            onClick={() => setShowLogOutModal(true)}
          >
            Log Out
          </button>
        </div>
      </div>
      {showLogOutModal && (
        <ExecuteModal
          text={MODAL_TEXT}
          btnText="Log Out"
          onClose={() => setShowLogOutModal(false)}
          onDelete={handleLogout}
        />
      )}
    </div>
  );
};

export default ProfilePage;

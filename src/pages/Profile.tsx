import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/Profile.module.scss";

import { supabase } from "../supabase";

type ProfileProps = {
  toggleTheme: () => void;
  theme: string;
};

const Profile = ({ toggleTheme, theme }: ProfileProps) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [preferredUnit, setPreferredUnit] = useState<"kg" | "lb">("kg");
  const [firstDay, setFirstDay] = useState("Monday");
  const [weightCheckIn, setWeightCheckIn] = useState("off");
  const [measurmentsCheckIn, setMeasurmentsCheckIn] = useState("off");

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sections}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.title}>Personal</h2>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Name</p>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value.trim())}
              value={name}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Birthday</p>
            <input
              className={styles.input}
              type="date"
              onChange={(e) => setBirthday(e.target.value.trim())}
              value={birthday}
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
                className={preferredUnit === "kg" ? styles.active : ""}
                onClick={() => setPreferredUnit("kg")}
              >
                kg
              </button>

              <button
                type="button"
                className={preferredUnit === "lb" ? styles.active : ""}
                onClick={() => setPreferredUnit("lb")}
              >
                lb
              </button>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>First day of the week</p>
            <select
              className={styles.input}
              onChange={(e) => setFirstDay(e.target.value)}
              value={firstDay}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
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
                className={weightCheckIn === "daily" ? styles.active : ""}
                onClick={() => setWeightCheckIn("daily")}
              >
                Daily
              </button>

              <button
                type="button"
                className={weightCheckIn === "weekly" ? styles.active : ""}
                onClick={() => setWeightCheckIn("weekly")}
              >
                Weekly
              </button>
              <button
                type="button"
                className={weightCheckIn === "off" ? styles.active : ""}
                onClick={() => setWeightCheckIn("off")}
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
                className={measurmentsCheckIn === "2weeks" ? styles.active : ""}
                onClick={() => setMeasurmentsCheckIn("2weeks")}
              >
                2 weeks
              </button>

              <button
                type="button"
                className={
                  measurmentsCheckIn === "monthly" ? styles.active : ""
                }
                onClick={() => setMeasurmentsCheckIn("monthly")}
              >
                Montly
              </button>
              <button
                type="button"
                className={measurmentsCheckIn === "off" ? styles.active : ""}
                onClick={() => setMeasurmentsCheckIn("off")}
              >
                Off
              </button>
            </div>
          </div>
        </div>
        <button className={cn("button", styles.logOut)} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;

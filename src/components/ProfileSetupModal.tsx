import { useState } from "react";

import styles from "../styles/modules/ProfileSetupModal.module.scss";

import type {
  PreferredWeightUnit,
  PreferredMeasurementUnit,
} from "../types/profile";

type ProfileSetupModal = {
  onCreate: (
    name: string,
    preferedWeightUnit: PreferredWeightUnit,
    preferredWorkoutUnit: PreferredWeightUnit,
    prefferedMeasurementUnit: PreferredMeasurementUnit,
  ) => void;
};

const ProfileSetupModal = ({ onCreate }: ProfileSetupModal) => {
  const [name, setName] = useState("");
  const [preferredWeightUnit, setPreferredWeightUnit] =
    useState<PreferredWeightUnit>("kg");
  const [preferredWorkoutUnit, setPreferredWorkoutUnit] =
    useState<PreferredWeightUnit>("kg");
  const [preferredMeasurementUnit, setPreferredMeasurementUnit] =
    useState<PreferredMeasurementUnit>("cm");

  return (
    <div className="modal">
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Welcome</h2>
        <p className={styles.message}>Please set up your profile</p>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Name:</p>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value.trim())}
            value={name}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Weight unit</p>
          <div className="toggle">
            <button
              type="button"
              className={preferredWeightUnit === "kg" ? "active" : ""}
              onClick={() => setPreferredWeightUnit("kg")}
            >
              kg
            </button>

            <button
              type="button"
              className={preferredWeightUnit === "lb" ? "active" : ""}
              onClick={() => setPreferredWeightUnit("lb")}
            >
              lb
            </button>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Measurement unit</p>
          <div className="toggle">
            <button
              type="button"
              className={preferredMeasurementUnit === "cm" ? "active" : ""}
              onClick={() => setPreferredMeasurementUnit("cm")}
            >
              cm
            </button>

            <button
              type="button"
              className={preferredMeasurementUnit === "in" ? "active" : ""}
              onClick={() => setPreferredMeasurementUnit("in")}
            >
              in
            </button>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Workout weight unit</p>
          <div className="toggle">
            <button
              type="button"
              className={preferredWorkoutUnit === "kg" ? "active" : ""}
              onClick={() => setPreferredWorkoutUnit("kg")}
            >
              kg
            </button>

            <button
              type="button"
              className={preferredWorkoutUnit === "lb" ? "active" : ""}
              onClick={() => setPreferredWorkoutUnit("lb")}
            >
              lb
            </button>
          </div>
        </div>
        <div className="buttonContainer">
          <button
            className={styles.skipBtn}
            onClick={() =>
              onCreate(
                name,
                preferredWeightUnit,
                preferredWorkoutUnit,
                preferredMeasurementUnit,
              )
            }
          >
            Skip for now
          </button>
          <button
            className={styles.continueBtn}
            onClick={() =>
              onCreate(
                name,
                preferredWeightUnit,
                preferredWorkoutUnit,
                preferredMeasurementUnit,
              )
            }
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;

import { useState } from "react";

import styles from "../styles/modules/Modal.module.scss";

import type { PreferredUnit } from "../types/profile";

type ProfileSetupModal = {
  onCreate: (name: string, preferedUnit: PreferredUnit) => void;
};

const ProfileSetupModal = ({ onCreate }: ProfileSetupModal) => {
  const [name, setName] = useState("");
  const [preferredUnit, setPreferredUnit] = useState<PreferredUnit>("kg");

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Welcome</h2>
        <p className={styles.message}>Please setup your profile</p>
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
        <div className={styles.buttonContainer}>
          <button
            className={styles.skipBtn}
            onClick={() => onCreate(name, preferredUnit)}
          >
            Skip for now
          </button>
          <button
            className={styles.continueBtn}
            onClick={() => onCreate(name, preferredUnit)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;

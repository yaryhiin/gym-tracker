import { useState } from "react";

import styles from "../styles/modules/Modal.module.scss";

import type { WeightCheckinErrors } from "../types/errors";

type WeightCheckinModalProps = {
  unit: "kg" | "lb";
  previousWeight?: number;
  previousDate?: string;
  name: string;
  onSave: (newWeight: number) => void;
  onSkip: () => void;
};

const WeightCheckinModal = ({
  unit,
  previousWeight,
  previousDate,
  name,
  onSave,
  onSkip,
}: WeightCheckinModalProps) => {
  const [newWeight, setNewWeight] = useState("");
  const [errors, setErrors] = useState<WeightCheckinErrors>({
    weight: false,
  });

  function handleOnSave() {
    if (!newWeight) {
      setErrors({ weight: true });
      return;
    }

    onSave(Number(newWeight));
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1 className={styles.heading}>Weight check-in</h1>
        <div className={styles.message}>
          <p className={styles.messageContainer}>
            {new Date().getHours()
              ? "Good morning"
              : new Date().getHours() < 18
                ? "Good afternoon"
                : "Good evening"}
            {", "}
            {name}
          </p>
          <p className={styles.message}>What`s your weight today?</p>
        </div>
        <p className={styles.previous}>
          {previousWeight}
          {unit} - {previousDate}
        </p>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>New weight</p>
          <input
            className={`${styles.input} ${errors.weight && styles.error}`}
            type="number"
            inputMode="decimal"
            onChange={(e) => setNewWeight(e.target.value)}
            value={newWeight}
          />{" "}
          {unit}
          {errors.weight && (
            <p className={`${styles.errorMessage} ${styles.fullWidth}`}>
              Please put in new weight
            </p>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.continueBtn} onClick={handleOnSave}>
            Save
          </button>
          <button className={styles.skipBtn} onClick={onSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightCheckinModal;

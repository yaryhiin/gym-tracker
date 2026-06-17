import { useState, useEffect } from "react";

import styles from "../styles/modules/Modal.module.scss";

import type { WeightCheckinErrors } from "../types/errors";

import { createWeightLog, getLatestWeightLog } from "../services/weightLogs";

type WeightCheckinModalProps = {
  unit: "kg" | "lb";
  name: string;
  onSkip: () => void;
};

const WeightCheckinModal = ({
  unit,
  name,
  onSkip,
}: WeightCheckinModalProps) => {
  const [newWeight, setNewWeight] = useState("");
  const [errors, setErrors] = useState<WeightCheckinErrors>({
    weight: false,
  });
  const [previousData, setPreviousData] = useState({ date: "", weight: "" });

  useEffect(() => {
    async function getLatestData() {
      const latestData = await getLatestWeightLog();
      if (!latestData) return;
      setPreviousData({
        date: latestData.measured_at,
        weight: latestData.weight_kg,
      });
    }

    getLatestData();
  }, []);

  async function handleCreateWeightLog() {
    if (!newWeight) {
      setErrors({ weight: true });
      return;
    }

    const weight = Number(newWeight);
    const weightInKg = unit === "lb" ? weight / 2.20462262 : weight;
    const roundedWeight = Math.round(weightInKg * 10) / 10;
    try {
      await createWeightLog(
        roundedWeight,
        new Date().toISOString().split("T")[0],
      );
    } catch (error) {
      console.error("Error creating weight log:", error);
    } finally {
      onSkip();
    }
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
          {unit === "lb"
            ? Number(previousData.weight) * 2.204
            : previousData.weight}
          {unit} - {previousData.date}
        </p>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>New weight</p>
          <input
            className={`${styles.input} ${errors.weight && styles.error}`}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max="1000"
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
          <button
            className={styles.continueBtn}
            onClick={handleCreateWeightLog}
          >
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

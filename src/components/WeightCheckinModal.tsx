import { useState, useEffect } from "react";

import styles from "../styles/modules/Modal.module.scss";

import type { WeightCheckinErrors } from "../types/errors";

import { createWeightLog, getLatestWeightLog } from "../services/weightLogs";

import InfoModal from "../components/InfoModal";
import { formatDate } from "../services/utils";

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

  const [saving, setSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    const weightInKg =
      unit === "lb" ? Math.round((weight / 2.20462262) * 100) / 100 : weight;
    setSaving(true);
    try {
      await createWeightLog(weightInKg, new Date().toISOString());
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error creating weight log:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      onSkip();
      setSaving(false);
    }
  }

  return (
    <div className="modal">
      <div className="modalContent">
        <h1 className="heading">Weight check-in</h1>
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
        {previousData && (
          <p className={styles.previous}>
            {unit === "lb"
              ? Math.round(Number(previousData.weight) * 2.20462262 * 10) / 10
              : previousData.weight}
            {unit} - {formatDate(previousData.date)}
          </p>
        )}

        <div className={styles.weightContainer}>
          <p className={styles.inputLabel}>New weight</p>
          <div>
            <input
              className={`${styles.input} ${errors.weight && "error"}`}
              type="number"
              step="0.01"
              min="0"
              max="1000"
              onChange={(e) => setNewWeight(e.target.value)}
              value={newWeight}
            />
            {unit}
          </div>
          {errors.weight && (
            <p className={`errorMessage ${styles.fullWidth}`}>
              Please put in new weight
            </p>
          )}
        </div>
        <div className="buttonContainer">
          <button
            className={styles.continueBtn}
            onClick={handleCreateWeightLog}
          >
            Save
          </button>
          <button className={styles.skipBtn} onClick={onSkip}>
            Skip for today
          </button>
        </div>
      </div>
      {saving && <InfoModal type={"saving"} />}
      {showErrorModal && <InfoModal type={"error"} />}
      {showSuccessModal && <InfoModal type={"success"} />}
    </div>
  );
};

export default WeightCheckinModal;

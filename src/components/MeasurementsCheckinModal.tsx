import { useState } from "react";

import styles from "../styles/modules/Modal.module.scss";

type MeasurementsForm = {
  waist: string;
  chest: string;
  shoulders: string;
  hips: string;
  biceps: string;
  quads: string;
  calves: string;
};

type MeasurementsCheckinModalProps = {
  unit: "cm" | "in";
  previousMeasurements: MeasurementsForm;
  previousDate: string;
  name: string;
  onSave: (newMeasurements: MeasurementsForm) => void;
  onSkip: () => void;
};

const MeasurementsCheckinModal = ({
  unit,
  previousMeasurements,
  previousDate,
  name,
  onSave,
  onSkip,
}: MeasurementsCheckinModalProps) => {
  const [newMeasurements, setNewMeasurements] = useState<MeasurementsForm>({
    waist: "",
    chest: "",
    shoulders: "",
    hips: "",
    biceps: "",
    quads: "",
    calves: "",
  });
  const measurementLabels: Record<keyof MeasurementsForm, string> = {
  waist: "Waist",
  chest: "Chest",
  shoulders: "Shoulders",
  hips: "Hips",
  biceps: "Biceps",
  quads: "Quads",
  calves: "Calves",
};

  function handleOnSave() {
    if (!newMeasurements) return;
    onSave(newMeasurements);
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
          <p className={styles.message}>What`s your measurements today?</p>
        </div>
        <p className={styles.previous}>
          {previousMeasurements.waist}
          {unit} - {previousDate}
        </p>
        {Object.entries(newMeasurements).map(([key, value]) => (
          <div key={key} className={styles.inputContainer}>
            <p className={styles.inputLabel}>
              {measurementLabels[key as keyof typeof measurementLabels]}
            </p>
            <input
              className={styles.input}
              type="number"
              inputMode="decimal"
              onChange={(e) =>
                setNewMeasurements((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              value={value}
            />{" "}
            {unit}
          </div>
        ))}

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

export default MeasurementsCheckinModal;

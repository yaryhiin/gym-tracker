import { useEffect, useState } from "react";

import styles from "../styles/modules/Modal.module.scss";

import type { MeasurementType } from "../types/measurements";

import {
  createMeasurementType,
  deleteMeasurementType,
  getMeasurementTypes,
} from "../services/measurements";
import { createLocalId } from "../services/utils";

import ExecuteModal from "./ExecuteModal";

type MeasurementsCheckinModalProps = {
  unit: "cm" | "in";
  // previousMeasurements: MeasurementTypeDB[];
  // previousDate: string;
  name: string;
  onSave: (newMeasurements: MeasurementType[]) => void;
  onSkip: () => void;
};

const MeasurementsCheckinModal = ({
  unit,
  // previousMeasurements,
  // previousDate,
  name,
  onSave,
  onSkip,
}: MeasurementsCheckinModalProps) => {
  const [newMeasurements, setNewMeasurements] = useState<MeasurementType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chosenType, setChosenType] = useState<MeasurementType>();

  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newMeasurementName, setNewMeasurementName] = useState("");
  const [addingMeasurement, setAddingMeasurement] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadMeasurementTypes() {
      setLoading(true);

      try {
        const types = await getMeasurementTypes();
        console.log("Data from the database:", types);
        const formItems = types.map((type) => ({
          id: createLocalId(),
          measurement_type_id: type.id,
          name: type.name,
          value_cm: "",
        }));
        console.log("local data that i add in the system:", formItems);
        setNewMeasurements(formItems);
      } catch (error) {
        console.error("Error loading measurement types:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMeasurementTypes();
  }, []);

  async function handleCreateMeasurementType() {
    const trimmedName = newMeasurementName.trim();

    if (!trimmedName) {
      setError(true);
      return;
    }

    try {
      setAddingMeasurement(true);
      const createdType = await createMeasurementType(trimmedName);
      setNewMeasurements((prev) => [
        ...prev,
        {
          id: createLocalId(),
          measurement_type_id: createdType.id,
          name: createdType.name,
          value_cm: "",
        },
      ]);
      setNewMeasurementName("");
      setIsAddingMeasurement(false);
    } catch (error) {
      console.error("Error creating measurement type:", error);
    } finally {
      setAddingMeasurement(false);
    }
  }

  async function handleDeleteType() {
    try {
      if (!chosenType) return;
      const deletedType = await deleteMeasurementType(
        chosenType.measurement_type_id,
      );
      if (!deletedType) return;
      setNewMeasurements((prev) =>
        prev.filter((measurement) => measurement.id != chosenType.id),
      );
    } catch (error) {
      console.error("Error deleting type:", error);
    } finally {
      setShowModal(false);
    }
  }

  function updateMeasurements(id: string, value: string) {
    setNewMeasurements((prev) =>
      prev.map((measurement) =>
        measurement.id === id
          ? { ...measurement, value_cm: value }
          : measurement,
      ),
    );
  }

  function handleOnSave() {
    if (!newMeasurements) return;
    onSave(newMeasurements);
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1 className={styles.heading}>Measurements check-in</h1>
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
        {newMeasurements.length === 0 && !loading && (
          <p className={styles.emptyText}>
            No measurements yet. Add your first measurement to start tracking.
          </p>
        )}
        <div className={styles.measurements}>
          {newMeasurements.map((measurement) => (
            <div key={measurement.id} className={styles.inputContainer}>
              <p className={styles.inputLabel}>
                {`${measurement.name} (${unit}):`}
              </p>

              <div className={styles.inputBox}>
                <input
                  className={styles.input}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  max="1000"
                  onChange={(e) =>
                    updateMeasurements(measurement.id, e.target.value)
                  }
                  value={measurement.value_cm}
                />
                <button
                  className={styles.deleteTypeBtn}
                  onClick={() => {
                    setChosenType(measurement);
                    setShowModal(true);
                  }}
                >
                  ✕
                </button>
              </div>
              {/* <p className={styles.message}>
                {previousMeasurements[key as keyof typeof previousMeasurements]}
                {unit} - {previousDate}
              </p> */}
            </div>
          ))}
          {isAddingMeasurement ? (
            <div className={`${styles.addType} ${styles.inputContainer}`}>
              <input
                className={error ? styles.error : ""}
                type="text"
                placeholder="e.g. Neck, Forearm"
                value={newMeasurementName}
                onChange={(e) => setNewMeasurementName(e.target.value)}
              ></input>
              {error && (
                <p className={styles.errorMessage}>Please enter a name</p>
              )}

              <button
                className={styles.addTypeBtn}
                onClick={handleCreateMeasurementType}
                disabled={addingMeasurement}
              >
                ✓
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsAddingMeasurement(false)}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className={styles.addMeasurement}
              type="button"
              onClick={() => setIsAddingMeasurement(true)}
            >
              + Add measurement
            </button>
          )}
        </div>
        {showModal && (
          <ExecuteModal
            text={`"You sure you want to delete type ${chosenType?.name}? \n If you just want to skip it, you can leave it empty"`}
            btnText="Yes"
            onClose={() => setShowModal(false)}
            onDelete={handleDeleteType}
          />
        )}
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

import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        <h2 className={styles.heading}>{t("profile.welcome")}</h2>
        <p className={styles.message}>{t("profile.setup")}</p>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>{t("profile.name.title")}:</p>
          <input
            className={styles.input}
            type="text"
            placeholder={t("profile.name.placeHolder")}
            onChange={(e) => setName(e.target.value.trim())}
            value={name}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>{t("profile.preferences.weight")}</p>
          <div className="toggle">
            <button
              type="button"
              className={preferredWeightUnit === "kg" ? "active" : ""}
              onClick={() => setPreferredWeightUnit("kg")}
            >
              {t("units.kg")}
            </button>

            <button
              type="button"
              className={preferredWeightUnit === "lb" ? "active" : ""}
              onClick={() => setPreferredWeightUnit("lb")}
            >
              {t("units.lb")}
            </button>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>
            {t("profile.preferences.measurements")}
          </p>
          <div className="toggle">
            <button
              type="button"
              className={preferredMeasurementUnit === "cm" ? "active" : ""}
              onClick={() => setPreferredMeasurementUnit("cm")}
            >
              {t("units.cm")}
            </button>

            <button
              type="button"
              className={preferredMeasurementUnit === "in" ? "active" : ""}
              onClick={() => setPreferredMeasurementUnit("in")}
            >
              {t("units.in")}
            </button>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>
            {t("profile.preferences.workout")}
          </p>
          <div className="toggle">
            <button
              type="button"
              className={preferredWorkoutUnit === "kg" ? "active" : ""}
              onClick={() => setPreferredWorkoutUnit("kg")}
            >
              {t("units.kg")}
            </button>

            <button
              type="button"
              className={preferredWorkoutUnit === "lb" ? "active" : ""}
              onClick={() => setPreferredWorkoutUnit("lb")}
            >
              {t("units.lb")}
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
            {t("common.skipNow")}
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
            {t("common.continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;

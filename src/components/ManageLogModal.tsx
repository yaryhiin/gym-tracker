import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, EllipsisVertical } from "lucide-react";

import styles from "../styles/modules/ManageLogModal.module.scss";
import type { MeasurementTypeDB } from "../types/measurements";
import ExecuteModal from "./ExecuteModal";

type Log = {
  date: string;
  value: number;
};

type ManageLogModalProps = {
  unit: string;
  log?: Log;
  measurementTypes?: MeasurementTypeDB[] | null;
  type?: string;
  onClose: () => void;
  onSave: (date: string, value: number, typeId?: string) => Promise<void>;
  onAddType?: (name: string) => Promise<void>;
  onArchiveType?: (id: string) => Promise<void>;
  onUpdateType?: (id: string, name: string) => Promise<void>;
};

const ManageLogModal = ({
  unit,
  log,
  measurementTypes,
  type,
  onClose,
  onSave,
  onAddType,
  onArchiveType,
  onUpdateType,
}: ManageLogModalProps) => {
  const { t } = useTranslation();
  const [newLog, setNewLog] = useState(
    log ?? {
      date: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16),
      value: 0,
    },
  );
  const [typeId, setTypeId] = useState(type ?? "");
  const [newTypeName, setNewTypeName] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({
    value: false,
    date: false,
    type: false,
    name: false,
  });
  const [showAddInput, setShowAddInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (typeId === "add") {
      setShowAddInput(true);
    }
  }, [typeId]);

  useEffect(() => {
    if (!showOptions) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }

    function handleScroll() {
      setShowOptions(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showOptions]);

  function handleSubmit() {
    if (newLog.value <= 0) {
      setErrors((prev) => ({ ...prev, value: true }));
      return;
    }
    if (!newLog.date) {
      setErrors((prev) => ({ ...prev, date: true }));
      return;
    }
    if (typeId)
      onSave(
        new Date(newLog.date).toISOString(),
        unit === "lb"
          ? Math.round((newLog.value / 2.20462262) * 100) / 100
          : newLog.value,
        typeId,
      );
    else
      onSave(
        new Date(newLog.date).toISOString(),
        unit === "lb"
          ? Math.round((newLog.value / 2.20462262) * 100) / 100
          : newLog.value,
      );
  }

  function handleCreateMeasurementType() {
    const trimmedName = newTypeName.trim();

    if (!trimmedName) {
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }
    if (onAddType) {
      onAddType(trimmedName);
      setNewTypeName("");
      setShowAddInput(false);
      setTypeId(measurementTypes?.[0].id ?? "");
    }
  }

  function handleUpdateMeasurementType() {
    const trimmedName = newTypeName.trim();

    if (!trimmedName) {
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }
    if (onUpdateType) {
      onUpdateType(typeId, trimmedName);
      setNewTypeName("");
      setShowAddInput(false);
      setTypeId(measurementTypes?.[0].id ?? "");
    }
  }

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="heading">
          {log ? t("manageLogModal.change") : t("manageLogModal.add")}
        </h2>
        <div className={styles.mainContainer}>
          <div className={styles.valueContainer}>
            <p className={styles.inputLabel}>
              {t("weightCheckin.new")} ({t(`units.${unit}`)})
            </p>
            <input
              className={`${styles.input} ${errors.value && "error"}`}
              type="number"
              step="0.01"
              min="0"
              max="1000"
              placeholder="0"
              onChange={(e) =>
                setNewLog((prev) => ({
                  ...prev,
                  value: Number(e.target.value),
                }))
              }
              value={newLog.value === 0 ? "" : newLog.value}
            />
            {errors.value && (
              <p className={`errorMessage ${styles.fullWidth}`}>
                {t("weightCheckin.error")}
              </p>
            )}
          </div>
          {measurementTypes &&
            (showAddInput ? (
              <div className={`${styles.addType} ${styles.inputContainer}`}>
                <p className={styles.inputLabel}>{t("history.type")}</p>
                <input
                  className={`${styles.input} ${errors.name ? "error" : ""}`}
                  type="text"
                  placeholder={t("measurementsCheckin.placeHolder")}
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                ></input>
                {errors.name && (
                  <p className="errorMessage">
                    {t("measurementsCheckin.error")}
                  </p>
                )}

                <button
                  className={styles.addTypeBtn}
                  onClick={() => {
                    if (editing) {
                      handleUpdateMeasurementType();
                      setEditing(false);
                    } else handleCreateMeasurementType();
                  }}
                >
                  ✓
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowAddInput(false);
                    setTypeId(measurementTypes[0].id);
                    setNewTypeName("");
                    setErrors({
                      value: false,
                      date: false,
                      type: false,
                      name: false,
                    });
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.typeContainer}>
                <p className={styles.inputLabel}>{t("history.type")}</p>
                <select
                  className={styles.select}
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                >
                  {measurementTypes
                    .filter((type) => type.is_active)
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  <option value="add">{t("manageLogModal.addType")}</option>
                </select>
                <div className={styles.menu}>
                  <div className="exerciseMenuWrapper">
                    {showOptions ? (
                      <div ref={menuRef} className="exerciseMenu">
                        <button
                          onClick={() => {
                            setShowAddInput(true);
                            setNewTypeName(
                              measurementTypes.find(
                                (type) => type.id === typeId,
                              )?.name ?? "",
                            );
                            setEditing(true);
                          }}
                        >
                          <Pencil size={15} />
                          {t("common.edit")}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 size={15} />
                          {t("common.delete")}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="accessBtn"
                        onClick={() => {
                          setShowOptions(true);
                        }}
                      >
                        <EllipsisVertical size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          <div className={styles.dateContainer}>
            <p>{t("history.date")}</p>
            <input
              className={`${styles.input} ${errors.value && "error"}`}
              type="datetime-local"
              onChange={(e) => {
                setNewLog((prev) => ({
                  ...prev,
                  date: e.target.value,
                }));
              }}
              value={newLog.date}
            />
            {errors.value && (
              <p className={`errorMessage ${styles.fullWidth}`}>
                {t("weightCheckin.error")}
              </p>
            )}
          </div>
        </div>
        <div className="buttonContainer">
          <button
            className={cn(styles.saveBtn, "button")}
            onClick={handleSubmit}
          >
            {t("common.save")}
          </button>
          <button className={cn(styles.backBtn, "button")} onClick={onClose}>
            {t("common.back")}
          </button>
        </div>
        {showDeleteModal && (
          <ExecuteModal
            text={t("modal.delete.type")}
            btnText={t("common.delete")}
            onClose={() => setShowDeleteModal(false)}
            onDelete={() => {
              if (onArchiveType) onArchiveType(typeId);
              setShowDeleteModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageLogModal;

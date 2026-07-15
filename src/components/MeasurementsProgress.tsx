import { useState, useEffect } from "react";

import styles from "../styles/modules/ProgressComponents.module.scss";

import Chart from "./Chart";
import {
  getMeasurementTypes,
  getMeasurementsHistory,
} from "../services/measurements";

import type {
  MeasurementTypeDB,
  MeasurementLogDB,
} from "../types/measurements";
import type { ChartData } from "../types/chart";

type MeasurementsProgressProps = {
  unit: "cm" | "in";
};

const MeasurementsProgress = ({ unit }: MeasurementsProgressProps) => {
  const [measurementsData, setMeasurementsData] = useState<MeasurementLogDB[]>(
    [],
  );
  const [measurementTypes, setMeasurementTypes] =
    useState<MeasurementTypeDB[]>();

  const [chosenType, setChosenType] = useState<MeasurementTypeDB>();
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const types = await getMeasurementTypes();
        const logs = await getMeasurementsHistory();
        if (!types || !logs) {
          return;
        }
        setMeasurementTypes(types);
        setMeasurementsData(logs);
        setChosenType(types[0]);
      } catch (error) {
        console.error("Error fetching measurements data:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const chosenData = measurementsData.filter(
      (data) => data.measurement_type_id === chosenType?.id,
    );

    const formattedData = chosenData.map((data) => ({
      date: data.measured_at,
      value:
        unit === "in"
          ? Math.round((data.value_cm / 2.54) * 10) / 10
          : data.value_cm,
    }));

    setFilteredData(formattedData);
  }, [chosenType]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Measurements</h2>
        <div className={styles.selectGroup}>
          <label>Choose measurement</label>
          {measurementTypes && measurementTypes.length > 0 ? (
            <select
              value={chosenType?.id}
              onChange={(e) => {
                const selectedType = measurementTypes.find(
                  (type) => type.id === e.target.value,
                );

                setChosenType(selectedType);
              }}
            >
              {measurementTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          ) : (
            <p>You dont have any data saved</p>
          )}
        </div>
      </div>
      <Chart
        chartData={filteredData}
        yPadding={2}
        label={chosenType?.name ?? "Measurement"}
        unit={unit}
      />
    </div>
  );
};

export default MeasurementsProgress;

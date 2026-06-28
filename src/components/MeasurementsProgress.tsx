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
import type { ChartBriefInfo, ChartData } from "../types/chart";

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
  const [briefData, setBriefData] = useState<ChartBriefInfo>();
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

    const entries = chosenData.length;

    const firstEntry = formattedData[0];
    const currentEntry = formattedData[formattedData.length - 1];

    const current = currentEntry.value ?? 0;

    const change =
      currentEntry && firstEntry ? currentEntry.value - firstEntry.value : 0;

    setFilteredData(formattedData);
    setBriefData({ current, change, entries });
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
      <div className={styles.briefInfo}>
        <div>
          <p>Current:</p>
          <p>
            {briefData?.current}
            {unit}
          </p>
        </div>

        <div>
          <p>Change:</p>
          <p>
            {briefData && briefData.change >= 0 && "+"}
            {briefData?.change}
            {unit}
          </p>
        </div>
        <div>
          <p>Entries:</p>
          <p>{briefData?.entries}</p>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsProgress;

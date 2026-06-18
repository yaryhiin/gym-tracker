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
        console.log("Logs:", logs);
        console.log("Types", types);
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
    setFilteredData(
      chosenData.map((data) => ({
        date: data.measured_at,
        value:
          unit === "in"
            ? Math.round((data.value_cm / 2.54) * 10) / 10
            : data.value_cm,
      })),
    );
    const current =
      unit === "in"
        ? Math.round((chosenData[0].value_cm / 2.54) * 10) / 10
        : chosenData[0].value_cm;
    const entries = chosenData.length;
    const change =
      unit === "in"
        ? Math.round(
            (current -
              Math.round((chosenData[entries - 1].value_cm / 2.54) * 10) / 10) *
              10,
          ) / 10
        : current - chosenData[entries - 1].value_cm;
    setBriefData({ current, change, entries });
  }, [chosenType]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Measurements</h1>
        <p>Choose measurement</p>
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
      <Chart chartData={filteredData} yPadding={2} />
      <div className={styles.briefInfo}>
        <p>
          Current: <b>{briefData?.current}</b>
          {unit}
        </p>
        <p>
          Change: <b>{briefData?.change}</b>
          {unit}
        </p>
        <p>Entries: {briefData?.entries}</p>
      </div>
    </div>
  );
};

export default MeasurementsProgress;

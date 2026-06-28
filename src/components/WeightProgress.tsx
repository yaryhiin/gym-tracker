import { useState, useEffect } from "react";

import styles from "../styles/modules/ProgressComponents.module.scss";

import Chart from "./Chart";

import { getWeightsHistory } from "../services/weightLogs";

import type { ChartData, ChartBriefInfo } from "../types/chart";

type WeightProgressProps = {
  unit: "kg" | "lb";
};

const WeightProgress = ({ unit }: WeightProgressProps) => {
  const [weightData, setWeightData] = useState<ChartData[]>([]);
  const [briefData, setBriefData] = useState<ChartBriefInfo>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const data = await getWeightsHistory();
        if (!data) return;
        const formattedData = data.map((log) => ({
          date: log.measured_at,
          value:
            unit === "lb"
              ? Math.round(log.weight_kg * 2.20462262 * 10) / 10
              : log.weight_kg,
        }));

        const entries = data.length;

        const firstEntry = formattedData[0];
        const currentEntry = formattedData[formattedData.length - 1];

        const current = currentEntry.value ?? 0;

        const change =
          currentEntry && firstEntry
            ? Math.round((currentEntry.value - firstEntry.value) * 10) / 10
            : 0;

        setWeightData(formattedData);
        setBriefData({ current, change, entries });
      } catch (error) {
        console.error("Error fetching weight data:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Body Weight</h2>
      </div>
      <Chart
        chartData={weightData}
        yPadding={5}
        label="Body Weight"
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

export default WeightProgress;

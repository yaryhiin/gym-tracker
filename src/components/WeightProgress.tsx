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
          label: `${
            unit === "lb"
              ? Math.round(log.weight_kg * 2.20462262 * 10) / 10
              : log.weight_kg
          } ${unit}`,
        }));

        const entries = data.length;

        const firstEntry = formattedData[0];
        const currentEntry = formattedData[formattedData.length - 1];

        const current = currentEntry.value ?? 0;

        const change =
          currentEntry && firstEntry
            ? currentEntry.value - firstEntry.value
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
        <h1 className={styles.title}>Body Weight</h1>
      </div>
      <Chart chartData={weightData} yPadding={5} />
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

export default WeightProgress;

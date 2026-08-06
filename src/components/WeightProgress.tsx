import { useState, useEffect } from "react";

import styles from "../styles/modules/ProgressComponents.module.scss";

import Chart from "./Chart";

import { getWeightsHistory } from "../services/weightLogs";

import type { ChartData } from "../types/chart";

type WeightProgressProps = {
  unit: "kg" | "lb";
  firstDayOfTheWeek: string;
};

const WeightProgress = ({ unit, firstDayOfTheWeek }: WeightProgressProps) => {
  const [weightData, setWeightData] = useState<ChartData[]>([]);
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

        setWeightData(formattedData);
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
        firstDayOfTheWeek={firstDayOfTheWeek}
      />
    </div>
  );
};

export default WeightProgress;

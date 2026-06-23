import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

import styles from "../styles/modules/Chart.module.scss";

import type { ChartData } from "../types/chart";

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type ChartProps = {
  chartData: ChartData[];
  yPadding: number;
};

type Range = "1w" | "1m" | "3m" | "all";

const Chart = ({ chartData, yPadding }: ChartProps) => {
  const [range, setRange] = useState<Range>("all");
  const [filteredData, setFilteredData] = useState<ChartData[]>();

  useEffect(() => {
    if (range === "all") {
      setFilteredData(chartData);
      return;
    }

    const today = new Date();

    const days =
      range === "1w" ? 7 : range === "1m" ? 30 : range === "3m" ? 90 : 0;

    const cutOffDate = new Date();
    cutOffDate.setDate(today.getDate() - days);

    const formatted = chartData.filter((entry) => {
      const entryDate = parseLocalDate(entry.date);
      return entryDate >= cutOffDate;
    });

    setFilteredData(formatted);
  }, [range, chartData]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis
              domain={[`dataMin - ${yPadding}`, `dataMax + ${yPadding}`]}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text)",
              }}
              labelStyle={{
                color: "var(--text)",
              }}
            />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.rangeButtons}>
        <button
          className={`${styles.rangeBtn} ${range === "1w" && styles.active}`}
          onClick={() => setRange("1w")}
        >
          1W
        </button>
        <button
          className={`${styles.rangeBtn} ${range === "1m" && styles.active}`}
          onClick={() => setRange("1m")}
        >
          1M
        </button>
        <button
          className={`${styles.rangeBtn} ${range === "3m" && styles.active}`}
          onClick={() => setRange("3m")}
        >
          3M
        </button>
        <button
          className={`${styles.rangeBtn} ${range === "all" && styles.active}`}
          onClick={() => setRange("all")}
        >
          All
        </button>
      </div>
    </div>
  );
};

export default Chart;

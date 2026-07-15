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

import type { ChartBriefInfo, ChartData } from "../types/chart";

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type ChartProps = {
  chartData: ChartData[];
  yPadding: number;
  label: string;
  unit: string;
};

type Range = "1w" | "1m" | "3m" | "all";

const Chart = ({ chartData, yPadding, label, unit }: ChartProps) => {
  const [range, setRange] = useState<Range>("all");
  const [filteredData, setFilteredData] = useState<ChartData[]>();
  const [briefData, setBriefData] = useState<ChartBriefInfo>();

  useEffect(() => {
    if (!chartData || chartData.length === 0) {
      setBriefData({
        current: 0,
        change: 0,
        entries: 0,
      });
      return;
    }
    const entries = chartData.length;

    const firstEntry = chartData[0];
    const currentEntry = chartData[chartData.length - 1];

    const current = currentEntry.value ?? 0;

    const change =
      currentEntry && firstEntry
        ? Math.round((currentEntry.value - firstEntry.value) * 10) / 10
        : 0;

    setBriefData({ current, change, entries });
  }, [chartData]);

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

    if (formatted.length === 0) {
      setBriefData({
        current: 0,
        change: 0,
        entries: 0,
      });
      return;
    }

    const entries = formatted.length;

    const firstEntry = formatted[0];
    const currentEntry = formatted[formatted.length - 1];

    const current = currentEntry.value ?? 0;

    const change =
      currentEntry && firstEntry
        ? Math.round((currentEntry.value - firstEntry.value) * 10) / 10
        : 0;

    setBriefData({ current, change, entries });
  }, [range, chartData]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={filteredData}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                return new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              minTickGap={25}
            />
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
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
              formatter={(value) => [`${value}${unit}`, label]}
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

export default Chart;

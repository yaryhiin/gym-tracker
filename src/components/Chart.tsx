import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "../styles/modules/Chart.module.scss";

import type { ChartData } from "../types/chart";

type ChartProps = {
  chartData: ChartData[];
  yPadding: number;
};

const Chart = ({ chartData, yPadding }: ChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
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
  );
};

export default Chart;

import type { ChartData } from "../types/chart";

export const DEFAULT_EXERCISES = [
  // Chest
  {
    name: "Barbell Bench Press",
    category: "Chest",
  },
  {
    name: "Incline Dumbbell Press",
    category: "Chest",
  },
  {
    name: "Machine Chest Press",
    category: "Chest",
  },
  {
    name: "Cable Fly",
    category: "Chest",
  },
  {
    name: "Dumbbell Fly",
    category: "Chest",
  },

  // Back
  {
    name: "Pull-Up",
    category: "Back",
  },
  {
    name: "Lat Pulldown",
    category: "Back",
  },
  {
    name: "Barbell Row",
    category: "Back",
  },
  {
    name: "Seated Cable Row",
    category: "Back",
  },
  {
    name: "Chest-Supported Row",
    category: "Back",
  },
  {
    name: "Deadlift",
    category: "Back",
  },

  // Legs
  {
    name: "Barbell Squat",
    category: "Legs",
  },
  {
    name: "Hack Squat",
    category: "Legs",
  },
  {
    name: "Leg Press",
    category: "Legs",
  },
  {
    name: "Bulgarian Split Squat",
    category: "Legs",
  },
  {
    name: "Leg Extension",
    category: "Legs",
  },
  {
    name: "Leg Curl",
    category: "Legs",
  },
  {
    name: "Romanian Deadlift",
    category: "Legs",
  },
  {
    name: "Hip Thrust",
    category: "Legs",
  },
  {
    name: "Standing Calf Raise",
    category: "Legs",
  },
  {
    name: "Seated Calf Raise",
    category: "Legs",
  },

  // Shoulders
  {
    name: "Overhead Press",
    category: "Shoulders",
  },
  {
    name: "Dumbbell Shoulder Press",
    category: "Shoulders",
  },
  {
    name: "Lateral Raise",
    category: "Shoulders",
  },
  {
    name: "Rear Delt Fly",
    category: "Shoulders",
  },
  {
    name: "Face Pull",
    category: "Shoulders",
  },

  // Arms
  {
    name: "Barbell Curl",
    category: "Arms",
  },
  {
    name: "Dumbbell Curl",
    category: "Arms",
  },
  {
    name: "Hammer Curl",
    category: "Arms",
  },
  {
    name: "Triceps Pushdown",
    category: "Arms",
  },
  {
    name: "Overhead Triceps Extension",
    category: "Arms",
  },
  {
    name: "Dips",
    category: "Arms",
  },
] as const;

function getDateDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString().split("T")[0];
}

export const exerciseData: ChartData[] = [
  { date: getDateDaysAgo(120), value: 1020 },
  { date: getDateDaysAgo(100), value: 1080 },
  { date: getDateDaysAgo(80), value: 1150 },

  { date: getDateDaysAgo(60), value: 1230 },
  { date: getDateDaysAgo(45), value: 1310 },
  { date: getDateDaysAgo(32), value: 1380 },

  { date: getDateDaysAgo(22), value: 1450 },
  { date: getDateDaysAgo(16), value: 1510 },
  { date: getDateDaysAgo(12), value: 1480 },
  { date: getDateDaysAgo(8), value: 1560 },

  { date: getDateDaysAgo(6), value: 1600 },
  { date: getDateDaysAgo(4), value: 1580 },
  { date: getDateDaysAgo(2), value: 1640 },
  { date: getDateDaysAgo(0), value: 1680 },
];

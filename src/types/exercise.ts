export type ExerciseDB = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  created_at: string;
};

export type Exercise = {
  name: string;
  category: string;
};

export type ExerciseLogsDB = {
  id: string;
  name: string;
  created_at: string;
  finished_at: string | null;
  workout_exercises: {
    id: string;
    exercise_id: string;
    exercise_name: string;
    category: string;
    order_index: number;
    workout_sets: {
      id: string;
      set_number: number;
      weight: number;
      reps: number;
      done: boolean;
    }[];
  }[];
};

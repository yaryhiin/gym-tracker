export type WorkoutSetDB = {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  rest_seconds: number;
  done: boolean;
  created_at: string;
};

export type ExerciseDB = {
  id: string;
  workout_id: string;
  exercise_name: string;
  category: string;
  order_index: number;
  notes: string;
  created_at: string;
};

export type WorkoutDB = {
  id: string;
  user_id: string;
  name: string;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  created_at: string;
};

export type Workout = {
  name: string;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  exercises: Exercise[];
};

export type WorkoutSet = {
  set_number: number;
  weight: number;
  reps: number;
  rest_seconds: number;
  done: boolean;
};

export type Exercise = {
  id: string;
  exercise_name: string;
  category: string;
  order_index: number;
  notes: string;
  sets: WorkoutSet[];
};

export type WorkoutDetails = WorkoutDB & {
  workout_exercises: Array<
    ExerciseDB & {
      workout_sets: WorkoutSetDB[];
    }
  >;
};
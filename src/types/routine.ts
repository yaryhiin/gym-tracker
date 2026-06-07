import type { ExerciseDB } from "./exercise";

export type Routine = {
  name: string;
  exercises: RoutineExercise[];
  exercises_count: number;
  categories: string[];
};

export type RoutineDB = {
  id: string;
  user_id: string;
  name: string;
  exercises_count: number;
  categories: string[];
  created_at: string;
};

export type RoutineExercise = {
  exercise_id: string;
  order_index: number;
};

export type RoutineExerciseDB = {
  id: string;
  routine_id: string;
  exercise_id: string;
  order_index: number;
  created_at: string;
};

export type RoutineDetails = RoutineDB & {
  routine_exercises: Array<
    RoutineExerciseDB & {
      exercises: ExerciseDB;
    }
  >;
};

export type SelectedRoutineExercise = {
  exercise_id: string;
  exercise_name: string;
  category: string;
  order_index: number;
};

export type RoutineDraft = {
  name: string;
  exercises: SelectedRoutineExercise[];
};

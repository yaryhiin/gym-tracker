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

export type WorkoutExerciseDB = {
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
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  id: string;
  exercise_name: string;
  exercise_id: string;
  category: string;
  order_index: number;
  notes: string;
  sets: WorkoutSet[];
};

export type WorkoutSet = {
  set_number: number;
  weight: number;
  reps: number;
  rest_seconds: number;
  done: boolean;
};

export type WorkoutDetails = WorkoutDB & {
  workout_exercises: Array<
    WorkoutExerciseDB & {
      workout_sets: WorkoutSetDB[];
    }
  >;
};

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

export type Routine = {
  name: string;
  exercises: RoutineExercise[];
};

export type RoutineDB = {
  id: string;
  user_id: string;
  name: string;
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

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

export type ExerciseLogDB = {
  date: string;
  exercise_id: string;
  exercise_name: string;
  sets: {
    id: string;
    set_number: number;
    weight: number;
    reps: number;
    done: boolean;
  }[];
};

import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";
import type { Exercise } from "../types/exercise";
import { DEFAULT_EXERCISES } from "./defaults";

export async function getExercises() {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return data || [];
}

export async function getExercisesLogs() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
      id,
      name,
      created_at,
      finished_at,
      workout_exercises (
        id,
        exercise_id,
        exercise_name,
        category,
        order_index,
        workout_sets (
          id,
          set_number,
          weight,
          reps,
          done
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function createExercise(exercise: Exercise) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("exercises")
    .insert({ ...exercise, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    return null;
  }

  return data;
}

export async function updateExercise(
  name: string,
  category: string,
  id: string,
) {
  const { error: ExerciseError } = await supabase
    .from("exercises")
    .update({
      name,
      category,
    })
    .eq("id", id);

  if (ExerciseError) throw ExerciseError;
}

export async function deleteExercise(exercise_id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exercise_id)
    .eq("user_id", userId);

  if (error) {
    console.error(`Error deleting exercise:`, error.message);
    return false;
  }

  return true;
}

let defaultExercisesPromise: Promise<Exercise[] | null> | null = null;

export function createDefaultExercises() {
  if (defaultExercisesPromise) {
    return defaultExercisesPromise;
  }

  defaultExercisesPromise = createDefaultExercisesInternal().finally(() => {
    defaultExercisesPromise = null;
  });

  return defaultExercisesPromise;
}

async function createDefaultExercisesInternal() {
  const exercises = await getExercises();

  if (exercises.length > 0) {
    return exercises;
  }

  const userId = await getCurrentUserId();

  const updatedList = DEFAULT_EXERCISES.map((exercise) => ({
    ...exercise,
    user_id: userId,
  }));

  const { data, error } = await supabase
    .from("exercises")
    .insert(updatedList)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

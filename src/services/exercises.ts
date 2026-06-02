import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";
import type { Exercise } from "../types/exercise";

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

export async function updateExercise() {}

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

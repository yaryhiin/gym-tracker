import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";
import type { Routine, RoutineDetails } from "../types/routine";

export async function getRoutines() {
  const { data, error } = await supabase
    .from("routines")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching routines", error);
    return [];
  }

  return data || [];
}

export async function getRoutineDetails(
  routineId: string,
): Promise<RoutineDetails | null> {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
        *,
        routine_exercises (
          *,
          exercises (*)
        )
      `,
    )
    .eq("id", routineId)
    .single();

  if (error) {
    console.error("Error fetching workout details:", error);
    return null;
  }

  return data;
}

export async function createRoutine(routine: Routine) {
  const userId = await getCurrentUserId();

  const { data: createdRoutine, error: routineError } = await supabase
    .from("routines")
    .insert({
      name: routine.name,
      user_id: userId,
      exercises_count: routine.exercises_count,
      categories: routine.categories,
    })
    .select()
    .single();

  if (routineError) throw routineError;

  const routineExercisesToInsert = routine.exercises.map((exercise) => ({
    routine_id: createdRoutine.id,
    exercise_id: exercise.exercise_id,
    order_index: exercise.order_index,
  }));

  const { error: exerciseError } = await supabase
    .from("routine_exercises")
    .insert(routineExercisesToInsert)
    .select();

  if (exerciseError) throw exerciseError;

  return createdRoutine;
}

export async function updateRoutine(routine: Routine, routineId: string) {
  const { error: routineError } = await supabase
    .from("routines")
    .update({
      name: routine.name,
      exercises_count: routine.exercises_count,
      categories: routine.categories,
    })
    .eq("id", routineId);

  if (routineError) throw routineError;

  const { error: deleteError } = await supabase
    .from("routine_exercises")
    .delete()
    .eq("routine_id", routineId);

  if (deleteError) throw deleteError;

  const routineExercisesToInsert = routine.exercises.map((exercise) => ({
    routine_id: routineId,
    exercise_id: exercise.exercise_id,
    order_index: exercise.order_index,
  }));

  if (routineExercisesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("routine_exercises")
      .insert(routineExercisesToInsert);

    if (insertError) throw insertError;
  }

  return true;
}

export async function deleteRoutine(routine_id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("id", routine_id)
    .eq("user_id", userId);

  if (error) {
    console.error(`Error deleting exercise:`, error.message);
    return false;
  }

  return true;
}

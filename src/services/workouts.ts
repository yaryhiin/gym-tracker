import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";
import type { Workout } from "../types/workout";

export async function getWorkoutsHistory() {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data || [];
}

export async function getWorkoutDetails(workoutId: string) {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
      *,
      workout_exercises (
        *,
        workout_sets (*)
      )
    `,
    )
    .eq("id", workoutId)
    .single();

  if (error) {
    console.error("Error fetching workout details:", error);
    return null;
  }

  return data;
}

export async function createWorkout(workout: Workout) {
  const userId = await getCurrentUserId();

  const { data: createdWorkout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: userId,
      name: workout.name,
      duration_seconds: workout.duration_seconds,
      finished_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (workoutError) throw workoutError;

  for (const exercise of workout.exercises) {
    const { data: createdExercise, error: exerciseError } = await supabase
      .from("workout_exercises")
      .insert({
        workout_id: createdWorkout.id,
        exercise_name: exercise.exercise_name,
      })
      .select()
      .single();

    if (exerciseError) throw exerciseError;

    const setsToInsert = exercise.sets.map((set) => ({
      workout_exercise_id: createdExercise.id,
      set_number: set.set_number,
      weight: set.weight,
      reps: set.reps,
      done: set.done,
    }));

    const { error: setsError } = await supabase
      .from("workout_sets")
      .insert(setsToInsert);

    if (setsError) throw setsError;
  }

  return createdWorkout;
}

// export async function updateWorkout(key: string, updatedData) {
//   const { id, ...updates } = updatedData;
//   const { data, error } = await supabase
//     .from(key)
//     .update(updates)
//     .eq("id", id)
//     .select();

//   if (error) {
//     console.error(`Error updating ${key}:`, error.message);
//     return null;
//   }

//   return data?.[0] || null;
// }

export async function deleteWorkout(workoutId: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", userId);

  if (error) {
    console.error(`Error deleting data from workouts:`, error.message);
    return false;
  }

  return true;
}

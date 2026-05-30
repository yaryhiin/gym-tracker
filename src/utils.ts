import type { Workout, Exercise, Routine, RoutineDetails } from "./types";
import { supabase } from "./supabase";

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

export async function createWorkout(workout: Workout, userId: string) {
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

export async function createExercise(exercise: Exercise, user_id: string) {
  const { data, error } = await supabase
    .from("exercises")
    .insert({ ...exercise, user_id })
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    return null;
  }

  return data;
}

export async function createRoutine(routine: Routine, user_id: string) {
  const { data: createdRoutine, error: routineError } = await supabase
    .from("routines")
    .insert({
      name: routine.name,
      user_id,
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

export async function deleteWorkout(workoutId: string, userId: string) {
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

export async function deleteExercise(exercise_id: string, user_id: string) {
  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exercise_id)
    .eq("user_id", user_id);

  if (error) {
    console.error(`Error deleting exercise:`, error.message);
    return false;
  }

  return true;
}

export async function deleteRoutine(routine_id: string, user_id: string) {
  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("id", routine_id)
    .eq("user_id", user_id);

  if (error) {
    console.error(`Error deleting exercise:`, error.message);
    return false;
  }

  return true;
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

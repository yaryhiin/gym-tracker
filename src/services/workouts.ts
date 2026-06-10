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
        exercise_id: exercise.exercise_id,
        category: exercise.category,
        order_index: exercise.order_index,
        notes: exercise.notes,
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

export async function updateWorkout(workout: Workout, workoutId: string) {
  const userId = await getCurrentUserId();

  const { data: updatedWorkout, error: workoutError } = await supabase
    .from("workouts")
    .update({
      name: workout.name,
      duration_seconds: workout.duration_seconds,
      finished_at: workout.finished_at || new Date().toISOString(),
    })
    .eq("id", workoutId)
    .eq("user_id", userId)
    .select()
    .single();

  if (workoutError) throw workoutError;

  const { error: deleteError } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("workout_id", workoutId);

  if (deleteError) throw deleteError;

  for (const exercise of workout.exercises) {
    const { data: createdExercise, error: exerciseError } = await supabase
      .from("workout_exercises")
      .insert({
        workout_id: workoutId,
        exercise_name: exercise.exercise_name,
        exercise_id: exercise.exercise_id,
        category: exercise.category,
        order_index: exercise.order_index,
        notes: exercise.notes,
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

  return updatedWorkout;
}

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

export async function getPreviousExerciseData(exerciseIds: string[]) {
  if (exerciseIds.length === 0) return {};

  const { data, error } = await supabase
    .from("workout_exercises")
    .select(
      `
      id,
      exercise_id,
      exercise_name,
      workout_id,
      order_index,
      workout_sets (
        id,
        set_number,
        weight,
        reps,
        rest_seconds,
        done
      ),
      workouts (
        id,
        name,
        finished_at,
        created_at
      )
    `,
    )
    .in("exercise_id", exerciseIds);

  if (error) {
    console.error("Error fetching previous exercise data:", error);
    return {};
  }

  const previousByExerciseId: Record<string, any> = {};

  const sortedData = [...(data || [])].sort((a, b) => {
    const dateA = new Date(
      a.workouts?.[0]?.finished_at || a.workouts?.[0]?.created_at || 0,
    ).getTime();

    const dateB = new Date(
      b.workouts?.[0]?.finished_at || b.workouts?.[0]?.created_at || 0,
    ).getTime();

    return dateB - dateA;
  });

  for (const item of sortedData) {
    if (!previousByExerciseId[item.exercise_id]) {
      previousByExerciseId[item.exercise_id] = item;
    }
  }

  return previousByExerciseId;
}

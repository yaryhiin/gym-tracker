import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";

import type { FormattedMeasurement } from "../types/measurements";

export async function getMeasurementTypes() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("measurement_types")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data || [];
}

export async function getMeasurementsHistory() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("measurement_logs")
    .select("*")
    .eq("user_id", userId)
    .order("measured_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getLatestMeasurementLog() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("measurement_logs")
    .select("*")
    .eq("user_id", userId)
    .order("measured_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createMeasurementType(name: string) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("measurement_types")
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error) throw error;

  return data || null;
}

export async function deleteMeasurementType(id: string) {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("measurement_types")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return false;

  return true;
}

export async function createMeasurementLog(
  measurements: FormattedMeasurement[],
) {
  const userId = await getCurrentUserId();
  const measurementsToInsert = measurements.map((measurement) => ({
    ...measurement,
    user_id: userId,
  }));

  const { error } = await supabase
    .from("measurement_logs")
    .insert(measurementsToInsert)
    .select();

  if (error) throw error;
}

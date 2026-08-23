import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";
import i18n from "../i18n";

import type { FormattedMeasurement } from "../types/measurements";
import { getDefaultMeasurementTypes } from "./defaults";

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

export async function archiveMeasurementType(id: string) {
  const { error } = await supabase
    .from("measurement_types")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) return false;

  return true;
}

export async function updateMeasurementType(id: string, name: string) {
  const { data, error } = await supabase
    .from("measurement_types")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createMeasurementLog(
  measurements: FormattedMeasurement[],
) {
  const userId = await getCurrentUserId();
  const measurementsToInsert = measurements.map((measurement) => ({
    ...measurement,
    user_id: userId,
  }));

  const { data, error } = await supabase
    .from("measurement_logs")
    .insert(measurementsToInsert)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteMeasurementLog(id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("measurement_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return true;
}

export async function updateMeasurementLog(
  log: FormattedMeasurement,
  id: string,
) {
  const { data, error } = await supabase
    .from("measurement_logs")
    .update(log)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createDefaultMeasurementTypes(selectedLangauge: string) {
  const types = await getMeasurementTypes();

  if (types.length > 0) {
    return;
  }

  const userId = await getCurrentUserId();

  await i18n.changeLanguage(selectedLangauge);

  const DEFAULT_MEASUREMENT_TYPES = getDefaultMeasurementTypes();

  const updatedList = DEFAULT_MEASUREMENT_TYPES.map((type) => ({
    ...type,
    user_id: userId,
  }));

  const { error } = await supabase
    .from("measurement_types")
    .insert(updatedList)
    .select();

  if (error) {
    throw error;
  }
}

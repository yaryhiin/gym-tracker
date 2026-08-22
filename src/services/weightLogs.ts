import { supabase } from "../supabase";
import type { ChartData } from "../types/chart";
import { getCurrentUserId } from "./auth";

export async function getWeightsHistory() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("measured_at", { ascending: true });
  if (error) throw error;

  return data || [];
}

export async function getLatestWeightLog() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("measured_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  return data;
}

export async function createWeightLog(weight_kg: number, measured_at: string) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("weight_logs")
    .insert({ user_id: userId, weight_kg, measured_at })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteWeightLog(id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error(`Error deleting weight log`, error.message);
    return false;
  }

  return true;
}

export async function updateWeightLog(log: ChartData, id: string) {
  const { data, error } = await supabase
    .from("weight_logs")
    .update({ weight_kg: log.value, measured_at: log.date })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

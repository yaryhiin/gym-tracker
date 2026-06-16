import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";

export async function getWeightsHistory() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("measured_at", { ascending: false });
  if (error) throw error;

  return data || [];
}

export async function createWeightLog(weight_kg: number, measured_at: string) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("weight_logs")
    .insert({ user_id: userId, weight_kg, measured_at })
    .select()
    .single();

  if (error) throw error;

  return data || null;
}

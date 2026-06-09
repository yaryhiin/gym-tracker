import { supabase } from "../supabase";
import { getCurrentUserId } from "./auth";

export async function getOrCreateProfile() {
  const userId = await getCurrentUserId();

  const { data: existingProfile, error: getError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (getError) throw getError;

  if (existingProfile) return existingProfile;

  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      name: "",
      preferred_unit: "kg",
      first_day_of_week: "monday",
      weight_checkin_frequency: "off",
      measurements_checkin_frequency: "off",
    })
    .select()
    .single();

  if (createError) throw createError;

  return newProfile;
}
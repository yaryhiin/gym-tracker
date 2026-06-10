import { supabase } from "../supabase";
import type { PreferredUnit, Profile } from "../types/profile";
import { getCurrentUserId } from "./auth";

export async function getProfile() {
  const userId = await getCurrentUserId();

  const { data: existingProfile, error: getError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (getError) throw getError;

  return existingProfile;
}

export async function createProfile(
  name: string,
  preferred_unit: PreferredUnit,
) {
  const userId = await getCurrentUserId();
  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      name,
      preferred_unit,
      first_day_of_week: "monday",
      weight_checkin_frequency: "off",
      measurements_checkin_frequency: "off",
    })
    .select()
    .single();

  if (createError) throw createError;

  return newProfile;
}

export async function updateProfile(profile: Profile) {
  const userId = await getCurrentUserId();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (profileError) throw profileError;

  return profileData;
}

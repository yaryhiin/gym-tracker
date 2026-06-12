export type PreferredUnit = "kg" | "lb";

export type CheckinFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "off";

export type ProfileDB = {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  preferred_unit: PreferredUnit;
  first_day_of_week: string;
  weight_checkin_frequency: CheckinFrequency;
  measurement_checkin_frequency: CheckinFrequency;
  created_at: string;
  updated_at: string | null;
};

export type Profile = {
  name: string;
  date_of_birth: string;
  preferred_unit: PreferredUnit;
  first_day_of_week: string;
  weight_checkin_frequency: CheckinFrequency;
  measurements_checkin_frequency: CheckinFrequency;
};

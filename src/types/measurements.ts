export type MeasurementTypeDB = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type MeasurementType = {
  id: string;
  measurement_type_id: string;
  name: string;
  value_cm: string;
};

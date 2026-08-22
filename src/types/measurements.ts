export type MeasurementTypeDB = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  is_active: boolean;
};

export type MeasurementLog = {
  id: string;
  measurement_type_id: string;
  name: string;
  value: string;
};

export type FormattedMeasurement = {
  measurement_type_id: string;
  value_cm: number;
  measured_at: string;
};

export type MeasurementLogDB = {
  id: string;
  user_id: string;
  measurement_type_id: string;
  value_cm: number;
  measured_at: string;
  created_at: string;
};

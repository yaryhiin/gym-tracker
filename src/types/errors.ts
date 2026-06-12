export type AuthErrors = {
  confirmPassword: boolean;
  password: boolean;
  email: boolean;
};

export type AddErrors = {
  name: boolean;
  category: boolean;
};

export type RoutineErrors = {
  name: boolean;
  exercises: boolean;
};

export type WeightCheckinErrors = {
  weight: boolean;
};
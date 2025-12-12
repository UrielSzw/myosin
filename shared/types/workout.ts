export type ISetType =
  | "normal"
  | "warmup"
  | "drop"
  | "failure"
  | "cluster"
  | "rest-pause"
  | "mechanical"
  | "eccentric"
  | "partial"
  | "isometric";

export type IBlockType = "individual" | "superset" | "circuit";

export type IExerciseMuscle =
  | "chest"
  | "upper_back"
  | "lats"
  | "shoulders_front"
  | "shoulders_side"
  | "shoulders_rear"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "lower_back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"
  | "hip_flexors"
  | "full_body";

export type IExerciseEquipment =
  | "bodyweight"
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "ez_bar"
  | "plate"
  | "cable"
  | "machine"
  | "smith_machine"
  | "bench"
  | "pull_up_bar"
  | "dip_bars"
  | "resistance_band"
  | "trap_bar"
  | "landmine"
  | "suspension_trainer"
  | "medicine_ball"
  | "cardio_machine";

export type IExerciseSource = "system" | "user";

export type IExerciseType = "compound" | "isolation";

export type IMovementPattern =
  | "push"
  | "pull"
  | "squat"
  | "hinge"
  | "carry"
  | "core";

export type IDifficulty = 1 | 2 | 3 | 4 | 5;

export type RPEValue = 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;

export type IForceType = "push" | "pull" | "static";

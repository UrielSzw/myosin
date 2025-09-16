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

export type IRepsType = "reps" | "range" | "time" | "distance";

export type IBlockType = "individual" | "superset" | "circuit";

export type IExerciseMuscle =
  | "chest"
  | "back"
  | "lower_back"
  | "lats"
  | "traps"
  | "legs"
  | "quads"
  | "hamstrings"
  | "calves"
  | "arms"
  | "biceps"
  | "triceps"
  | "shoulders"
  | "core"
  | "obliques"
  | "full_body"
  | "glutes"
  | "rear_delts"
  | "forearms"
  | "hip_flexors";

export type IExerciseEquipment =
  | "dumbbell"
  | "barbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "kettlebell"
  | "band"
  | "other";

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
  // Upper Body - Push
  | "chest_upper"
  | "chest_middle"
  | "chest_lower"
  | "front_delts"
  | "side_delts"
  | "rear_delts"
  | "triceps"

  // Upper Body - Pull
  | "lats"
  | "rhomboids"
  | "mid_traps"
  | "lower_traps"
  | "upper_traps"
  | "biceps"
  | "forearms"

  // Core
  | "rectus_abdominis"
  | "obliques"
  | "transverse_abdominis"
  | "erector_spinae"
  | "lower_back"

  // Lower Body
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "hip_flexors"
  | "hip_adductors"
  | "hip_abductors"

  // Specialized
  | "serratus_anterior"
  | "rotator_cuff"
  | "full_body";

export type IExerciseEquipment =
  // Free Weights
  | "barbell"
  | "ez_curl_bar"
  | "dumbbell"
  | "kettlebell"
  | "weight_plate"

  // Machines
  | "cable_machine"
  | "smith_machine"
  | "leg_press"
  | "lat_pulldown"
  | "chest_press_machine"
  | "leg_curl_machine"
  | "leg_extension_machine"
  | "seated_row_machine"
  | "shoulder_press_machine"

  // Bodyweight Equipment
  | "bodyweight"
  | "pull_up_bar"
  | "dip_station"
  | "parallel_bars"

  // Accessories
  | "resistance_band"
  | "suspension_trainer"
  | "medicine_ball"
  | "stability_ball"
  | "foam_roller"
  | "ab_wheel"

  // Benches
  | "flat_bench"
  | "incline_bench"
  | "decline_bench"
  | "preacher_bench";

export type IExerciseSource = "system" | "user";

export type IExerciseType = "compound" | "isolation";

export type RPEValue = 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;

export type IForceType = "push" | "pull" | "static";

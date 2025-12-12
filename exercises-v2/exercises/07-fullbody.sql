-- =============================================
-- FULL BODY EXERCISES - exercises-v2
-- Main muscle group: full_body
-- Total: 11 exercises
-- =============================================

-- ==================== DEADLIFT VARIATIONS ====================

-- 1. Barbell conventional deadlift
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'full_body',
  'barbell',
  'compound',
  '["hamstrings", "glutes", "quads", "lower_back", "lats", "upper_back", "forearms"]',
  '["barbell"]',
  '["80000000-0001-0000-0000-000000000002", "70000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  false
);

-- 2. Trap bar deadlift
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'full_body',
  'trap_bar',
  'compound',
  '["hamstrings", "glutes", "quads", "lower_back", "lats", "upper_back"]',
  '["trap_bar"]',
  '["80000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'hinge',
  false
);

-- ==================== OLYMPIC LIFTS ====================

-- 3. Hang clean
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'full_body',
  'barbell',
  'compound',
  '["hamstrings", "glutes", "quads", "traps", "shoulders", "forearms"]',
  '["barbell"]',
  '["80000000-0001-0000-0000-000000000004", "80000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  false
);

-- 4. Power clean
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'full_body',
  'barbell',
  'compound',
  '["hamstrings", "glutes", "quads", "lower_back", "traps", "shoulders", "forearms"]',
  '["barbell"]',
  '["80000000-0001-0000-0000-000000000003", "80000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  false
);

-- 5. Hang snatch
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'full_body',
  'barbell',
  'compound',
  '["hamstrings", "glutes", "quads", "traps", "shoulders", "triceps"]',
  '["barbell"]',
  '["80000000-0001-0000-0000-000000000003", "80000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  false
);

-- 6. Dumbbell snatch
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'full_body',
  'dumbbell',
  'compound',
  '["hamstrings", "glutes", "quads", "traps", "shoulders", "triceps"]',
  '["dumbbell"]',
  '["80000000-0001-0000-0000-000000000005", "80000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  true,
  'pull',
  false
);

-- ==================== THRUSTERS ====================

-- 7. Barbell thruster
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'full_body',
  'barbell',
  'compound',
  '["quads", "glutes", "shoulders_front", "triceps", "abs"]',
  '["barbell"]',
  '["80000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000001"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  false
);

-- 8. Dumbbell thruster
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'full_body',
  'dumbbell',
  'compound',
  '["quads", "glutes", "shoulders_front", "triceps", "abs"]',
  '["dumbbell"]',
  '["80000000-0001-0000-0000-000000000007", "70000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  false
);

-- ==================== KETTLEBELL ====================

-- 9. Kettlebell swing
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'full_body',
  'kettlebell',
  'compound',
  '["hamstrings", "glutes", "lower_back", "shoulders_front", "abs"]',
  '["kettlebell"]',
  '["80000000-0001-0000-0000-000000000010", "70000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'hinge',
  false
);

-- 10. Kettlebell clean and press
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'full_body',
  'kettlebell',
  'compound',
  '["hamstrings", "glutes", "shoulders_front", "triceps", "abs", "forearms"]',
  '["kettlebell"]',
  '["80000000-0001-0000-0000-000000000009", "80000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  true,
  'push',
  false
);

-- ==================== BODYWEIGHT ====================

-- 11. Burpee
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '80000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'full_body',
  'bodyweight',
  'compound',
  '["chest", "shoulders_front", "triceps", "quads", "glutes", "abs"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  true
);

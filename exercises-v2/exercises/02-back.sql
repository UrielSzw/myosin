-- =============================================
-- BACK EXERCISES (18 exercises)
-- =============================================
-- main_muscle_group: upper_back, lats
-- secondary_muscle_groups: biceps, forearms, shoulders_rear
-- =============================================

-- ==================== LATS (Dorsales) ====================

-- 1. Dominadas (Pull-ups)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["biceps", "upper_back", "forearms"]',
  '["pull_up_bar"]',
  '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'pull',
  true
);

-- 2. Dominadas asistidas (máquina)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'lats',
  'machine',
  'compound',
  '["biceps", "upper_back", "forearms"]',
  '["machine"]',
  '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 3. Jalón al pecho (Lat Pulldown)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'lats',
  'cable',
  'compound',
  '["biceps", "upper_back", "forearms"]',
  '["cable"]',
  '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000004"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 4. Jalón con agarre cerrado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'lats',
  'cable',
  'compound',
  '["biceps", "upper_back"]',
  '["cable"]',
  '["40000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 5. Remo con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'lats',
  'barbell',
  'compound',
  '["upper_back", "biceps", "lower_back", "forearms"]',
  '["barbell"]',
  '["40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'pull',
  false
);

-- 6. Remo con mancuerna a un brazo
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'lats',
  'dumbbell',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["dumbbell", "bench"]',
  '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  true,
  'pull',
  false
);

-- 7. Remo en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'lats',
  'machine',
  'compound',
  '["upper_back", "biceps"]',
  '["machine"]',
  '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000008"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 8. Remo en polea baja (Cable Row)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'lats',
  'cable',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["cable"]',
  '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 9. Remo T-Bar
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'lats',
  'landmine',
  'compound',
  '["upper_back", "biceps", "lower_back", "forearms"]',
  '["landmine", "barbell"]',
  '["40000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 10. Pull-over con mancuerna
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'lats',
  'dumbbell',
  'isolation',
  '["chest", "triceps"]',
  '["dumbbell", "bench"]',
  '["40000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 11. Pull-over en polea alta
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'lats',
  'cable',
  'isolation',
  '["triceps"]',
  '["cable"]',
  '["40000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- ==================== UPPER BACK (Espalda alta) ====================

-- 12. Remo al cuello con barra (Upright Row)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'upper_back',
  'barbell',
  'compound',
  '["shoulders_side", "biceps", "forearms"]',
  '["barbell"]',
  '["40000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 13. Remo al cuello con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'upper_back',
  'dumbbell',
  'compound',
  '["shoulders_side", "biceps", "forearms"]',
  '["dumbbell"]',
  '["40000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 14. Encogimientos con barra (Barbell Shrugs)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'upper_back',
  'barbell',
  'isolation',
  '["forearms"]',
  '["barbell"]',
  '["40000000-0001-0000-0000-000000000015", "40000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 15. Encogimientos con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'upper_back',
  'dumbbell',
  'isolation',
  '["forearms"]',
  '["dumbbell"]',
  '["40000000-0001-0000-0000-000000000014", "40000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 16. Encogimientos en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000016'::uuid,
  'system',
  NULL,
  'upper_back',
  'machine',
  'isolation',
  '["forearms"]',
  '["machine"]',
  '["40000000-0001-0000-0000-000000000014", "40000000-0001-0000-0000-000000000015"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 17. Face Pull
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000017'::uuid,
  'system',
  NULL,
  'upper_back',
  'cable',
  'compound',
  '["shoulders_rear", "biceps"]',
  '["cable"]',
  '["20000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 18. Remo invertido (Inverted Row)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '40000000-0001-0000-0000-000000000018'::uuid,
  'system',
  NULL,
  'upper_back',
  'bodyweight',
  'compound',
  '["lats", "biceps", "forearms"]',
  '["bodyweight", "smith_machine"]',
  '["40000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  true
);

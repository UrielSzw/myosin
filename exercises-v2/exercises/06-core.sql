-- =============================================
-- CORE EXERCISES (18 exercises)
-- =============================================
-- main_muscle_group: abs, obliques, lower_back
-- secondary_muscle_groups: hip_flexors
-- =============================================

-- ==================== ABS (10 exercises) ====================

-- 1. Crunch abdominal
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'isolation',
  '[]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000002", "60000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 2. Crunch en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'abs',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 3. Crunch en polea alta
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'abs',
  'cable',
  'isolation',
  '[]',
  '["cable"]',
  '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 4. Elevación de piernas colgado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'abs',
  'pull_up_bar',
  'compound',
  '["hip_flexors"]',
  '["pull_up_bar"]',
  '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'pull',
  false
);

-- 5. Elevación de piernas en banco
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'abs',
  'bench',
  'compound',
  '["hip_flexors"]',
  '["bench"]',
  '["60000000-0001-0000-0000-000000000004", "60000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 6. Elevación de piernas acostado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000004", "60000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 7. Plancha frontal
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["obliques", "lower_back"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000008"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  false
);

-- 8. Plancha con peso
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'abs',
  'weight_plate',
  'compound',
  '["obliques", "lower_back"]',
  '["weight_plate"]',
  '["60000000-0001-0000-0000-000000000007"]',
  'weight_time',
  NULL,
  NULL,
  3,
  false,
  'isometric',
  false
);

-- 9. Ab wheel rollout
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'abs',
  'ab_wheel',
  'compound',
  '["obliques", "shoulders_front"]',
  '["ab_wheel"]',
  NULL,
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  false
);

-- 10. Mountain climbers
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "shoulders_front"]',
  '["bodyweight"]',
  NULL,
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- ==================== OBLIQUES (4 exercises) ====================

-- 11. Crunch oblicuo
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'obliques',
  'bodyweight',
  'isolation',
  '["abs"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'pull',
  false
);

-- 12. Russian twist
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'obliques',
  'bodyweight',
  'isolation',
  '["abs"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000011", "60000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'rotation',
  false
);

-- 13. Giro con barra (Landmine Rotation)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'obliques',
  'landmine',
  'compound',
  '["abs", "shoulders_front"]',
  '["landmine", "barbell"]',
  '["60000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'rotation',
  false
);

-- 14. Plancha lateral
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'obliques',
  'bodyweight',
  'compound',
  '["abs"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000007"]',
  'time_only',
  NULL,
  NULL,
  2,
  true,
  'isometric',
  false
);

-- ==================== LOWER BACK (4 exercises) ====================

-- 15. Extensión lumbar en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'lower_back',
  'machine',
  'isolation',
  '["glutes"]',
  '["machine"]',
  '["60000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'hinge',
  false
);

-- 16. Hiperextensiones
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000016'::uuid,
  'system',
  NULL,
  'lower_back',
  'hyperextension_bench',
  'compound',
  '["glutes", "hamstrings"]',
  '["hyperextension_bench"]',
  '["60000000-0001-0000-0000-000000000015", "60000000-0001-0000-0000-000000000017"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'hinge',
  true
);

-- 17. Hiperextensiones con peso
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000017'::uuid,
  'system',
  NULL,
  'lower_back',
  'hyperextension_bench',
  'compound',
  '["glutes", "hamstrings"]',
  '["hyperextension_bench", "weight_plate"]',
  '["60000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  true
);

-- 18. Superman
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '60000000-0001-0000-0000-000000000018'::uuid,
  'system',
  NULL,
  'lower_back',
  'bodyweight',
  'compound',
  '["glutes"]',
  '["bodyweight"]',
  '["60000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'hinge',
  false
);

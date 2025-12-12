-- =============================================
-- SHOULDER EXERCISES (15 exercises)
-- =============================================
-- main_muscle_group: shoulders_front, shoulders_side, shoulders_rear
-- secondary_muscle_groups: triceps, upper_back, chest
-- =============================================

-- ==================== SHOULDERS FRONT (Deltoides anterior) ====================

-- 1. Press militar con barra (de pie)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'barbell',
  'compound',
  '["shoulders_side", "triceps", "upper_back"]',
  '["barbell"]',
  '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  false
);

-- 2. Press militar sentado con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'barbell',
  'compound',
  '["shoulders_side", "triceps"]',
  '["barbell", "bench"]',
  '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 3. Press de hombros con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'dumbbell',
  'compound',
  '["shoulders_side", "triceps"]',
  '["dumbbell", "bench"]',
  '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000004"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 4. Press Arnold
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'dumbbell',
  'compound',
  '["shoulders_side", "triceps"]',
  '["dumbbell", "bench"]',
  '["20000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  false
);

-- 5. Press de hombros en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'machine',
  'compound',
  '["shoulders_side", "triceps"]',
  '["machine"]',
  '["20000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 6. Elevaciones frontales con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'dumbbell',
  'isolation',
  '["chest"]',
  '["dumbbell"]',
  '["20000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 7. Elevaciones frontales con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'barbell',
  'isolation',
  '["chest"]',
  '["barbell"]',
  '["20000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- ==================== SHOULDERS SIDE (Deltoides lateral) ====================

-- 8. Elevaciones laterales con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'shoulders_side',
  'dumbbell',
  'isolation',
  '["upper_back"]',
  '["dumbbell"]',
  '["20000000-0001-0000-0000-000000000009", "20000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 9. Elevaciones laterales en polea
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'shoulders_side',
  'cable',
  'isolation',
  '["upper_back"]',
  '["cable"]',
  '["20000000-0001-0000-0000-000000000008", "20000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  true,
  'push',
  false
);

-- 10. Elevaciones laterales en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'shoulders_side',
  'machine',
  'isolation',
  '["upper_back"]',
  '["machine"]',
  '["20000000-0001-0000-0000-000000000008", "20000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- ==================== SHOULDERS REAR (Deltoides posterior) ====================

-- 11. Elevaciones posteriores inclinado (Bent-over Rear Delt Fly)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'shoulders_rear',
  'dumbbell',
  'isolation',
  '["upper_back"]',
  '["dumbbell"]',
  '["20000000-0001-0000-0000-000000000012", "20000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 12. Peck deck inverso (Reverse Fly Machine)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'shoulders_rear',
  'machine',
  'isolation',
  '["upper_back"]',
  '["machine"]',
  '["20000000-0001-0000-0000-000000000011", "20000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 13. Face Pull (también trabaja espalda alta)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'shoulders_rear',
  'cable',
  'compound',
  '["upper_back", "biceps"]',
  '["cable"]',
  '["20000000-0001-0000-0000-000000000011", "40000000-0001-0000-0000-000000000017"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 14. Cruces posteriores en polea baja
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'shoulders_rear',
  'cable',
  'isolation',
  '["upper_back"]',
  '["cable"]',
  '["20000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 15. Press tras nuca con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '20000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'shoulders_side',
  'barbell',
  'compound',
  '["shoulders_front", "shoulders_rear", "triceps"]',
  '["barbell", "bench"]',
  '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  false
);

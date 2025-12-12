-- =============================================
-- CHEST EXERCISES (15 exercises)
-- =============================================
-- main_muscle_group: chest
-- secondary_muscle_groups: shoulders_front, triceps
-- =============================================

-- 1. Press de banca con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'chest',
  'barbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["barbell", "bench"]',
  '["10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 2. Press de banca con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'chest',
  'dumbbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["dumbbell", "bench"]',
  '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 3. Press de banca en máquina Smith
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'chest',
  'smith_machine',
  'compound',
  '["shoulders_front", "triceps"]',
  '["smith_machine", "bench"]',
  '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 4. Press de pecho en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'chest',
  'machine',
  'compound',
  '["shoulders_front", "triceps"]',
  '["machine"]',
  '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 5. Press inclinado con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'chest',
  'barbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["barbell", "bench"]',
  '["10000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 6. Press inclinado con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'chest',
  'dumbbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["dumbbell", "bench"]',
  '["10000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 7. Press declinado con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'chest',
  'barbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["barbell", "bench"]',
  '["10000000-0001-0000-0000-000000000008"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 8. Press declinado con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'chest',
  'dumbbell',
  'compound',
  '["shoulders_front", "triceps"]',
  '["dumbbell", "bench"]',
  '["10000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 9. Aperturas con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'chest',
  'dumbbell',
  'isolation',
  '["shoulders_front"]',
  '["dumbbell", "bench"]',
  '["10000000-0001-0000-0000-000000000010", "10000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 10. Cruces en polea (Cable Crossover)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'chest',
  'cable',
  'isolation',
  '["shoulders_front"]',
  '["cable"]',
  '["10000000-0001-0000-0000-000000000009", "10000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 11. Pec Deck (Máquina de aperturas)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'chest',
  'machine',
  'isolation',
  '["shoulders_front"]',
  '["machine"]',
  '["10000000-0001-0000-0000-000000000009", "10000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 12. Flexiones (Push-ups)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps", "abs"]',
  '["bodyweight"]',
  '["10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  true
);

-- 13. Flexiones inclinadas (manos elevadas)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps", "abs"]',
  '["bodyweight", "bench"]',
  '["10000000-0001-0000-0000-000000000012", "10000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- 14. Flexiones declinadas (pies elevados)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps", "abs"]',
  '["bodyweight", "bench"]',
  '["10000000-0001-0000-0000-000000000012", "10000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

-- 15. Fondos en paralelas (Dips para pecho)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'chest',
  'dip_bars',
  'compound',
  '["shoulders_front", "triceps"]',
  '["dip_bars"]',
  '["10000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

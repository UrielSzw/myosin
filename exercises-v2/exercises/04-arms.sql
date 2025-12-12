-- =============================================
-- ARM EXERCISES (18 exercises)
-- =============================================
-- main_muscle_group: biceps, triceps, forearms
-- secondary_muscle_groups: shoulders_front, chest
-- =============================================

-- ==================== BICEPS (9 exercises) ====================

-- 1. Curl con barra recta
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'biceps',
  'barbell',
  'isolation',
  '["forearms"]',
  '["barbell"]',
  '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 2. Curl con barra Z
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'biceps',
  'ez_bar',
  'isolation',
  '["forearms"]',
  '["ez_bar"]',
  '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 3. Curl con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'biceps',
  'dumbbell',
  'isolation',
  '["forearms"]',
  '["dumbbell"]',
  '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000004"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 4. Curl martillo
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'biceps',
  'dumbbell',
  'isolation',
  '["forearms"]',
  '["dumbbell"]',
  '["50000000-0001-0000-0000-000000000003", "50000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 5. Curl concentrado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'biceps',
  'dumbbell',
  'isolation',
  '["forearms"]',
  '["dumbbell"]',
  '["50000000-0001-0000-0000-000000000003", "50000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'pull',
  false
);

-- 6. Curl en banco Scott (Preacher Curl)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'biceps',
  'ez_bar',
  'isolation',
  '["forearms"]',
  '["ez_bar", "bench"]',
  '["50000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- 7. Curl en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'biceps',
  'machine',
  'isolation',
  '["forearms"]',
  '["machine"]',
  '["50000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 8. Curl en polea baja
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'biceps',
  'cable',
  'isolation',
  '["forearms"]',
  '["cable"]',
  '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 9. Curl inclinado con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '50000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'biceps',
  'dumbbell',
  'isolation',
  '["forearms"]',
  '["dumbbell", "bench"]',
  '["50000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  false
);

-- ==================== TRICEPS (9 exercises) ====================

-- 10. Press francés con barra Z
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'triceps',
  'ez_bar',
  'isolation',
  '[]',
  '["ez_bar", "bench"]',
  '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 11. Extensión de tríceps con mancuerna (overhead)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'triceps',
  'dumbbell',
  'isolation',
  '[]',
  '["dumbbell"]',
  '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 12. Extensión de tríceps en polea alta
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'triceps',
  'cable',
  'isolation',
  '[]',
  '["cable"]',
  '["30000000-0001-0000-0000-000000000004"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 13. Extensión de tríceps con cuerda
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'triceps',
  'cable',
  'isolation',
  '[]',
  '["cable"]',
  '["30000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 14. Fondos en paralelas (Dips)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'triceps',
  'dip_bars',
  'compound',
  '["chest", "shoulders_front"]',
  '["dip_bars"]',
  '["30000000-0001-0000-0000-000000000006", "10000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

-- 15. Fondos en máquina asistida
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'triceps',
  'machine',
  'compound',
  '["chest", "shoulders_front"]',
  '["machine"]',
  '["30000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 16. Patada de tríceps (Kickback)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'triceps',
  'dumbbell',
  'isolation',
  '[]',
  '["dumbbell"]',
  '["30000000-0001-0000-0000-000000000008"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'push',
  false
);

-- 17. Patada de tríceps en polea
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'triceps',
  'cable',
  'isolation',
  '[]',
  '["cable"]',
  '["30000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'push',
  false
);

-- 18. Press cerrado con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '30000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'triceps',
  'barbell',
  'compound',
  '["chest", "shoulders_front"]',
  '["barbell", "bench"]',
  '["10000000-0001-0000-0000-000000000001"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- =============================================
-- LEG EXERCISES (27 exercises)
-- =============================================
-- main_muscle_group: quads, hamstrings, glutes, calves
-- secondary_muscle_groups: core, lower_back
-- =============================================

-- ==================== QUADS (9 exercises) ====================

-- 1. Sentadilla con barra (Back Squat)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'quads',
  'barbell',
  'compound',
  '["glutes", "hamstrings", "lower_back", "core"]',
  '["barbell", "squat_rack"]',
  '["70000000-0001-0000-0000-000000000002", "70000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'squat',
  true
);

-- 2. Sentadilla frontal
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'quads',
  'barbell',
  'compound',
  '["glutes", "core"]',
  '["barbell", "squat_rack"]',
  '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'squat',
  true
);

-- 3. Sentadilla en máquina Smith
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'quads',
  'smith_machine',
  'compound',
  '["glutes", "hamstrings"]',
  '["smith_machine"]',
  '["70000000-0001-0000-0000-000000000001"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'squat',
  true
);

-- 4. Sentadilla Hack
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'quads',
  'machine',
  'compound',
  '["glutes"]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'squat',
  false
);

-- 5. Prensa de piernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'quads',
  'machine',
  'compound',
  '["glutes", "hamstrings"]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000004"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'squat',
  false
);

-- 6. Extensión de cuádriceps
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'quads',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  NULL,
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 7. Zancadas con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'quads',
  'dumbbell',
  'compound',
  '["glutes", "hamstrings", "core"]',
  '["dumbbell"]',
  '["70000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  true,
  'lunge',
  true
);

-- 8. Zancadas con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'quads',
  'barbell',
  'compound',
  '["glutes", "hamstrings", "core"]',
  '["barbell"]',
  '["70000000-0001-0000-0000-000000000007", "70000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  true,
  'lunge',
  true
);

-- 9. Sentadilla búlgara
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'quads',
  'dumbbell',
  'compound',
  '["glutes", "hamstrings", "core"]',
  '["dumbbell", "bench"]',
  '["70000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  true,
  'lunge',
  true
);

-- ==================== HAMSTRINGS (6 exercises) ====================

-- 10. Peso muerto rumano
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'hamstrings',
  'barbell',
  'compound',
  '["glutes", "lower_back"]',
  '["barbell"]',
  '["70000000-0001-0000-0000-000000000011", "80000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  false
);

-- 11. Peso muerto rumano con mancuernas
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'hamstrings',
  'dumbbell',
  'compound',
  '["glutes", "lower_back"]',
  '["dumbbell"]',
  '["70000000-0001-0000-0000-000000000010", "70000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'hinge',
  false
);

-- 12. Peso muerto rumano a una pierna
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'hamstrings',
  'dumbbell',
  'compound',
  '["glutes", "lower_back", "core"]',
  '["dumbbell"]',
  '["70000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  true,
  'hinge',
  false
);

-- 13. Curl femoral acostado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'hamstrings',
  'machine',
  'isolation',
  '["calves"]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000014"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 14. Curl femoral sentado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'hamstrings',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  false
);

-- 15. Buenos días (Good Mornings)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'hamstrings',
  'barbell',
  'compound',
  '["glutes", "lower_back"]',
  '["barbell"]',
  '["70000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  false
);

-- ==================== GLUTES (6 exercises) ====================

-- 16. Hip Thrust con barra
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000016'::uuid,
  'system',
  NULL,
  'glutes',
  'barbell',
  'compound',
  '["hamstrings", "core"]',
  '["barbell", "bench"]',
  '["70000000-0001-0000-0000-000000000017", "70000000-0001-0000-0000-000000000018"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'hinge',
  false
);

-- 17. Hip Thrust en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000017'::uuid,
  'system',
  NULL,
  'glutes',
  'machine',
  'compound',
  '["hamstrings"]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'hinge',
  false
);

-- 18. Puente de glúteos
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000018'::uuid,
  'system',
  NULL,
  'glutes',
  'bodyweight',
  'isolation',
  '["hamstrings", "core"]',
  '["bodyweight"]',
  '["70000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'hinge',
  true
);

-- 19. Patada de glúteo en polea
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000019'::uuid,
  'system',
  NULL,
  'glutes',
  'cable',
  'isolation',
  '["hamstrings"]',
  '["cable"]',
  '["70000000-0001-0000-0000-000000000020"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'hinge',
  false
);

-- 20. Patada de glúteo en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000020'::uuid,
  'system',
  NULL,
  'glutes',
  'machine',
  'isolation',
  '["hamstrings"]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000019"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'hinge',
  false
);

-- 21. Abducción de cadera en máquina
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000021'::uuid,
  'system',
  NULL,
  'glutes',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  NULL,
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- ==================== CALVES (6 exercises) ====================

-- 22. Elevación de talones de pie
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000022'::uuid,
  'system',
  NULL,
  'calves',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000023", "70000000-0001-0000-0000-000000000024"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- 23. Elevación de talones sentado
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000023'::uuid,
  'system',
  NULL,
  'calves',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000022"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 24. Elevación de talones en prensa
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000024'::uuid,
  'system',
  NULL,
  'calves',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000022"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  false
);

-- 25. Elevación de talones con mancuerna
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000025'::uuid,
  'system',
  NULL,
  'calves',
  'dumbbell',
  'isolation',
  '[]',
  '["dumbbell"]',
  '["70000000-0001-0000-0000-000000000022"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  true,
  'push',
  true
);

-- 26. Elevación de talones en Smith
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000026'::uuid,
  'system',
  NULL,
  'calves',
  'smith_machine',
  'isolation',
  '[]',
  '["smith_machine"]',
  '["70000000-0001-0000-0000-000000000022"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- 27. Elevación de talones en burro
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '70000000-0001-0000-0000-000000000027'::uuid,
  'system',
  NULL,
  'calves',
  'machine',
  'isolation',
  '[]',
  '["machine"]',
  '["70000000-0001-0000-0000-000000000022"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- =============================================
-- CALISTHENICS PROGRESSION EXERCISES (50 exercises)
-- =============================================
-- Exercises specifically for bodyweight skill progressions
-- UUID prefix: 90000000-0001-0000-0000-00000000XXXX
-- =============================================

-- ==================== PULL-UP PROGRESSION (8 exercises) ====================

-- 1. Scapular Pulls (Dead Hang + Scapular Retraction)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000001'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  true
);

-- 2. Arch Hangs (Active Hang with Arched Position)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000002'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "shoulders_rear"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000001", "90000000-0001-0000-0000-000000000003"]',
  'time_only',
  NULL,
  NULL,
  1,
  false,
  'pull',
  true
);

-- 3. Negative Pull-ups (Eccentric Only)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000003'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["pull_up_bar"]',
  '["40000000-0001-0000-0000-000000000001", "90000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  true
);

-- 4. Weighted Pull-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000004'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["pull_up_bar"]',
  '["40000000-0001-0000-0000-000000000001"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  true
);

-- 5. L-sit Pull-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000005'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "abs", "hip_flexors"]',
  '["pull_up_bar"]',
  '["40000000-0001-0000-0000-000000000001", "90000000-0001-0000-0000-000000000006"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  true
);

-- 6. Archer Pull-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000006'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000005", "90000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  true,
  'pull',
  true
);

-- 7. Typewriter Pull-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000007'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000006", "90000000-0001-0000-0000-000000000008"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  true
);

-- 8. One Arm Pull-up
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000008'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms", "abs"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000007"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  true,
  'pull',
  true
);

-- ==================== MUSCLE-UP PROGRESSION (4 exercises) ====================

-- 9. High Pull-ups (Chest to Bar)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000009'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["pull_up_bar"]',
  '["40000000-0001-0000-0000-000000000001", "90000000-0001-0000-0000-000000000010"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'pull',
  true
);

-- 10. False Grip Pull-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000010'::uuid,
  'system',
  NULL,
  'lats',
  'rings',
  'compound',
  '["upper_back", "biceps", "forearms"]',
  '["rings"]',
  '["90000000-0001-0000-0000-000000000009", "90000000-0001-0000-0000-000000000011"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'pull',
  true
);

-- 11. Muscle-up Negative
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000011'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "triceps", "chest"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000010", "90000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  true
);

-- 12. Muscle-up (Bar)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000012'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "biceps", "triceps", "chest", "shoulders_front"]',
  '["pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000011", "90000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  true
);

-- 13. Ring Muscle-up
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000013'::uuid,
  'system',
  NULL,
  'lats',
  'rings',
  'compound',
  '["upper_back", "biceps", "triceps", "chest", "shoulders_front"]',
  '["rings"]',
  '["90000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  true
);

-- ==================== ROW/FRONT LEVER PROGRESSION (7 exercises) ====================

-- 14. Incline Inverted Row
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000014'::uuid,
  'system',
  NULL,
  'upper_back',
  'bodyweight',
  'compound',
  '["lats", "biceps", "forearms"]',
  '["bodyweight", "smith_machine"]',
  '["40000000-0001-0000-0000-000000000018", "90000000-0001-0000-0000-000000000015"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'pull',
  true
);

-- 15. Wide Grip Inverted Row
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000015'::uuid,
  'system',
  NULL,
  'upper_back',
  'bodyweight',
  'compound',
  '["lats", "biceps", "shoulders_rear"]',
  '["bodyweight", "smith_machine"]',
  '["40000000-0001-0000-0000-000000000018", "90000000-0001-0000-0000-000000000016"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  true
);

-- 16. Tuck Front Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000016'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "abs", "biceps"]',
  '["pull_up_bar", "rings"]',
  '["90000000-0001-0000-0000-000000000017"]',
  'time_only',
  NULL,
  NULL,
  3,
  false,
  'isometric',
  true
);

-- 17. Advanced Tuck Front Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000017'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "abs", "biceps"]',
  '["pull_up_bar", "rings"]',
  '["90000000-0001-0000-0000-000000000016", "90000000-0001-0000-0000-000000000018"]',
  'time_only',
  NULL,
  NULL,
  4,
  false,
  'isometric',
  true
);

-- 18. Straddle Front Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000018'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "abs", "biceps"]',
  '["pull_up_bar", "rings"]',
  '["90000000-0001-0000-0000-000000000017", "90000000-0001-0000-0000-000000000019"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);

-- 19. Full Front Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000019'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "abs", "biceps", "lower_back"]',
  '["pull_up_bar", "rings"]',
  '["90000000-0001-0000-0000-000000000018", "90000000-0001-0000-0000-000000000020"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);

-- 20. Front Lever Rows
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000020'::uuid,
  'system',
  NULL,
  'lats',
  'pull_up_bar',
  'compound',
  '["upper_back", "abs", "biceps"]',
  '["pull_up_bar", "rings"]',
  '["90000000-0001-0000-0000-000000000019"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  true
);

-- ==================== DIP PROGRESSION (5 exercises) ====================

-- 21. Parallel Bar Support Hold
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000021'::uuid,
  'system',
  NULL,
  'triceps',
  'dip_bars',
  'compound',
  '["chest", "shoulders_front"]',
  '["dip_bars"]',
  '["90000000-0001-0000-0000-000000000022"]',
  'time_only',
  NULL,
  NULL,
  1,
  false,
  'isometric',
  true
);

-- 22. Negative Dips
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000022'::uuid,
  'system',
  NULL,
  'triceps',
  'dip_bars',
  'compound',
  '["chest", "shoulders_front"]',
  '["dip_bars"]',
  '["90000000-0001-0000-0000-000000000021", "30000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  true
);

-- 23. Weighted Dips
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000023'::uuid,
  'system',
  NULL,
  'triceps',
  'dip_bars',
  'compound',
  '["chest", "shoulders_front"]',
  '["dip_bars"]',
  '["30000000-0001-0000-0000-000000000005"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  true
);

-- 24. Ring Dips
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000024'::uuid,
  'system',
  NULL,
  'triceps',
  'rings',
  'compound',
  '["chest", "shoulders_front", "abs"]',
  '["rings"]',
  '["30000000-0001-0000-0000-000000000005", "90000000-0001-0000-0000-000000000025"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  true
);

-- 25. Ring Support Hold (RTO)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000025'::uuid,
  'system',
  NULL,
  'triceps',
  'rings',
  'compound',
  '["chest", "shoulders_front", "biceps"]',
  '["rings"]',
  '["90000000-0001-0000-0000-000000000024"]',
  'time_only',
  NULL,
  NULL,
  3,
  false,
  'isometric',
  true
);

-- ==================== PUSH-UP PROGRESSION (8 exercises) ====================

-- 26. Wall Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000026'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000027", "10000000-0001-0000-0000-000000000013"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- 27. Knee Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000027'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000026", "10000000-0001-0000-0000-000000000012"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'push',
  true
);

-- 28. Diamond Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000028'::uuid,
  'system',
  NULL,
  'triceps',
  'bodyweight',
  'compound',
  '["chest", "shoulders_front"]',
  '["bodyweight"]',
  '["10000000-0001-0000-0000-000000000012", "90000000-0001-0000-0000-000000000029"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

-- 29. Archer Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000029'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000028", "90000000-0001-0000-0000-000000000030"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  true,
  'push',
  true
);

-- 30. Pseudo Planche Push-ups (PPPU)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000030'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps", "abs"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000029", "90000000-0001-0000-0000-000000000031"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  true
);

-- 31. Ring Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000031'::uuid,
  'system',
  NULL,
  'chest',
  'rings',
  'compound',
  '["shoulders_front", "triceps", "abs"]',
  '["rings"]',
  '["10000000-0001-0000-0000-000000000012", "90000000-0001-0000-0000-000000000032"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

-- 32. RTO Push-ups (Rings Turned Out)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000032'::uuid,
  'system',
  NULL,
  'chest',
  'rings',
  'compound',
  '["shoulders_front", "triceps", "abs", "biceps"]',
  '["rings"]',
  '["90000000-0001-0000-0000-000000000031"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  true
);

-- 33. One Arm Push-up
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000033'::uuid,
  'system',
  NULL,
  'chest',
  'bodyweight',
  'compound',
  '["shoulders_front", "triceps", "abs", "obliques"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000029"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  true,
  'push',
  true
);

-- ==================== HSPU PROGRESSION (5 exercises) ====================

-- 34. Pike Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000034'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "upper_back"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000035"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  true
);

-- 35. Elevated Pike Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000035'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "upper_back"]',
  '["bodyweight", "bench"]',
  '["90000000-0001-0000-0000-000000000034", "90000000-0001-0000-0000-000000000036"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'push',
  true
);

-- 36. Wall Handstand
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000036'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "upper_back"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000035", "90000000-0001-0000-0000-000000000037"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  true
);

-- 37. Wall Handstand Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000037'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "upper_back"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000036", "90000000-0001-0000-0000-000000000038"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'push',
  true
);

-- 38. Freestanding Handstand Push-ups
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000038'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "upper_back", "abs"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000037"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'push',
  true
);

-- ==================== PLANCHE PROGRESSION (5 exercises) ====================

-- 39. Frog Stand
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000039'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "chest"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000040"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  true
);

-- 40. Tuck Planche
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000040'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "chest"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000039", "90000000-0001-0000-0000-000000000041"]',
  'time_only',
  NULL,
  NULL,
  4,
  false,
  'isometric',
  true
);

-- 41. Advanced Tuck Planche
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000041'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "chest"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000040", "90000000-0001-0000-0000-000000000042"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);

-- 42. Straddle Planche
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000042'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "chest", "lower_back"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000041", "90000000-0001-0000-0000-000000000043"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);

-- 43. Full Planche
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000043'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'bodyweight',
  'compound',
  '["triceps", "abs", "chest", "lower_back"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000042"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);

-- ==================== SQUAT PROGRESSION (6 exercises) ====================

-- 44. Bodyweight Squat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000044'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings"]',
  '["bodyweight"]',
  '["70000000-0001-0000-0000-000000000001", "90000000-0001-0000-0000-000000000045"]',
  'weight_reps',
  NULL,
  NULL,
  1,
  false,
  'squat',
  true
);

-- 45. Split Squat (Static Lunge)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000045'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000044", "70000000-0001-0000-0000-000000000009"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  true,
  'lunge',
  true
);

-- 46. Assisted Pistol Squat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000046'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings", "abs"]',
  '["bodyweight", "suspension_trainer"]',
  '["90000000-0001-0000-0000-000000000047"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  true,
  'squat',
  true
);

-- 47. Pistol Squat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000047'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings", "abs", "hip_flexors"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000046", "90000000-0001-0000-0000-000000000048"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  true,
  'squat',
  true
);

-- 48. Beginner Shrimp Squat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000048'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000047", "90000000-0001-0000-0000-000000000049"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  true,
  'squat',
  true
);

-- 49. Advanced Shrimp Squat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000049'::uuid,
  'system',
  NULL,
  'quads',
  'bodyweight',
  'compound',
  '["glutes", "hamstrings"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000048"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  true,
  'squat',
  true
);

-- ==================== HINGE PROGRESSION (3 exercises) ====================

-- 50. Nordic Curl Negative
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000050'::uuid,
  'system',
  NULL,
  'hamstrings',
  'bodyweight',
  'isolation',
  '["glutes", "calves"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000051"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  true
);

-- 51. Banded Nordic Curl
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000051'::uuid,
  'system',
  NULL,
  'hamstrings',
  'resistance_band',
  'isolation',
  '["glutes", "calves"]',
  '["resistance_band"]',
  '["90000000-0001-0000-0000-000000000050", "90000000-0001-0000-0000-000000000052"]',
  'weight_reps',
  NULL,
  NULL,
  3,
  false,
  'hinge',
  true
);

-- 52. Nordic Curl
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000052'::uuid,
  'system',
  NULL,
  'hamstrings',
  'bodyweight',
  'isolation',
  '["glutes", "calves"]',
  '["bodyweight"]',
  '["90000000-0001-0000-0000-000000000051"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'hinge',
  true
);

-- ==================== CORE/L-SIT PROGRESSION (6 exercises) ====================

-- 53. Foot Supported L-sit
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000053'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "triceps"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000054"]',
  'time_only',
  NULL,
  NULL,
  1,
  false,
  'isometric',
  false
);

-- 54. One Leg L-sit
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000054'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "triceps"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000053", "90000000-0001-0000-0000-000000000055"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  false
);

-- 55. Tuck L-sit
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000055'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "triceps"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000054", "90000000-0001-0000-0000-000000000056"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  false
);

-- 56. L-sit
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000056'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "triceps", "quads"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000055", "90000000-0001-0000-0000-000000000057"]',
  'time_only',
  NULL,
  NULL,
  3,
  false,
  'isometric',
  false
);

-- 57. V-sit
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000057'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["hip_flexors", "triceps", "quads"]',
  '["bodyweight", "parallettes"]',
  '["90000000-0001-0000-0000-000000000056"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  false
);

-- 58. Dragon Flag (Tuck)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000058'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["obliques", "lower_back", "hip_flexors"]',
  '["bodyweight", "bench"]',
  '["90000000-0001-0000-0000-000000000059"]',
  'weight_reps',
  NULL,
  NULL,
  4,
  false,
  'pull',
  true
);

-- 59. Dragon Flag (Full)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000059'::uuid,
  'system',
  NULL,
  'abs',
  'bodyweight',
  'compound',
  '["obliques", "lower_back", "hip_flexors"]',
  '["bodyweight", "bench"]',
  '["90000000-0001-0000-0000-000000000058"]',
  'weight_reps',
  NULL,
  NULL,
  5,
  false,
  'pull',
  true
);

-- ==================== BACK LEVER PROGRESSION (4 exercises) ====================

-- 60. German Hang
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000060'::uuid,
  'system',
  NULL,
  'shoulders_front',
  'rings',
  'compound',
  '["chest", "biceps"]',
  '["rings", "pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000061"]',
  'time_only',
  NULL,
  NULL,
  2,
  false,
  'isometric',
  true
);

-- 61. Skin the Cat
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000061'::uuid,
  'system',
  NULL,
  'lats',
  'rings',
  'compound',
  '["shoulders_front", "abs", "biceps"]',
  '["rings", "pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000060", "90000000-0001-0000-0000-000000000062"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'pull',
  true
);

-- 62. Tuck Back Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000062'::uuid,
  'system',
  NULL,
  'lats',
  'rings',
  'compound',
  '["shoulders_front", "abs", "biceps", "chest"]',
  '["rings", "pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000061", "90000000-0001-0000-0000-000000000063"]',
  'time_only',
  NULL,
  NULL,
  3,
  false,
  'isometric',
  true
);

-- 63. Full Back Lever
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '90000000-0001-0000-0000-000000000063'::uuid,
  'system',
  NULL,
  'lats',
  'rings',
  'compound',
  '["shoulders_front", "abs", "biceps", "chest", "lower_back"]',
  '["rings", "pull_up_bar"]',
  '["90000000-0001-0000-0000-000000000062"]',
  'time_only',
  NULL,
  NULL,
  5,
  false,
  'isometric',
  true
);


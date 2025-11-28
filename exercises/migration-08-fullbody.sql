-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: CUERPO COMPLETO (exercisesFullBody)
-- ============================================================================
-- Ejecutar este script después de migration-07-legs.sql para migrar todos los ejercicios de cuerpo completo
-- NOTA: Los campos name e instructions están en exercise_translations

INSERT INTO exercises (
    id,
    source,
    created_by_user_id,
    main_muscle_group,
    primary_equipment,
    exercise_type,
    secondary_muscle_groups,
    equipment,
    similar_exercises,
    default_measurement_template
) VALUES 

-- Burpees
(
    '80000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["quads", "glutes", "chest_middle", "triceps", "rectus_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000012", "80000000-0001-0000-0000-000000000013", "80000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Swing con kettlebell
(
    '80000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'glutes',
    'kettlebell',
    'compound',
    '["hamstrings", "lower_back", "front_delts", "quads"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Thruster (sentadilla + press de hombros)
(
    '80000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000015", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Clean con barra
(
    '80000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "upper_traps", "forearms"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000008", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Snatch con barra
(
    '80000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "front_delts", "upper_traps"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000008", "80000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Remo renegado con mancuernas
(
    '80000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis", "obliques"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Clean & Press con mancuernas
(
    '80000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000003", "80000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Power Clean
(
    '80000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "upper_traps", "forearms"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000004", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Step-up con press
(
    '80000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Turkish Get-Up
(
    '80000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'full_body',
    'kettlebell',
    'compound',
    '["front_delts", "glutes", "rectus_abdominis", "quads"]'::jsonb,
    '["kettlebell", "bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000007", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Battle Ropes
(
    '80000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["front_delts", "lats"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Mountain Climbers
(
    '80000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["rectus_abdominis", "obliques", "quads", "hip_flexors"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Saltos al cajón (Box Jump)
(
    '80000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["quads", "glutes", "calves", "hamstrings"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Bear Crawl
(
    '80000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["front_delts", "obliques", "quads", "glutes"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000012", "80000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con press de hombros (full-body compound)
(
    '80000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Man Maker
(
    '80000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["chest_middle", "front_delts", "triceps", "quads", "glutes", "erector_spinae"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Devil Press
(
    '80000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["chest_middle", "front_delts", "triceps", "quads", "glutes"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000016", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Farmer's Walk
(
    '80000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["forearms", "upper_traps", "glutes", "erector_spinae"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000019", "80000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_distance'
),

-- Overhead Carry
(
    '80000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["front_delts", "triceps", "glutes"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000018", "80000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_distance'
),

-- Sprint en cinta o trineo
(
    '80000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'quads',
    'other',
    'compound',
    '["hamstrings", "glutes", "calves"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000014", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
),

-- Slam con balón medicinal
(
    '80000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'full_body',
    'medicine_ball',
    'compound',
    '["rectus_abdominis", "front_delts", "glutes"]'::jsonb,
    '["medicine_ball"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000022"]'::jsonb,
    'weight_reps'
),

-- Wall Ball
(
    '80000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'full_body',
    'medicine_ball',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["medicine_ball"]'::jsonb,
    '["80000000-0001-0000-0000-000000000021", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps_range'
),

-- Jump Rope
(
    '80000000-0001-0000-0000-000000000023'::uuid,
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["calves", "forearms", "quads"]'::jsonb,
    '["bodyweight", "other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000020"]'::jsonb,
    'distance_time'
),

-- Ski Erg o simulador de esquí
(
    '80000000-0001-0000-0000-000000000024'::uuid,
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["lats", "front_delts", "glutes", "erector_spinae"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000025", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
),

-- Assault Bike o Air Bike
(
    '80000000-0001-0000-0000-000000000025'::uuid,
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["quads", "hamstrings", "glutes"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000020", "80000000-0001-0000-0000-000000000024", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_fullbody 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('full_body', 'glutes', 'lats', 'quads');

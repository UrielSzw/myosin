-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: ESPALDA (exercisesBack)
-- ============================================================================
-- Ejecutar este script después de migration-03-triceps.sql para migrar todos los ejercicios de espalda
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

-- Dominadas
(
    '40000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["biceps", "rear_delts", "rhomboids", "mid_traps"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Jalón al pecho en polea
(
    '40000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["biceps", "rear_delts", "rhomboids", "mid_traps"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Jalón tras nuca (avanzado)
(
    '40000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["rear_delts", "upper_traps", "rhomboids"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Remo con barra
(
    '40000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps", "lower_back"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con mancuernas
(
    '40000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["rhomboids", "rear_delts", "biceps", "mid_traps"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo en máquina
(
    '40000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'lats',
    'seated_row_machine',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Remo con polea baja
(
    '40000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'lats',
    'cable_machine',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Peso muerto convencional
(
    '40000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["hamstrings", "erector_spinae", "lower_back", "lats", "forearms"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Peso muerto con piernas rígidas
(
    '40000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Pull-over con mancuerna o cable
(
    '40000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["chest_lower", "serratus_anterior"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Remo en T (T-Bar Row)
(
    '40000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Face Pull (para trapecios y deltoide posterior)
(
    '40000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'rear_delts',
    'cable_machine',
    'isolation',
    '["rhomboids", "mid_traps", "rotator_cuff"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000011", "40000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Encogimientos de hombros con mancuernas
(
    '40000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'upper_traps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Remo con banda elástica
(
    '40000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'lats',
    'resistance_band',
    'compound',
    '["rhomboids", "mid_traps", "biceps"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Superman (para lumbar)
(
    '40000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["40000000-0001-0000-0000-000000000027", "40000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Buenos días con barra
(
    '40000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'erector_spinae',
    'barbell',
    'compound',
    '["hamstrings", "glutes", "lower_back"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Dominadas supinas
(
    '40000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["biceps", "rhomboids"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Dominadas neutras
(
    '40000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000021", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Jalón con agarre cerrado
(
    '40000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Jalón con agarre supino
(
    '40000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["biceps", "rhomboids"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Remo invertido
(
    '40000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'rhomboids',
    'bodyweight',
    'compound',
    '["mid_traps", "biceps"]'::jsonb,
    '["bodyweight", "pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000022", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Remo con TRX
(
    '40000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'rhomboids',
    'suspension_trainer',
    'compound',
    '["biceps", "mid_traps"]'::jsonb,
    '["suspension_trainer"]'::jsonb,
    '["40000000-0001-0000-0000-000000000021", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Remo en máquina Hammer Strength
(
    '40000000-0001-0000-0000-000000000023'::uuid,
    'system',
    null,
    'lats',
    'seated_row_machine',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con agarre supino
(
    '40000000-0001-0000-0000-000000000024'::uuid,
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000025"]'::jsonb,
    'weight_reps'
),

-- Remo Kroc
(
    '40000000-0001-0000-0000-000000000025'::uuid,
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con kettlebell
(
    '40000000-0001-0000-0000-000000000026'::uuid,
    'system',
    null,
    'lats',
    'kettlebell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Superman hold
(
    '40000000-0001-0000-0000-000000000027'::uuid,
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["lower_back", "glutes"]'::jsonb,
    '["bodyweight", "stability_ball"]'::jsonb,
    '[]'::jsonb,
    'time_only'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_espalda 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('lats', 'rhomboids', 'mid_traps', 'upper_traps', 'erector_spinae', 'glutes', 'hamstrings', 'rear_delts', 'lower_back');

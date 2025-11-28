-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: HOMBROS (exercisesShoulders)
-- ============================================================================
-- Ejecutar este script después de migration-01-chest.sql para migrar todos los ejercicios de hombros
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

-- Press militar con barra
(
    '20000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000011", "20000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Press militar con mancuernas
(
    '20000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press Arnold
(
    '20000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales con mancuernas
(
    '20000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'side_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000006", "20000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Elevaciones frontales con mancuernas
(
    '20000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'front_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000005", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales con polea
(
    '20000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'side_delts',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000004", "20000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Remo al mentón con barra
(
    '20000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'side_delts',
    'barbell',
    'compound',
    '["front_delts", "upper_traps"]'::jsonb,
    '["barbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000007", "20000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Remo al mentón con polea
(
    '20000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'side_delts',
    'cable_machine',
    'compound',
    '["front_delts", "upper_traps"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000009", "20000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones posteriores (pájaros) con mancuernas
(
    '20000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'rear_delts',
    'dumbbell',
    'isolation',
    '["mid_traps", "rhomboids"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Face Pull con polea
(
    '20000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'rear_delts',
    'cable_machine',
    'isolation',
    '["rhomboids", "mid_traps"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Press de hombros en máquina
(
    '20000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'front_delts',
    'shoulder_press_machine',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["shoulder_press_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Plancha con empuje escapular
(
    '20000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'serratus_anterior',
    'bodyweight',
    'isolation',
    '["rectus_abdominis", "front_delts"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Push press con barra
(
    '20000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["triceps", "side_delts", "upper_traps"]'::jsonb,
    '["barbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Press militar tras nuca
(
    '20000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["triceps", "side_delts", "upper_traps"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con kettlebell
(
    '20000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'front_delts',
    'kettlebell',
    'compound',
    '["triceps", "side_delts"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000013"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales en máquina
(
    '20000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'side_delts',
    'shoulder_press_machine',
    'isolation',
    '["front_delts"]'::jsonb,
    '["shoulder_press_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000018", "20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Elevaciones frontales con disco
(
    '20000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'front_delts',
    'weight_plate',
    'isolation',
    '["side_delts", "upper_traps"]'::jsonb,
    '["weight_plate"]'::jsonb,
    '["20000000-0001-0000-0000-000000000022", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales tumbado
(
    '20000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'side_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000016", "20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Face pull con banda
(
    '20000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'rear_delts',
    'resistance_band',
    'isolation',
    '["rhomboids", "rotator_cuff"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Press con banda elástica
(
    '20000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'front_delts',
    'resistance_band',
    'compound',
    '["triceps", "chest_upper"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["20000000-0001-0000-0000-000000000022", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones Y-T-W
(
    '20000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'rear_delts',
    'bodyweight',
    'isolation',
    '["rhomboids", "mid_traps", "rotator_cuff"]'::jsonb,
    '["bodyweight", "incline_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000019", "20000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press de hombros alternado
(
    '20000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["triceps", "side_delts"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_hombros 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('front_delts', 'side_delts', 'rear_delts', 'serratus_anterior');

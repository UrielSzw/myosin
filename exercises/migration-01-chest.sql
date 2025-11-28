-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: PECHO (exercisesChest)
-- ============================================================================
-- Ejecutar este script primero para migrar todos los ejercicios de pecho
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

-- Press de banca con barra
(
    '10000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'chest_middle',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Press de banca con mancuernas
(
    '10000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'chest_middle',
    'dumbbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con barra
(
    '10000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'chest_upper',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["barbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000004", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con mancuernas
(
    '10000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'chest_upper',
    'dumbbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Press declinado con barra
(
    '10000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'chest_lower',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["barbell", "decline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000010", "10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Aperturas con mancuernas en banco plano
(
    '10000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'chest_middle',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000007", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Aperturas con mancuernas en banco inclinado
(
    '10000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'chest_upper',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000006", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Aperturas en máquina o contractor
(
    '10000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'chest_middle',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000006", "10000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Cruce de poleas (cable crossover)
(
    '10000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'chest_middle',
    'cable_machine',
    'isolation',
    '["chest_upper", "chest_lower"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000011", "10000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Fondos en paralelas (enfocado en pecho)
(
    '10000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'chest_lower',
    'parallel_bars',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Flexiones de brazos (push-ups)
(
    '10000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'chest_middle',
    'bodyweight',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Flexiones declinadas
(
    '10000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'chest_upper',
    'bodyweight',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Press en máquina de pecho
(
    '10000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'chest_middle',
    'chest_press_machine',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Press en máquina Smith
(
    '10000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'chest_middle',
    'smith_machine',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["smith_machine", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con banda elástica
(
    '10000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'chest_middle',
    'resistance_band',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press de banca con agarre cerrado
(
    '10000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'triceps',
    'barbell',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con agarre cerrado
(
    '10000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'chest_upper',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["barbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004", "10000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press en suelo (Floor Press)
(
    '10000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'chest_middle',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["barbell"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000014", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con kettlebell
(
    '10000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'chest_middle',
    'kettlebell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["kettlebell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_pecho 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('chest_middle', 'chest_upper', 'chest_lower', 'triceps');
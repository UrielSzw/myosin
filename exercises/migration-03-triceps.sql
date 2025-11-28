-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: TRÍCEPS (exercisesTriceps)
-- ============================================================================
-- Ejecutar este script después de migration-02-shoulders.sql para migrar todos los ejercicios de tríceps
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

-- Fondos en paralelas (tríceps)
(
    '30000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'triceps',
    'parallel_bars',
    'compound',
    '["chest_lower", "front_delts"]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["30000000-0001-0000-0000-000000000008", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea (barra o cuerda)
(
    '30000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Press francés con barra EZ
(
    '30000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'isolation',
    '[]'::jsonb,
    '["ez_curl_bar", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Press francés con mancuernas
(
    '30000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps por encima de la cabeza con mancuerna
(
    '30000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con cuerda en polea alta
(
    '30000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Patada de tríceps con mancuerna (kickback)
(
    '30000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '["rear_delts"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000005", "30000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Flexiones cerradas (manos juntas)
(
    '30000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en máquina
(
    '30000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'triceps',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con banda elástica
(
    '30000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'triceps',
    'resistance_band',
    'isolation',
    '["forearms"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en banco (bench dips)
(
    '30000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["front_delts", "chest_lower"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea inversa (agarre supino)
(
    '30000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine", "ez_curl_bar"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Press cerrado con barra EZ
(
    '30000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["ez_curl_bar", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con kettlebell
(
    '30000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'triceps',
    'kettlebell',
    'isolation',
    '[]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con banda en suelo
(
    '30000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'triceps',
    'resistance_band',
    'isolation',
    '[]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["30000000-0001-0000-0000-000000000014", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Flexiones diamante
(
    '30000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea a una mano
(
    '30000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Press francés en banco inclinado
(
    '30000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'isolation',
    '["front_delts"]'::jsonb,
    '["ez_curl_bar", "incline_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps tumbado en polea baja
(
    '30000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["cable_machine", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en máquina de empuje vertical
(
    '30000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'triceps',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_triceps 
FROM exercises 
WHERE source = 'system' AND main_muscle_group = 'triceps';

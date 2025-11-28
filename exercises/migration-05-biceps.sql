-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: BÍCEPS (exercisesBiceps)
-- ============================================================================
-- Ejecutar este script después de migration-04-back.sql para migrar todos los ejercicios de bíceps
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

-- Curl de bíceps con barra
(
    '50000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'biceps',
    'barbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["barbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl de bíceps con mancuernas
(
    '50000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000004", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl alternado con supinación
(
    '50000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl tipo martillo
(
    '50000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl en banco predicador (Scott)
(
    '50000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'biceps',
    'ez_curl_bar',
    'isolation',
    '["forearms"]'::jsonb,
    '["ez_curl_bar", "preacher_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000005", "50000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Curl en polea baja
(
    '50000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl con banda elástica
(
    '50000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'biceps',
    'resistance_band',
    'isolation',
    '["forearms"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl concentrado
(
    '50000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl en máquina
(
    '50000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'biceps',
    'seated_row_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Curl inverso (para antebrazos)
(
    '50000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'forearms',
    'ez_curl_bar',
    'isolation',
    '["biceps"]'::jsonb,
    '["ez_curl_bar"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl de muñeca con barra (flexión de antebrazos)
(
    '50000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'forearms',
    'barbell',
    'isolation',
    '[]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Curl de muñeca inverso (extensión)
(
    '50000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'forearms',
    'barbell',
    'isolation',
    '[]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Curl con cable en polea alta
(
    '50000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl tipo drag (arrastrado con barra)
(
    '50000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'biceps',
    'barbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl en predicador con mancuerna
(
    '50000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "preacher_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl con kettlebell
(
    '50000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'biceps',
    'kettlebell',
    'isolation',
    '["forearms"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl a un brazo en polea baja
(
    '50000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000007", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl con banda en suelo
(
    '50000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'biceps',
    'resistance_band',
    'isolation',
    '[]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl Zottman (supinación + pronación)
(
    '50000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Curl de concentración con apoyo en muslo
(
    '50000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl isométrico (sosteniendo mitad del recorrido)
(
    '50000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000022", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_time'
),

-- Curl en TRX o suspensión
(
    '50000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'biceps',
    'suspension_trainer',
    'isolation',
    '["forearms"]'::jsonb,
    '["suspension_trainer"]'::jsonb,
    '["50000000-0001-0000-0000-000000000023", "50000000-0001-0000-0000-000000000013"]'::jsonb,
    'weight_reps'
),

-- Curl inclinado con mancuernas
(
    '50000000-0001-0000-0000-000000000023'::uuid,
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_biceps 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('biceps', 'forearms');

-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: CORE/ABDOMINALES (exercisesCore)
-- ============================================================================
-- Ejecutar este script después de migration-05-biceps.sql para migrar todos los ejercicios de core/abdominales
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

-- Crunch abdominal clásico
(
    '60000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000002", "60000000-0001-0000-0000-000000000003", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Crunch en máquina
(
    '60000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'seated_row_machine',
    'isolation',
    '[]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Crunch en polea alta
(
    '60000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Crunch inverso
(
    '60000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Plancha frontal
(
    '60000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "obliques", "lower_back"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Plancha lateral
(
    '60000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'obliques',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "rectus_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000007", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Giros rusos (Russian twist)
(
    '60000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'obliques',
    'medicine_ball',
    'isolation',
    '["rectus_abdominis", "transverse_abdominis"]'::jsonb,
    '["medicine_ball", "bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000006", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de piernas colgado
(
    '60000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'pull_up_bar',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["60000000-0001-0000-0000-000000000009", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de rodillas colgado
(
    '60000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'pull_up_bar',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Ab wheel (rueda abdominal)
(
    '60000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'ab_wheel',
    'isolation',
    '["obliques", "lower_back"]'::jsonb,
    '["ab_wheel"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión lumbar en banco romano
(
    '60000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000012", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Superman
(
    '60000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000011", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Peso muerto rumano
(
    '60000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["40000000-0001-0000-0000-000000000009", "40000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Bird-Dog
(
    '60000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "rectus_abdominis", "hip_flexors"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000015", "60000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Dead Bug
(
    '60000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "hip_flexors"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Crunch en banco declinado
(
    '60000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'decline_bench',
    'isolation',
    '[]'::jsonb,
    '["decline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Crunch con piernas elevadas
(
    '60000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000004", "60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Crunch con kettlebell
(
    '60000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'kettlebell',
    'isolation',
    '[]'::jsonb,
    '["kettlebell", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Plancha con toques de hombros
(
    '60000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "transverse_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000020"]'::jsonb,
    'time_only'
),

-- Plancha con deslizadores
(
    '60000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "transverse_abdominis", "lower_back"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000021"]'::jsonb,
    'time_only'
),

-- Plancha con elevación de pierna
(
    '60000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["glutes", "lower_back", "obliques"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000019"]'::jsonb,
    'time_only'
),

-- Mountain climbers cruzados
(
    '60000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'compound',
    '["obliques", "hip_flexors"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000019", "60000000-0001-0000-0000-000000000021"]'::jsonb,
    'distance_time'
),

-- Dragon flag (avanzado)
(
    '60000000-0001-0000-0000-000000000023'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "hip_flexors", "lower_back"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000026", "60000000-0001-0000-0000-000000000028"]'::jsonb,
    'weight_time'
),

-- Side bend con mancuerna (oblicuos)
(
    '60000000-0001-0000-0000-000000000024'::uuid,
    'system',
    null,
    'obliques',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["60000000-0001-0000-0000-000000000025", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Side crunch en banco romano
(
    '60000000-0001-0000-0000-000000000025'::uuid,
    'system',
    null,
    'obliques',
    'decline_bench',
    'isolation',
    '[]'::jsonb,
    '["decline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000024", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- V-ups
(
    '60000000-0001-0000-0000-000000000026'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'compound',
    '["hip_flexors", "obliques"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000027", "60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps_range'
),

-- Jackknife
(
    '60000000-0001-0000-0000-000000000027'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000026", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps_range'
),

-- Leg raises en banco inclinado
(
    '60000000-0001-0000-0000-000000000028'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'incline_bench',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["incline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000017"]'::jsonb,
    'weight_reps'
),

-- Plancha con rueda abdominal doble
(
    '60000000-0001-0000-0000-000000000029'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'ab_wheel',
    'isolation',
    '["obliques", "lower_back", "erector_spinae"]'::jsonb,
    '["ab_wheel"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_time'
),

-- Hollow hold (sostén hueco)
(
    '60000000-0001-0000-0000-000000000030'::uuid,
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "hip_flexors"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'time_only'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_core 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('rectus_abdominis', 'obliques', 'erector_spinae', 'hamstrings');

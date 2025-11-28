-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: PIERNAS (exercisesLegs)
-- ============================================================================
-- Ejecutar este script después de migration-06-core.sql para migrar todos los ejercicios de piernas
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

-- Sentadilla con barra
(
    '70000000-0001-0000-0000-000000000001'::uuid,
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings", "erector_spinae"]'::jsonb,
    '["barbell", "flat_bench", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000005", "70000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Sentadilla frontal
(
    '70000000-0001-0000-0000-000000000002'::uuid,
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings", "erector_spinae"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Sentadilla goblet
(
    '70000000-0001-0000-0000-000000000003'::uuid,
    'system',
    null,
    'quads',
    'dumbbell',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000002", "70000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Sentadilla en máquina Smith
(
    '70000000-0001-0000-0000-000000000004'::uuid,
    'system',
    null,
    'quads',
    'smith_machine',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["smith_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Prensa de piernas
(
    '70000000-0001-0000-0000-000000000005'::uuid,
    'system',
    null,
    'quads',
    'leg_press',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Zancadas (lunges)
(
    '70000000-0001-0000-0000-000000000006'::uuid,
    'system',
    null,
    'quads',
    'bodyweight',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["bodyweight", "dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000007", "70000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Zancadas búlgaras
(
    '70000000-0001-0000-0000-000000000007'::uuid,
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["quads", "hamstrings"]'::jsonb,
    '["bodyweight", "dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000006", "70000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Step-up (subida al banco)
(
    '70000000-0001-0000-0000-000000000008'::uuid,
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["quads", "hamstrings"]'::jsonb,
    '["bodyweight", "dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000006", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Peso muerto rumano
(
    '70000000-0001-0000-0000-000000000009'::uuid,
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000018", "40000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Curl de piernas acostado en máquina
(
    '70000000-0001-0000-0000-000000000010'::uuid,
    'system',
    null,
    'hamstrings',
    'leg_curl_machine',
    'isolation',
    '[]'::jsonb,
    '["leg_curl_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Curl de piernas sentado
(
    '70000000-0001-0000-0000-000000000011'::uuid,
    'system',
    null,
    'hamstrings',
    'leg_curl_machine',
    'isolation',
    '[]'::jsonb,
    '["leg_curl_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000012", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Extensión de piernas en máquina
(
    '70000000-0001-0000-0000-000000000012'::uuid,
    'system',
    null,
    'quads',
    'leg_extension_machine',
    'isolation',
    '[]'::jsonb,
    '["leg_extension_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000013", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Hip Thrust (empuje de cadera con barra)
(
    '70000000-0001-0000-0000-000000000013'::uuid,
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["hamstrings", "lower_back"]'::jsonb,
    '["barbell", "flat_bench", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Puente de glúteos (glute bridge)
(
    '70000000-0001-0000-0000-000000000014'::uuid,
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["hamstrings", "lower_back"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Abducción de cadera en máquina
(
    '70000000-0001-0000-0000-000000000015'::uuid,
    'system',
    null,
    'hip_abductors',
    'leg_press',
    'isolation',
    '["glutes"]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Abducción de cadera con banda
(
    '70000000-0001-0000-0000-000000000016'::uuid,
    'system',
    null,
    'hip_abductors',
    'resistance_band',
    'isolation',
    '["glutes"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["70000000-0001-0000-0000-000000000009", "70000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Adducción de cadera en máquina
(
    '70000000-0001-0000-0000-000000000017'::uuid,
    'system',
    null,
    'hip_adductors',
    'leg_press',
    'isolation',
    '[]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Peso muerto a una pierna
(
    '70000000-0001-0000-0000-000000000018'::uuid,
    'system',
    null,
    'hamstrings',
    'dumbbell',
    'compound',
    '["glutes", "erector_spinae"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["70000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de talones de pie (pantorrillas)
(
    '70000000-0001-0000-0000-000000000019'::uuid,
    'system',
    null,
    'calves',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["bodyweight", "dumbbell", "smith_machine"]'::jsonb,
    '["70000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de talones sentado
(
    '70000000-0001-0000-0000-000000000020'::uuid,
    'system',
    null,
    'calves',
    'seated_row_machine',
    'isolation',
    '[]'::jsonb,
    '["seated_row_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Hack
(
    '70000000-0001-0000-0000-000000000021'::uuid,
    'system',
    null,
    'quads',
    'leg_press',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["leg_press"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Sissy
(
    '70000000-0001-0000-0000-000000000022'::uuid,
    'system',
    null,
    'quads',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Zercher
(
    '70000000-0001-0000-0000-000000000023'::uuid,
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "rectus_abdominis"]'::jsonb,
    '["barbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con Salto
(
    '70000000-0001-0000-0000-000000000024'::uuid,
    'system',
    null,
    'quads',
    'bodyweight',
    'compound',
    '["glutes", "calves"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000013", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con Banda Elástica
(
    '70000000-0001-0000-0000-000000000025'::uuid,
    'system',
    null,
    'quads',
    'resistance_band',
    'compound',
    '["glutes"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Sumo con Mancuerna
(
    '70000000-0001-0000-0000-000000000026'::uuid,
    'system',
    null,
    'glutes',
    'dumbbell',
    'compound',
    '["quads", "hamstrings", "hip_adductors"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000028"]'::jsonb,
    'weight_reps'
),

-- Sentadilla a Caja
(
    '70000000-0001-0000-0000-000000000027'::uuid,
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto Sumo
(
    '70000000-0001-0000-0000-000000000028'::uuid,
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["quads", "hamstrings", "erector_spinae"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000029"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto con Trap Bar
(
    '70000000-0001-0000-0000-000000000029'::uuid,
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["quads", "hamstrings", "erector_spinae"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000030"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto con Kettlebell
(
    '70000000-0001-0000-0000-000000000030'::uuid,
    'system',
    null,
    'glutes',
    'kettlebell',
    'compound',
    '["hamstrings", "erector_spinae"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "40000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_piernas 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('quads', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_adductors');

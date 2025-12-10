-- ============================================================================
-- PROGRESSION TREES - SEED DATA: DIP PATH
-- ============================================================================
-- Ejecutar DESPUÉS de supabase-schema.sql
-- 
-- EJERCICIOS EXISTENTES USADOS:
-- - 30000000-0001-0000-0000-000000000001 = Fondos en paralelas (triceps focus)
-- - 30000000-0001-0000-0000-000000000011 = Fondos en banco (Bench Dips)
-- - 10000000-0001-0000-0000-000000000010 = Fondos en paralelas (chest focus)
--
-- EJERCICIOS NUEVOS (requieren migración):
-- - 30000000-0001-0000-0000-000000000020 = Negative Dips
-- - 30000000-0001-0000-0000-000000000021 = Ring Dips
-- - 30000000-0001-0000-0000-000000000022 = Weighted Dips
-- - 30000000-0001-0000-0000-000000000023 = Korean Dips
-- ============================================================================

-- ============================================================================
-- STEP 1: Agregar ejercicios de calistenia que faltan
-- ============================================================================

INSERT INTO exercises (
    id, source, main_muscle_group, primary_equipment, exercise_type,
    secondary_muscle_groups, equipment, similar_exercises, default_measurement_template
) VALUES 
-- Negative Dips
(
    '30000000-0001-0000-0000-000000000020'::uuid,
    'system', 'triceps', 'parallel_bars', 'compound',
    '["chest_lower", "front_delts"]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),
-- Ring Dips
(
    '30000000-0001-0000-0000-000000000021'::uuid,
    'system', 'triceps', 'gymnastics_rings', 'compound',
    '["chest_lower", "front_delts", "rectus_abdominis"]'::jsonb,
    '["gymnastics_rings"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000022"]'::jsonb,
    'weight_reps'
),
-- Weighted Dips
(
    '30000000-0001-0000-0000-000000000022'::uuid,
    'system', 'triceps', 'parallel_bars', 'compound',
    '["chest_lower", "front_delts"]'::jsonb,
    '["parallel_bars", "weight_belt"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),
-- Korean Dips
(
    '30000000-0001-0000-0000-000000000023'::uuid,
    'system', 'triceps', 'parallel_bars', 'compound',
    '["front_delts", "rectus_abdominis"]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["30000000-0001-0000-0000-000000000022", "30000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Agregar traducciones de los nuevos ejercicios
-- ============================================================================

INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions) VALUES
-- Negative Dips - ES
('30000000-0001-0000-0000-000000000020', 'es', 'Fondos negativos', 'fondos negativos negative dips',
'["Subí a la posición superior de fondos con los brazos extendidos.", "Bajá lentamente (3-5 segundos) controlando el descenso.", "Llegá hasta que los codos formen un ángulo de 90 grados o menos.", "Usá los pies o una caja para volver a subir.", "Repetí enfocándote en la fase negativa."]'::jsonb),
-- Negative Dips - EN
('30000000-0001-0000-0000-000000000020', 'en', 'Negative Dips', 'negative dips eccentric',
'["Get to the top dip position with arms extended.", "Lower slowly (3-5 seconds) controlling the descent.", "Go until elbows form a 90-degree angle or less.", "Use feet or a box to get back up.", "Repeat focusing on the negative phase."]'::jsonb),

-- Ring Dips - ES
('30000000-0001-0000-0000-000000000021', 'es', 'Fondos en anillas', 'fondos en anillas ring dips gimnasia',
'["Agarrate de las anillas y subí a la posición de soporte.", "Mantené las anillas cerca del cuerpo y el core activado.", "Bajá flexionando los codos hasta 90 grados o más.", "Empujá para volver a la posición inicial.", "Girá las anillas hacia afuera (RTO) en la parte superior para mayor dificultad."]'::jsonb),
-- Ring Dips - EN
('30000000-0001-0000-0000-000000000021', 'en', 'Ring Dips', 'ring dips gymnastics',
'["Grab the rings and get to support position.", "Keep rings close to body and core engaged.", "Lower by bending elbows to 90 degrees or more.", "Push to return to starting position.", "Turn rings out (RTO) at top for increased difficulty."]'::jsonb),

-- Weighted Dips - ES
('30000000-0001-0000-0000-000000000022', 'es', 'Fondos con peso', 'fondos con peso weighted dips lastre',
'["Colocate un cinturón de lastre o chaleco con peso.", "Posicionate en las barras paralelas con los brazos extendidos.", "Bajá controladamente hasta que los codos formen 90 grados.", "Empujá para volver a la posición inicial.", "Mantené el pecho erguido y evitá el balanceo."]'::jsonb),
-- Weighted Dips - EN
('30000000-0001-0000-0000-000000000022', 'en', 'Weighted Dips', 'weighted dips belt',
'["Put on a dip belt or weighted vest.", "Position yourself on parallel bars with arms extended.", "Lower in controlled manner until elbows form 90 degrees.", "Push to return to starting position.", "Keep chest up and avoid swinging."]'::jsonb),

-- Korean Dips - ES
('30000000-0001-0000-0000-000000000023', 'es', 'Fondos coreanos', 'fondos coreanos korean dips',
'["Colocate de espaldas a una barra a la altura de la cadera.", "Agarrate de la barra con las manos detrás de vos.", "Bajá el cuerpo flexionando los codos.", "Los hombros pasarán por debajo de la barra.", "Empujá para volver a la posición inicial."]'::jsonb),
-- Korean Dips - EN
('30000000-0001-0000-0000-000000000023', 'en', 'Korean Dips', 'korean dips behind back',
'["Position yourself with back to a bar at hip height.", "Grab the bar with hands behind you.", "Lower body by bending elbows.", "Shoulders will pass below the bar.", "Push to return to starting position."]'::jsonb)
ON CONFLICT (exercise_id, language_code) DO NOTHING;

-- ============================================================================
-- STEP 3: Crear el Progression Path
-- ============================================================================

INSERT INTO progression_paths (
    id, slug, name_key, description_key, category, 
    ultimate_exercise_id, icon, color
) VALUES (
    '90000000-0001-0000-0000-000000000003'::uuid,
    'dip-progression',
    'progressions.paths.dip.name',
    'progressions.paths.dip.description',
    'vertical_push',
    '30000000-0001-0000-0000-000000000022'::uuid, -- Weighted Dips (como objetivo práctico)
    'arrow-down',
    '#8B5CF6' -- Purple
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 4: Agregar ejercicios al path con sus niveles
-- ============================================================================

INSERT INTO progression_path_exercises (path_id, exercise_id, level, is_main_path) VALUES
-- Level 1: Bench Dips (ya existe)
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000011', 1, true),
-- Level 2: Negative Dips
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000020', 2, true),
-- Level 3: Parallel Bar Dips - triceps focus (ya existe)
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000001', 3, true),
-- Level 3 Alt: Parallel Bar Dips - chest focus (ya existe) - variación
('90000000-0001-0000-0000-000000000003', '10000000-0001-0000-0000-000000000010', 3, false),
-- Level 4: Ring Dips
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000021', 4, true),
-- Level 5: Weighted Dips
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000022', 5, true),
-- Level 6: Korean Dips (skill avanzado)
('90000000-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000023', 6, true)
ON CONFLICT (path_id, exercise_id) DO NOTHING;

-- ============================================================================
-- STEP 5: Crear las relaciones de progresión
-- ============================================================================

INSERT INTO exercise_progressions (
    from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, source
) VALUES
-- Bench Dips → Negative Dips
(
    '30000000-0001-0000-0000-000000000011',
    '30000000-0001-0000-0000-000000000020',
    'progression',
    '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.bench_dips_15"}'::jsonb,
    1, 'system'
),
-- Negative Dips → Parallel Bar Dips
(
    '30000000-0001-0000-0000-000000000020',
    '30000000-0001-0000-0000-000000000001',
    'progression',
    '{"type": "reps", "primary_value": 8, "description_key": "progressions.criteria.negative_dips_8"}'::jsonb,
    1, 'system'
),
-- Parallel Bar Dips → Ring Dips
(
    '30000000-0001-0000-0000-000000000001',
    '30000000-0001-0000-0000-000000000021',
    'progression',
    '{"type": "reps", "primary_value": 12, "description_key": "progressions.criteria.dips_12"}'::jsonb,
    1, 'system'
),
-- Ring Dips → Weighted Dips
(
    '30000000-0001-0000-0000-000000000021',
    '30000000-0001-0000-0000-000000000022',
    'progression',
    '{"type": "reps", "primary_value": 10, "description_key": "progressions.criteria.ring_dips_10"}'::jsonb,
    1, 'system'
),
-- Weighted Dips → Korean Dips
(
    '30000000-0001-0000-0000-000000000022',
    '30000000-0001-0000-0000-000000000023',
    'progression',
    '{"type": "weight_reps", "primary_value": 20, "secondary_value": 8, "description_key": "progressions.criteria.weighted_dips_20kg_8"}'::jsonb,
    1, 'system'
),
-- Parallel Bar Dips (triceps) → Weighted Dips (alternativo desde dips normales)
(
    '30000000-0001-0000-0000-000000000001',
    '30000000-0001-0000-0000-000000000022',
    'progression',
    '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.dips_15"}'::jsonb,
    1, 'system'
),

-- ===== VARIACIONES (mismo nivel) =====
-- Triceps Dips ↔ Chest Dips
(
    '30000000-0001-0000-0000-000000000001',
    '10000000-0001-0000-0000-000000000010',
    'variation',
    NULL,
    0, 'system'
)
ON CONFLICT (from_exercise_id, to_exercise_id, relationship_type) DO NOTHING;

-- ============================================================================
-- BONUS: Conexión Dips → Muscle-up (prerequisito)
-- Si se crea el path de Muscle-up en el futuro
-- ============================================================================

-- Para Muscle-up necesitaremos crear el ejercicio primero
-- INSERT INTO exercise_progressions (...) VALUES
-- (
--     '30000000-0001-0000-0000-000000000001', -- Parallel Bar Dips
--     'MUSCLE_UP_ID',
--     'prerequisite',
--     '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.dips_15_muscleup"}'::jsonb,
--     2, 'system'
-- );

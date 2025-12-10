-- ============================================================================
-- PROGRESSION TREES - SEED DATA: PUSH-UP PATH
-- ============================================================================
-- Ejecutar DESPUÉS de supabase-schema.sql
-- 
-- EJERCICIOS EXISTENTES USADOS:
-- - 10000000-0001-0000-0000-000000000011 = Flexiones de brazos (Push-ups)
-- - 10000000-0001-0000-0000-000000000012 = Flexiones declinadas (Decline Push-ups)
-- - 30000000-0001-0000-0000-000000000016 = Flexiones diamante (Diamond Push-ups)
--
-- EJERCICIOS NUEVOS (requieren migración):
-- - 10000000-0001-0000-0000-000000000020 = Wall Push-ups
-- - 10000000-0001-0000-0000-000000000021 = Incline Push-ups
-- - 10000000-0001-0000-0000-000000000022 = Knee Push-ups
-- - 10000000-0001-0000-0000-000000000023 = Archer Push-ups
-- - 10000000-0001-0000-0000-000000000024 = Pseudo Planche Push-ups
-- - 10000000-0001-0000-0000-000000000025 = One Arm Push-ups
-- ============================================================================

-- ============================================================================
-- STEP 1: Agregar ejercicios de calistenia que faltan
-- ============================================================================

INSERT INTO exercises (
    id, source, main_muscle_group, primary_equipment, exercise_type,
    secondary_muscle_groups, equipment, similar_exercises, default_measurement_template
) VALUES 
-- Wall Push-ups
(
    '10000000-0001-0000-0000-000000000020'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000021", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),
-- Incline Push-ups
(
    '10000000-0001-0000-0000-000000000021'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000020", "10000000-0001-0000-0000-000000000022"]'::jsonb,
    'weight_reps'
),
-- Knee Push-ups
(
    '10000000-0001-0000-0000-000000000022'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000021", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),
-- Archer Push-ups
(
    '10000000-0001-0000-0000-000000000023'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["triceps", "front_delts", "rectus_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["30000000-0001-0000-0000-000000000016", "10000000-0001-0000-0000-000000000024"]'::jsonb,
    'weight_reps'
),
-- Pseudo Planche Push-ups
(
    '10000000-0001-0000-0000-000000000024'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["front_delts", "triceps", "rectus_abdominis"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000023", "10000000-0001-0000-0000-000000000025"]'::jsonb,
    'weight_reps'
),
-- One Arm Push-ups
(
    '10000000-0001-0000-0000-000000000025'::uuid,
    'system', 'chest_middle', 'bodyweight', 'compound',
    '["triceps", "front_delts", "rectus_abdominis", "obliques"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000024", "10000000-0001-0000-0000-000000000023"]'::jsonb,
    'weight_reps'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Agregar traducciones de los nuevos ejercicios
-- ============================================================================

INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions) VALUES
-- Wall Push-ups - ES
('10000000-0001-0000-0000-000000000020', 'es', 'Flexiones en pared', 'flexiones en pared wall push ups',
'["Párate frente a una pared a un brazo de distancia.", "Apoyá las manos en la pared a la altura de los hombros.", "Flexioná los codos llevando el pecho hacia la pared.", "Empujá para volver a la posición inicial.", "Mantené el cuerpo recto durante todo el movimiento."]'::jsonb),
-- Wall Push-ups - EN
('10000000-0001-0000-0000-000000000020', 'en', 'Wall Push-Ups', 'wall push ups beginner',
'["Stand facing a wall at arm length distance.", "Place hands on wall at shoulder height.", "Bend elbows bringing chest toward the wall.", "Push back to starting position.", "Keep body straight throughout the movement."]'::jsonb),

-- Incline Push-ups - ES
('10000000-0001-0000-0000-000000000021', 'es', 'Flexiones inclinadas', 'flexiones inclinadas incline push ups',
'["Apoyá las manos en un banco o superficie elevada.", "Colocá los pies en el suelo con el cuerpo recto.", "Bajá el pecho hacia el banco flexionando los codos.", "Empujá para volver a la posición inicial.", "Cuanto más alto el banco, más fácil el ejercicio."]'::jsonb),
-- Incline Push-ups - EN
('10000000-0001-0000-0000-000000000021', 'en', 'Incline Push-Ups', 'incline push ups elevated',
'["Place hands on a bench or elevated surface.", "Position feet on the floor with body straight.", "Lower chest toward bench by bending elbows.", "Push back to starting position.", "The higher the bench, the easier the exercise."]'::jsonb),

-- Knee Push-ups - ES
('10000000-0001-0000-0000-000000000022', 'es', 'Flexiones de rodillas', 'flexiones de rodillas knee push ups',
'["Colocate en posición de plancha con las rodillas apoyadas en el suelo.", "Las manos deben estar a la altura de los hombros.", "Bajá el pecho hacia el suelo flexionando los codos.", "Empujá para volver a la posición inicial.", "Mantené el core activado y las caderas alineadas."]'::jsonb),
-- Knee Push-ups - EN
('10000000-0001-0000-0000-000000000022', 'en', 'Knee Push-Ups', 'knee push ups modified',
'["Get in plank position with knees on the floor.", "Hands should be at shoulder width.", "Lower chest toward floor by bending elbows.", "Push back to starting position.", "Keep core engaged and hips aligned."]'::jsonb),

-- Archer Push-ups - ES
('10000000-0001-0000-0000-000000000023', 'es', 'Flexiones arquero', 'flexiones arquero archer push ups',
'["Colocate en posición de flexión con las manos muy separadas.", "Bajá hacia un lado, extendiendo el brazo opuesto.", "El brazo extendido debe quedar casi recto.", "Empujá para volver al centro.", "Alterná hacia cada lado."]'::jsonb),
-- Archer Push-ups - EN
('10000000-0001-0000-0000-000000000023', 'en', 'Archer Push-Ups', 'archer push ups wide unilateral',
'["Get in push-up position with hands very wide apart.", "Lower toward one side, extending the opposite arm.", "The extended arm should be almost straight.", "Push back to center.", "Alternate to each side."]'::jsonb),

-- Pseudo Planche Push-ups - ES
('10000000-0001-0000-0000-000000000024', 'es', 'Flexiones pseudo planche', 'flexiones pseudo planche lean forward',
'["Colocate en posición de flexión con las manos a la altura de la cintura.", "Los dedos deben apuntar hacia afuera o hacia atrás.", "Incliná el cuerpo hacia adelante antes de bajar.", "Bajá manteniendo la inclinación hacia adelante.", "Empujá para volver a la posición inicial."]'::jsonb),
-- Pseudo Planche Push-ups - EN
('10000000-0001-0000-0000-000000000024', 'en', 'Pseudo Planche Push-Ups', 'pseudo planche push ups lean',
'["Get in push-up position with hands at hip level.", "Fingers should point outward or backward.", "Lean body forward before lowering.", "Lower while maintaining the forward lean.", "Push back to starting position."]'::jsonb),

-- One Arm Push-ups - ES
('10000000-0001-0000-0000-000000000025', 'es', 'Flexiones a un brazo', 'flexiones un brazo one arm push ups',
'["Colocate en posición de flexión con los pies más separados de lo normal.", "Poné una mano detrás de la espalda.", "Bajá el pecho hacia el suelo de forma controlada.", "Empujá con un solo brazo para volver arriba.", "Mantené las caderas lo más estables posible."]'::jsonb),
-- One Arm Push-ups - EN
('10000000-0001-0000-0000-000000000025', 'en', 'One Arm Push-Ups', 'one arm push ups single',
'["Get in push-up position with feet wider than normal.", "Place one hand behind your back.", "Lower chest toward floor in a controlled manner.", "Push with one arm to return to top.", "Keep hips as stable as possible."]'::jsonb)
ON CONFLICT (exercise_id, language_code) DO NOTHING;

-- ============================================================================
-- STEP 3: Crear el Progression Path
-- ============================================================================

INSERT INTO progression_paths (
    id, slug, name_key, description_key, category, 
    ultimate_exercise_id, icon, color
) VALUES (
    '90000000-0001-0000-0000-000000000002'::uuid,
    'pushup-progression',
    'progressions.paths.pushup.name',
    'progressions.paths.pushup.description',
    'horizontal_push',
    '10000000-0001-0000-0000-000000000025'::uuid, -- One Arm Push-up
    'arrow-right',
    '#EF4444' -- Red
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 4: Agregar ejercicios al path con sus niveles
-- ============================================================================

INSERT INTO progression_path_exercises (path_id, exercise_id, level, is_main_path) VALUES
-- Level 1: Wall Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000020', 1, true),
-- Level 2: Incline Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000021', 2, true),
-- Level 3: Knee Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000022', 3, true),
-- Level 4: Push-ups (ya existe)
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000011', 4, true),
-- Level 4 Alt: Decline Push-ups (ya existe) - variación
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000012', 4, false),
-- Level 5: Diamond Push-ups (ya existe)
('90000000-0001-0000-0000-000000000002', '30000000-0001-0000-0000-000000000016', 5, true),
-- Level 6: Archer Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000023', 6, true),
-- Level 7: Pseudo Planche Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000024', 7, true),
-- Level 8: One Arm Push-ups
('90000000-0001-0000-0000-000000000002', '10000000-0001-0000-0000-000000000025', 8, true)
ON CONFLICT (path_id, exercise_id) DO NOTHING;

-- ============================================================================
-- STEP 5: Crear las relaciones de progresión
-- ============================================================================

INSERT INTO exercise_progressions (
    from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, source
) VALUES
-- Wall Push-ups → Incline Push-ups
(
    '10000000-0001-0000-0000-000000000020',
    '10000000-0001-0000-0000-000000000021',
    'progression',
    '{"type": "reps", "primary_value": 20, "description_key": "progressions.criteria.wall_pushups_20"}'::jsonb,
    1, 'system'
),
-- Incline Push-ups → Knee Push-ups
(
    '10000000-0001-0000-0000-000000000021',
    '10000000-0001-0000-0000-000000000022',
    'progression',
    '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.incline_pushups_15"}'::jsonb,
    1, 'system'
),
-- Knee Push-ups → Push-ups
(
    '10000000-0001-0000-0000-000000000022',
    '10000000-0001-0000-0000-000000000011',
    'progression',
    '{"type": "reps", "primary_value": 12, "description_key": "progressions.criteria.knee_pushups_12"}'::jsonb,
    1, 'system'
),
-- Push-ups → Diamond Push-ups
(
    '10000000-0001-0000-0000-000000000011',
    '30000000-0001-0000-0000-000000000016',
    'progression',
    '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.pushups_15"}'::jsonb,
    1, 'system'
),
-- Diamond Push-ups → Archer Push-ups
(
    '30000000-0001-0000-0000-000000000016',
    '10000000-0001-0000-0000-000000000023',
    'progression',
    '{"type": "reps", "primary_value": 12, "description_key": "progressions.criteria.diamond_pushups_12"}'::jsonb,
    1, 'system'
),
-- Archer Push-ups → Pseudo Planche Push-ups
(
    '10000000-0001-0000-0000-000000000023',
    '10000000-0001-0000-0000-000000000024',
    'progression',
    '{"type": "reps", "primary_value": 10, "description_key": "progressions.criteria.archer_pushups_10"}'::jsonb,
    1, 'system'
),
-- Pseudo Planche Push-ups → One Arm Push-ups
(
    '10000000-0001-0000-0000-000000000024',
    '10000000-0001-0000-0000-000000000025',
    'progression',
    '{"type": "reps", "primary_value": 10, "description_key": "progressions.criteria.pseudo_planche_10"}'::jsonb,
    1, 'system'
),

-- ===== VARIACIONES (mismo nivel) =====
-- Push-ups ↔ Decline Push-ups
(
    '10000000-0001-0000-0000-000000000011',
    '10000000-0001-0000-0000-000000000012',
    'variation',
    NULL,
    0, 'system'
)
ON CONFLICT (from_exercise_id, to_exercise_id, relationship_type) DO NOTHING;

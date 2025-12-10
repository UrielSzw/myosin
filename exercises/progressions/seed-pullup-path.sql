-- ============================================================================
-- PROGRESSION TREES - SEED DATA: PULL-UP PATH
-- ============================================================================
-- Ejecutar DESPUÉS de supabase-schema.sql
-- 
-- EJERCICIOS EXISTENTES USADOS:
-- - 40000000-0001-0000-0000-000000000001 = Dominadas (Pull-ups)
-- - 40000000-0001-0000-0000-000000000017 = Dominadas supinas (Chin-ups)
-- - 40000000-0001-0000-0000-000000000018 = Dominadas neutras
-- - 40000000-0001-0000-0000-000000000021 = Remo invertido (Inverted Row)
-- - 40000000-0001-0000-0000-000000000022 = Remo con TRX
--
-- EJERCICIOS NUEVOS (requieren migración separada):
-- - 40000000-0001-0000-0000-000000000030 = Dead Hang
-- - 40000000-0001-0000-0000-000000000031 = Scapular Pulls
-- - 40000000-0001-0000-0000-000000000032 = Negative Pull-ups
-- - 40000000-0001-0000-0000-000000000033 = Weighted Pull-ups
-- - 40000000-0001-0000-0000-000000000034 = Archer Pull-ups
-- - 40000000-0001-0000-0000-000000000035 = One Arm Negative Pull-ups
-- - 40000000-0001-0000-0000-000000000036 = One Arm Pull-ups
-- ============================================================================

-- ============================================================================
-- STEP 1: Agregar ejercicios de calistenia que faltan
-- ============================================================================

INSERT INTO exercises (
    id, source, main_muscle_group, primary_equipment, exercise_type,
    secondary_muscle_groups, equipment, similar_exercises, default_measurement_template
) VALUES 
-- Dead Hang
(
    '40000000-0001-0000-0000-000000000030'::uuid,
    'system', 'lats', 'pull_up_bar', 'isolation',
    '["forearms", "rear_delts"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000031", "40000000-0001-0000-0000-000000000001"]'::jsonb,
    'time_only'
),
-- Scapular Pulls
(
    '40000000-0001-0000-0000-000000000031'::uuid,
    'system', 'rhomboids', 'pull_up_bar', 'isolation',
    '["lats", "mid_traps"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000030", "40000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),
-- Negative Pull-ups
(
    '40000000-0001-0000-0000-000000000032'::uuid,
    'system', 'lats', 'pull_up_bar', 'compound',
    '["biceps", "rear_delts", "rhomboids"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),
-- Weighted Pull-ups
(
    '40000000-0001-0000-0000-000000000033'::uuid,
    'system', 'lats', 'pull_up_bar', 'compound',
    '["biceps", "rear_delts", "rhomboids", "mid_traps"]'::jsonb,
    '["pull_up_bar", "weight_belt"]'::jsonb,
    '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000034"]'::jsonb,
    'weight_reps'
),
-- Archer Pull-ups
(
    '40000000-0001-0000-0000-000000000034'::uuid,
    'system', 'lats', 'pull_up_bar', 'compound',
    '["biceps", "rear_delts", "rhomboids"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000033", "40000000-0001-0000-0000-000000000035"]'::jsonb,
    'weight_reps'
),
-- One Arm Negative Pull-ups
(
    '40000000-0001-0000-0000-000000000035'::uuid,
    'system', 'lats', 'pull_up_bar', 'compound',
    '["biceps", "rear_delts", "forearms"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000034", "40000000-0001-0000-0000-000000000036"]'::jsonb,
    'weight_reps'
),
-- One Arm Pull-ups
(
    '40000000-0001-0000-0000-000000000036'::uuid,
    'system', 'lats', 'pull_up_bar', 'compound',
    '["biceps", "rear_delts", "forearms", "rhomboids"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000035", "40000000-0001-0000-0000-000000000034"]'::jsonb,
    'weight_reps'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Agregar traducciones de los nuevos ejercicios
-- ============================================================================

INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions) VALUES
-- Dead Hang - ES
('40000000-0001-0000-0000-000000000030', 'es', 'Colgado pasivo (Dead Hang)', 'colgado pasivo dead hang barra',
'["Agarrate de la barra con agarre prono (palmas hacia adelante) a la altura de los hombros.", "Dejate colgar completamente con los brazos extendidos.", "Relajá los hombros permitiendo que las escápulas se eleven.", "Mantené el core ligeramente activado para evitar balanceos.", "Respirá de manera controlada durante todo el ejercicio."]'::jsonb),
-- Dead Hang - EN
('40000000-0001-0000-0000-000000000030', 'en', 'Dead Hang', 'dead hang bar passive',
'["Grab the bar with an overhand grip at shoulder width.", "Hang completely with arms fully extended.", "Relax shoulders allowing scapulae to elevate.", "Keep core slightly engaged to avoid swinging.", "Breathe in a controlled manner throughout the exercise."]'::jsonb),

-- Scapular Pulls - ES
('40000000-0001-0000-0000-000000000031', 'es', 'Retracción escapular en barra', 'retraccion escapular barra scapular pulls',
'["Colgáte de la barra con los brazos completamente extendidos.", "Sin doblar los codos, tirá las escápulas hacia abajo y atrás.", "Deberías sentir que tu cuerpo sube ligeramente.", "Mantené la posición un segundo en la parte superior.", "Volvé a la posición inicial de forma controlada."]'::jsonb),
-- Scapular Pulls - EN
('40000000-0001-0000-0000-000000000031', 'en', 'Scapular Pulls', 'scapular pulls bar retraction',
'["Hang from the bar with arms fully extended.", "Without bending elbows, pull scapulae down and back.", "You should feel your body rise slightly.", "Hold position for a second at the top.", "Return to starting position in a controlled manner."]'::jsonb),

-- Negative Pull-ups - ES
('40000000-0001-0000-0000-000000000032', 'es', 'Dominadas negativas', 'dominadas negativas negative pull ups',
'["Usá una caja o saltá para llegar a la posición superior de la dominada.", "Comenzá con la barbilla por encima de la barra y los codos flexionados.", "Bajá lentamente (3-5 segundos) controlando el descenso.", "Extendé completamente los brazos al final del movimiento.", "Volvé a subir con ayuda y repetí."]'::jsonb),
-- Negative Pull-ups - EN
('40000000-0001-0000-0000-000000000032', 'en', 'Negative Pull-Ups', 'negative pull ups eccentric',
'["Use a box or jump to reach the top position of a pull-up.", "Start with chin above the bar and elbows bent.", "Lower slowly (3-5 seconds) controlling the descent.", "Fully extend arms at the end of the movement.", "Get back up with assistance and repeat."]'::jsonb),

-- Weighted Pull-ups - ES
('40000000-0001-0000-0000-000000000033', 'es', 'Dominadas con peso', 'dominadas con peso weighted pull ups lastre',
'["Colocate un cinturón de lastre o chaleco con peso.", "Agarrate de la barra con agarre prono a la altura de los hombros.", "Desde la posición colgado, tirá de los codos hacia abajo para subir.", "Llevá la barbilla por encima de la barra.", "Bajá de forma controlada hasta la extensión completa."]'::jsonb),
-- Weighted Pull-ups - EN
('40000000-0001-0000-0000-000000000033', 'en', 'Weighted Pull-Ups', 'weighted pull ups dip belt',
'["Put on a dip belt or weighted vest.", "Grab the bar with an overhand grip at shoulder width.", "From hanging position, pull elbows down to rise.", "Bring chin above the bar.", "Lower in a controlled manner to full extension."]'::jsonb),

-- Archer Pull-ups - ES
('40000000-0001-0000-0000-000000000034', 'es', 'Dominadas arquero', 'dominadas arquero archer pull ups unilateral',
'["Agarrate de la barra con un agarre muy amplio.", "Tirá principalmente con un brazo mientras el otro se extiende hacia el lado.", "Subí hasta que la barbilla pase la barra del lado del brazo que trabaja.", "Bajá de forma controlada.", "Alterná el brazo que trabaja en cada repetición."]'::jsonb),
-- Archer Pull-ups - EN
('40000000-0001-0000-0000-000000000034', 'en', 'Archer Pull-Ups', 'archer pull ups unilateral wide',
'["Grab the bar with a very wide grip.", "Pull primarily with one arm while the other extends to the side.", "Rise until chin passes the bar on the working arm side.", "Lower in a controlled manner.", "Alternate the working arm on each rep."]'::jsonb),

-- One Arm Negative Pull-ups - ES
('40000000-0001-0000-0000-000000000035', 'es', 'Dominadas negativas a un brazo', 'dominadas negativas un brazo one arm negative',
'["Subí a la posición superior de dominada usando ambas manos.", "Soltá una mano y agarrate la muñeca con la mano libre (opcional).", "Bajá lo más lento posible (5-10 segundos) usando un solo brazo.", "Mantené el core muy activado para evitar rotaciones.", "Volvé a subir con ambas manos y repetí."]'::jsonb),
-- One Arm Negative Pull-ups - EN
('40000000-0001-0000-0000-000000000035', 'en', 'One Arm Negative Pull-Ups', 'one arm negative pull ups eccentric',
'["Get to the top pull-up position using both hands.", "Release one hand and grab your wrist with the free hand (optional).", "Lower as slowly as possible (5-10 seconds) using one arm.", "Keep core very engaged to avoid rotations.", "Get back up with both hands and repeat."]'::jsonb),

-- One Arm Pull-ups - ES
('40000000-0001-0000-0000-000000000036', 'es', 'Dominadas a un brazo', 'dominadas un brazo one arm pull ups',
'["Agarrate de la barra con una sola mano.", "Podés agarrarte la muñeca con la mano libre para asistencia.", "Tirá del codo hacia abajo y atrás para subir.", "Llevá la barbilla por encima de la barra.", "Bajá de forma controlada."]'::jsonb),
-- One Arm Pull-ups - EN
('40000000-0001-0000-0000-000000000036', 'en', 'One Arm Pull-Ups', 'one arm pull ups single',
'["Grab the bar with only one hand.", "You can grab your wrist with the free hand for assistance.", "Pull elbow down and back to rise.", "Bring chin above the bar.", "Lower in a controlled manner."]'::jsonb)
ON CONFLICT (exercise_id, language_code) DO NOTHING;

-- ============================================================================
-- STEP 3: Crear el Progression Path
-- ============================================================================

INSERT INTO progression_paths (
    id, slug, name_key, description_key, category, 
    ultimate_exercise_id, icon, color
) VALUES (
    '90000000-0001-0000-0000-000000000001'::uuid,
    'pullup-progression',
    'progressions.paths.pullup.name',
    'progressions.paths.pullup.description',
    'vertical_pull',
    '40000000-0001-0000-0000-000000000036'::uuid, -- One Arm Pull-up
    'arrow-up',
    '#3B82F6' -- Blue
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 4: Agregar ejercicios al path con sus niveles
-- ============================================================================

INSERT INTO progression_path_exercises (path_id, exercise_id, level, is_main_path) VALUES
-- Level 1: Dead Hang
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000030', 1, true),
-- Level 2: Scapular Pulls
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000031', 2, true),
-- Level 3: Inverted Row (ya existe)
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000021', 3, true),
-- Level 3 Alt: TRX Row (ya existe) - variación
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000022', 3, false),
-- Level 4: Negative Pull-ups
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000032', 4, true),
-- Level 5: Pull-ups (ya existe)
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000001', 5, true),
-- Level 5 Alt: Chin-ups (ya existe) - variación
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000017', 5, false),
-- Level 5 Alt: Neutral Grip Pull-ups (ya existe) - variación
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000018', 5, false),
-- Level 6: Weighted Pull-ups
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000033', 6, true),
-- Level 7: Archer Pull-ups
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000034', 7, true),
-- Level 8: One Arm Negative Pull-ups
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000035', 8, true),
-- Level 9: One Arm Pull-ups
('90000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000036', 9, true)
ON CONFLICT (path_id, exercise_id) DO NOTHING;

-- ============================================================================
-- STEP 5: Crear las relaciones de progresión
-- ============================================================================

INSERT INTO exercise_progressions (
    from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, source
) VALUES
-- Dead Hang → Scapular Pulls
(
    '40000000-0001-0000-0000-000000000030',
    '40000000-0001-0000-0000-000000000031',
    'progression',
    '{"type": "time", "primary_value": 30, "description_key": "progressions.criteria.dead_hang_30s"}'::jsonb,
    1, 'system'
),
-- Scapular Pulls → Inverted Row
(
    '40000000-0001-0000-0000-000000000031',
    '40000000-0001-0000-0000-000000000021',
    'progression',
    '{"type": "reps", "primary_value": 10, "description_key": "progressions.criteria.scapular_pulls_10"}'::jsonb,
    1, 'system'
),
-- Inverted Row → Negative Pull-ups
(
    '40000000-0001-0000-0000-000000000021',
    '40000000-0001-0000-0000-000000000032',
    'progression',
    '{"type": "reps", "primary_value": 15, "description_key": "progressions.criteria.inverted_row_15"}'::jsonb,
    1, 'system'
),
-- Negative Pull-ups → Pull-ups
(
    '40000000-0001-0000-0000-000000000032',
    '40000000-0001-0000-0000-000000000001',
    'progression',
    '{"type": "reps", "primary_value": 8, "description_key": "progressions.criteria.negative_pullups_8"}'::jsonb,
    1, 'system'
),
-- Pull-ups → Weighted Pull-ups
(
    '40000000-0001-0000-0000-000000000001',
    '40000000-0001-0000-0000-000000000033',
    'progression',
    '{"type": "reps", "primary_value": 12, "description_key": "progressions.criteria.pullups_12"}'::jsonb,
    1, 'system'
),
-- Weighted Pull-ups → Archer Pull-ups
(
    '40000000-0001-0000-0000-000000000033',
    '40000000-0001-0000-0000-000000000034',
    'progression',
    '{"type": "weight_reps", "primary_value": 20, "secondary_value": 8, "description_key": "progressions.criteria.weighted_pullups_20kg_8"}'::jsonb,
    1, 'system'
),
-- Archer Pull-ups → One Arm Negative Pull-ups
(
    '40000000-0001-0000-0000-000000000034',
    '40000000-0001-0000-0000-000000000035',
    'progression',
    '{"type": "reps", "primary_value": 8, "description_key": "progressions.criteria.archer_pullups_8"}'::jsonb,
    1, 'system'
),
-- One Arm Negative Pull-ups → One Arm Pull-ups
(
    '40000000-0001-0000-0000-000000000035',
    '40000000-0001-0000-0000-000000000036',
    'progression',
    '{"type": "reps", "primary_value": 5, "description_key": "progressions.criteria.one_arm_neg_5"}'::jsonb,
    1, 'system'
),

-- ===== VARIACIONES (mismo nivel) =====
-- Pull-ups ↔ Chin-ups
(
    '40000000-0001-0000-0000-000000000001',
    '40000000-0001-0000-0000-000000000017',
    'variation',
    NULL,
    0, 'system'
),
-- Pull-ups ↔ Neutral Grip Pull-ups
(
    '40000000-0001-0000-0000-000000000001',
    '40000000-0001-0000-0000-000000000018',
    'variation',
    NULL,
    0, 'system'
),
-- Inverted Row ↔ TRX Row
(
    '40000000-0001-0000-0000-000000000021',
    '40000000-0001-0000-0000-000000000022',
    'variation',
    NULL,
    0, 'system'
)
ON CONFLICT (from_exercise_id, to_exercise_id, relationship_type) DO NOTHING;

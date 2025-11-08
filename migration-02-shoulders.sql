-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: HOMBROS (exercisesShoulders)
-- ============================================================================
-- Ejecutar este script después de migration-01-chest.sql para migrar todos los ejercicios de hombros

INSERT INTO exercises (
    id,
    name,
    source,
    created_by_user_id,
    main_muscle_group,
    primary_equipment,
    exercise_type,
    secondary_muscle_groups,
    instructions,
    equipment,
    similar_exercises,
    default_measurement_template
) VALUES 

-- Press militar con barra
(
    '20000000-0001-0000-0000-000000000001'::uuid,
    'Press militar con barra',
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["Colocate de pie con los pies al ancho de los hombros y la barra apoyada sobre la parte superior del pecho.", "Tomá la barra con agarre pronado, un poco más ancho que los hombros.", "Activá el core y mantené una ligera retracción escapular.", "Empujá la barra hacia arriba hasta extender completamente los brazos sin bloquear los codos.", "Descendé la barra de forma controlada hasta la posición inicial, sin perder tensión.", "Evitá arquear excesivamente la espalda baja durante el movimiento."]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000011", "20000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Press militar con mancuernas
(
    '20000000-0001-0000-0000-000000000002'::uuid,
    'Press militar con mancuernas',
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["Sentate en un banco con respaldo y apoyá los pies firmes en el suelo.", "Sostené una mancuerna en cada mano a la altura de los hombros con agarre pronado.", "Mantené la espalda recta y los omóplatos retraídos.", "Empujá las mancuernas hacia arriba hasta extender completamente los brazos.", "Descendé las mancuernas controladamente hasta la altura inicial.", "Evitá juntar las mancuernas arriba o arquear la espalda durante el movimiento."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press Arnold
(
    '20000000-0001-0000-0000-000000000003'::uuid,
    'Press Arnold',
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["Sentate en un banco con respaldo y sostené una mancuerna en cada mano frente al pecho, con las palmas mirando hacia vos.", "Iniciá el movimiento girando las muñecas hacia afuera mientras empujás las mancuernas hacia arriba.", "Terminá con los brazos extendidos y las palmas mirando hacia adelante.", "Descendé controladamente revirtiendo el giro hasta volver a la posición inicial.", "Mantené el abdomen firme y evitá arquear la espalda baja."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales con mancuernas
(
    '20000000-0001-0000-0000-000000000004'::uuid,
    'Elevaciones laterales con mancuernas',
    'system',
    null,
    'side_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Parate derecho con una mancuerna en cada mano a los costados del cuerpo, palmas hacia adentro.", "Con los codos ligeramente flexionados, elevá los brazos hacia los costados hasta que queden paralelos al suelo.", "Mantené un segundo en la parte alta del movimiento.", "Descendé lentamente hasta la posición inicial sin balancearte.", "Evitá usar impulso o encoger los hombros."]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000006", "20000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Elevaciones frontales con mancuernas
(
    '20000000-0001-0000-0000-000000000005'::uuid,
    'Elevaciones frontales con mancuernas',
    'system',
    null,
    'front_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["De pie, sostené una mancuerna en cada mano frente a los muslos con las palmas hacia el cuerpo.", "Elevá un brazo al frente hasta la altura de los hombros manteniendo el codo ligeramente flexionado.", "Descendé controladamente y repetí con el otro brazo o ambos a la vez.", "Evitá balancearte o arquear la espalda."]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000005", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales con polea
(
    '20000000-0001-0000-0000-000000000006'::uuid,
    'Elevaciones laterales con polea',
    'system',
    null,
    'side_delts',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["Parate al costado de la máquina de polea con el cable ajustado en la posición más baja.", "Tomá el asa con la mano más alejada y mantené el brazo levemente flexionado.", "Elevá el brazo lateralmente hasta la altura del hombro manteniendo el control del movimiento.", "Bajá lentamente hasta la posición inicial.", "Evitá girar el torso o usar impulso."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000004", "20000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Remo al mentón con barra
(
    '20000000-0001-0000-0000-000000000007'::uuid,
    'Remo al mentón con barra',
    'system',
    null,
    'side_delts',
    'barbell',
    'compound',
    '["front_delts", "upper_traps"]'::jsonb,
    '["De pie, sostené una barra con agarre pronado y manos al ancho de los hombros.", "Tirando de los codos hacia arriba, llevá la barra cerca del cuerpo hasta la altura del mentón.", "Mantené las muñecas rectas y los codos más altos que las manos.", "Descendé lentamente hasta la posición inicial.", "Evitá encoger los hombros o usar impulso."]'::jsonb,
    '["barbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000007", "20000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Remo al mentón con polea
(
    '20000000-0001-0000-0000-000000000008'::uuid,
    'Remo al mentón con polea',
    'system',
    null,
    'side_delts',
    'cable_machine',
    'compound',
    '["front_delts", "upper_traps"]'::jsonb,
    '["Conectá una barra recta a la polea baja y tomala con agarre pronado.", "De pie, tirá de la barra hacia arriba guiando con los codos hasta que llegue cerca del mentón.", "Mantené el torso erguido y el core firme.", "Descendé lentamente hasta extender los brazos completamente.", "Evitá usar impulso o elevar los hombros."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000009", "20000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones posteriores (pájaros) con mancuernas
(
    '20000000-0001-0000-0000-000000000009'::uuid,
    'Elevaciones posteriores (pájaros) con mancuernas',
    'system',
    null,
    'rear_delts',
    'dumbbell',
    'isolation',
    '["mid_traps", "rhomboids"]'::jsonb,
    '["Con una mancuerna en cada mano, incliná el torso hacia adelante hasta casi quedar paralelo al suelo.", "Dejá los brazos colgando con los codos ligeramente flexionados.", "Elevá los brazos hacia los costados hasta la altura de los hombros, contrayendo los deltoides posteriores.", "Bajá lentamente sin perder tensión.", "Evitá balancearte o extender el tronco durante el movimiento."]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Face Pull con polea
(
    '20000000-0001-0000-0000-000000000010'::uuid,
    'Face Pull con polea',
    'system',
    null,
    'rear_delts',
    'cable_machine',
    'isolation',
    '["rhomboids", "mid_traps"]'::jsonb,
    '["Ajustá la polea a la altura del rostro y acoplá una cuerda.", "Tomá la cuerda con agarre neutro y retrocedé unos pasos para generar tensión.", "Tirá de la cuerda hacia tu cara separando las manos al final del movimiento.", "Mantené los codos altos y las escápulas retraídas.", "Volvé lentamente a la posición inicial sin perder tensión."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Press de hombros en máquina
(
    '20000000-0001-0000-0000-000000000011'::uuid,
    'Press de hombros en máquina',
    'system',
    null,
    'front_delts',
    'shoulder_press_machine',
    'compound',
    '["side_delts", "triceps"]'::jsonb,
    '["Ajustá el asiento para que las empuñaduras queden a la altura de los hombros.", "Sentate con la espalda apoyada y los pies firmes en el suelo.", "Tomá las empuñaduras con agarre pronado.", "Empujá hacia arriba hasta extender completamente los brazos.", "Descendé controladamente hasta que las empuñaduras queden cerca de los hombros.", "Evitá despegar la espalda del respaldo."]'::jsonb,
    '["shoulder_press_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Plancha con empuje escapular
(
    '20000000-0001-0000-0000-000000000012'::uuid,
    'Plancha con empuje escapular',
    'system',
    null,
    'serratus_anterior',
    'bodyweight',
    'isolation',
    '["rectus_abdominis", "front_delts"]'::jsonb,
    '["Colocate en posición de plancha alta con las manos debajo de los hombros y el cuerpo en línea recta.", "Sin doblar los codos, empujá el suelo con las manos para separar los omóplatos (protracción escapular).", "Mantené la posición un segundo, luego permití que los omóplatos se junten nuevamente (retracción).", "Repetí el movimiento controladamente sin perder la alineación corporal.", "Evitá hundir la zona lumbar o flexionar los codos."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Push press con barra
(
    '20000000-0001-0000-0000-000000000013'::uuid,
    'Push press con barra',
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["triceps", "side_delts", "upper_traps"]'::jsonb,
    '["Parate con los pies al ancho de los hombros y sostené la barra a la altura de los hombros con agarre pronado", "Activá el core y mantené el pecho erguido con los codos ligeramente por delante de la barra", "Flexioná levemente las rodillas y usá un pequeño impulso de piernas para iniciar el movimiento", "Extendé caderas y rodillas mientras empujás la barra hacia arriba hasta extender completamente los brazos", "Descendé controladamente la barra hasta la posición inicial sobre los hombros y repetí", "Evitá arquear la espalda y mantené la cabeza en posición neutra durante el empuje"]'::jsonb,
    '["barbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Press militar tras nuca
(
    '20000000-0001-0000-0000-000000000014'::uuid,
    'Press militar tras nuca',
    'system',
    null,
    'front_delts',
    'barbell',
    'compound',
    '["triceps", "side_delts", "upper_traps"]'::jsonb,
    '["Sentate en un banco con respaldo y sostené la barra detrás de la cabeza a la altura de los hombros", "Mantené el agarre pronado un poco más ancho que el de los hombros y la espalda recta", "Empujá la barra hacia arriba hasta extender completamente los brazos sin perder la alineación cervical", "Descendé la barra con control detrás de la cabeza hasta la altura de las orejas o un poco más abajo", "No desciendas demasiado ni arquees la espalda; mantené tensión en los deltoides en todo momento"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000001", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con kettlebell
(
    '20000000-0001-0000-0000-000000000015'::uuid,
    'Press con kettlebell',
    'system',
    null,
    'front_delts',
    'kettlebell',
    'compound',
    '["triceps", "side_delts"]'::jsonb,
    '["Parate con los pies al ancho de hombros y sostené la kettlebell a la altura del hombro en posición de rack", "Mantené el core firme y el codo apuntando ligeramente hacia adelante", "Empujá la kettlebell hacia arriba hasta extender completamente el brazo sobre la cabeza", "Descendé de forma controlada hasta la posición inicial sin dejar que el codo se abra hacia afuera", "Evitá arquear la espalda baja y mantené el abdomen contraído durante todo el movimiento"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000013"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales en máquina
(
    '20000000-0001-0000-0000-000000000016'::uuid,
    'Elevaciones laterales en máquina',
    'system',
    null,
    'side_delts',
    'shoulder_press_machine',
    'isolation',
    '["front_delts"]'::jsonb,
    '["Sentate en la máquina con los brazos apoyados contra los pads laterales", "Ajustá el asiento de modo que los codos estén ligeramente por debajo de los hombros", "Elevá los brazos lateralmente hasta que queden paralelos al suelo", "Bajá controladamente sin dejar que los pesos descansen entre repeticiones", "Mantené una ligera flexión de codos y evitá elevar los hombros hacia las orejas"]'::jsonb,
    '["shoulder_press_machine"]'::jsonb,
    '["20000000-0001-0000-0000-000000000018", "20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Elevaciones frontales con disco
(
    '20000000-0001-0000-0000-000000000017'::uuid,
    'Elevaciones frontales con disco',
    'system',
    null,
    'front_delts',
    'weight_plate',
    'isolation',
    '["side_delts", "upper_traps"]'::jsonb,
    '["Parate derecho sosteniendo un disco con ambas manos frente a los muslos", "Con los brazos ligeramente flexionados, levantá el disco hacia el frente hasta la altura de los hombros", "Pausá un instante y bajá de forma controlada sin dejar que el disco toque el cuerpo", "Mantené el core activado y los hombros relajados durante todo el movimiento", "Evitá balancear el cuerpo o impulsarte con las piernas"]'::jsonb,
    '["weight_plate"]'::jsonb,
    '["20000000-0001-0000-0000-000000000022", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones laterales tumbado
(
    '20000000-0001-0000-0000-000000000018'::uuid,
    'Elevaciones laterales tumbado',
    'system',
    null,
    'side_delts',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Acostate de lado sobre un banco o colchoneta sosteniendo una mancuerna con el brazo superior", "Mantené una ligera flexión en el codo y el brazo frente al cuerpo", "Levantá el brazo hacia arriba en un arco lateral hasta que quede perpendicular al suelo", "Bajá lentamente controlando la resistencia sin apoyar el brazo completamente", "Mantené el movimiento controlado y enfocá la tensión en el deltoide lateral"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000016", "20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Face pull con banda
(
    '20000000-0001-0000-0000-000000000019'::uuid,
    'Face pull con banda',
    'system',
    null,
    'rear_delts',
    'resistance_band',
    'isolation',
    '["rhomboids", "rotator_cuff"]'::jsonb,
    '["Anclá una banda elástica a la altura del rostro y sujetá los extremos con ambas manos", "Con los brazos extendidos al frente, tirá de la banda hacia la cara separando las manos", "Llevá los codos hacia atrás y rotá externamente los hombros en el punto final", "Volvé lentamente a la posición inicial manteniendo tensión constante", "Evitá encoger los hombros y mantené el abdomen firme durante todo el movimiento"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["20000000-0001-0000-0000-000000000021"]'::jsonb,
    'weight_reps'
),

-- Press con banda elástica
(
    '20000000-0001-0000-0000-000000000020'::uuid,
    'Press con banda elástica',
    'system',
    null,
    'front_delts',
    'resistance_band',
    'compound',
    '["triceps", "chest_upper"]'::jsonb,
    '["Anclá la banda detrás tuyo a la altura del pecho y sostené los extremos con ambas manos", "Colocá un pie adelante para estabilizarte y mantené el core activado", "Empujá los brazos hacia adelante hasta extenderlos completamente", "Volvé lentamente a la posición inicial controlando la resistencia de la banda", "No dejes que la banda te tire hacia atrás ni arquees la espalda baja"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["20000000-0001-0000-0000-000000000022", "20000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Elevaciones Y-T-W
(
    '20000000-0001-0000-0000-000000000021'::uuid,
    'Elevaciones Y-T-W',
    'system',
    null,
    'rear_delts',
    'bodyweight',
    'isolation',
    '["rhomboids", "mid_traps", "rotator_cuff"]'::jsonb,
    '["Acuestate boca abajo en un banco inclinado o usá un TRX en posición horizontal", "Con los brazos extendidos, levantá en forma de Y, luego de T y finalmente de W", "En cada forma, juntá los omóplatos y mantené la contracción por un segundo", "Bajá lentamente los brazos entre cada repetición sin perder la tensión", "Controlá el movimiento y mantené la mirada al piso con el cuello neutro"]'::jsonb,
    '["bodyweight", "incline_bench"]'::jsonb,
    '["20000000-0001-0000-0000-000000000019", "20000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press de hombros alternado
(
    '20000000-0001-0000-0000-000000000022'::uuid,
    'Press de hombros alternado',
    'system',
    null,
    'front_delts',
    'dumbbell',
    'compound',
    '["triceps", "side_delts"]'::jsonb,
    '["Sentate o parate con una mancuerna en cada mano a la altura de los hombros", "Mantené el core firme y el pecho erguido durante todo el movimiento", "Empujá una mancuerna hacia arriba hasta extender completamente el brazo", "Bajá controladamente esa mancuerna mientras empujás la del otro lado", "Alterná de forma continua sin arquear la espalda ni usar impulso de piernas"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["20000000-0001-0000-0000-000000000002", "20000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_hombros 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('front_delts', 'side_delts', 'rear_delts', 'serratus_anterior');
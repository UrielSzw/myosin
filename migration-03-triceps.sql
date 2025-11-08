-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: TRÍCEPS (exercisesTriceps)
-- ============================================================================
-- Ejecutar este script después de migration-02-shoulders.sql para migrar todos los ejercicios de tríceps

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

-- Fondos en paralelas (tríceps)
(
    '30000000-0001-0000-0000-000000000001'::uuid,
    'Fondos en paralelas (tríceps)',
    'system',
    null,
    'triceps',
    'parallel_bars',
    'compound',
    '["chest_lower", "front_delts"]'::jsonb,
    '["Sujetate de las barras paralelas con los brazos extendidos y el cuerpo suspendido, piernas cruzadas detrás si es necesario para estabilidad.", "Manteniendo el torso ligeramente inclinado hacia adelante, comienza a flexionar los codos lentamente hasta que tus brazos formen un ángulo de 90 grados.", "Evitá abrir los codos hacia los costados; mantenelos apuntando hacia atrás para enfocar más los tríceps.", "Empujá hacia arriba extendiendo completamente los brazos sin trabar los codos.", "Controlá el descenso y repetí el movimiento manteniendo el cuerpo firme en todo momento."]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["30000000-0001-0000-0000-000000000008", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea (barra o cuerda)
(
    '30000000-0001-0000-0000-000000000002'::uuid,
    'Extensión de tríceps en polea (barra o cuerda)',
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate frente a la polea alta y agarrá la barra o cuerda con agarre pronado (palmas hacia abajo).", "Mantené los codos pegados al cuerpo y el torso erguido.", "Empujá la barra o cuerda hacia abajo extendiendo los codos completamente, sin mover los hombros.", "Controlá el regreso de la carga hasta que los antebrazos queden paralelos al suelo.", "Evitá balancear el cuerpo o usar impulso; el movimiento debe ser solo de los antebrazos."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Press francés con barra EZ
(
    '30000000-0001-0000-0000-000000000003'::uuid,
    'Press francés con barra EZ',
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca arriba en un banco plano y sostené la barra EZ con agarre cerrado y pronado.", "Extendé los brazos verticalmente sobre el pecho, con los codos fijos en posición.", "Bajá la barra lentamente hacia la frente flexionando solo los codos.", "Evitá mover los hombros o abrir los codos hacia los costados.", "Extendé los brazos nuevamente hasta la posición inicial, contrayendo los tríceps al final del movimiento."]'::jsonb,
    '["ez_curl_bar", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Press francés con mancuernas
(
    '30000000-0001-0000-0000-000000000004'::uuid,
    'Press francés con mancuernas',
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca arriba en un banco plano y sostené una mancuerna en cada mano con los brazos extendidos sobre el pecho.", "Mantené los codos fijos y apuntando hacia arriba durante todo el movimiento.", "Bajá las mancuernas de forma controlada hacia los costados de la cabeza.", "Evitá abrir los codos; deben permanecer quietos y cerca de la cabeza.", "Extendé los brazos hasta volver a la posición inicial contrayendo los tríceps."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps por encima de la cabeza con mancuerna
(
    '30000000-0001-0000-0000-000000000005'::uuid,
    'Extensión de tríceps por encima de la cabeza con mancuerna',
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Sentate en un banco con respaldo y sostené una mancuerna con ambas manos por un extremo, elevándola sobre la cabeza.", "Mantené los codos apuntando hacia adelante y pegados a la cabeza.", "Bajá lentamente la mancuerna detrás de la cabeza flexionando los codos.", "Evitá arquear la espalda o mover los hombros.", "Extendé los brazos hasta volver a la posición inicial contrayendo los tríceps al final del movimiento."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con cuerda en polea alta
(
    '30000000-0001-0000-0000-000000000006'::uuid,
    'Extensión de tríceps con cuerda en polea alta',
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate frente a la polea alta y agarrá la cuerda con ambas manos en agarre neutro (palmas enfrentadas).", "Mantené los codos pegados al cuerpo y el torso ligeramente inclinado hacia adelante.", "Empujá la cuerda hacia abajo separando las manos al final del recorrido para maximizar la contracción del tríceps.", "Volvé lentamente a la posición inicial controlando el movimiento.", "Evitá mover los hombros o usar impulso con el torso."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Patada de tríceps con mancuerna (kickback)
(
    '30000000-0001-0000-0000-000000000007'::uuid,
    'Patada de tríceps con mancuerna (kickback)',
    'system',
    null,
    'triceps',
    'dumbbell',
    'isolation',
    '["rear_delts"]'::jsonb,
    '["Apoyá una rodilla y una mano en un banco plano, sosteniendo una mancuerna con la otra mano.", "Mantené el torso paralelo al suelo y el codo del brazo que sostiene la mancuerna pegado al cuerpo, formando un ángulo de 90°.", "Extendé el brazo hacia atrás hasta que quede completamente recto, contrayendo el tríceps.", "Controlá el regreso de la mancuerna hasta el punto inicial sin mover el hombro.", "Evitá balancear el brazo; el movimiento debe ser únicamente del codo."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000005", "30000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Flexiones cerradas (manos juntas)
(
    '30000000-0001-0000-0000-000000000008'::uuid,
    'Flexiones cerradas (manos juntas)',
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["Colocate en posición de plancha con las manos debajo del pecho y los dedos apuntando hacia adelante, separadas a la altura de los hombros o más juntas.", "Mantené el cuerpo en línea recta desde la cabeza hasta los pies, contrayendo el core.", "Bajá el cuerpo flexionando los codos, manteniéndolos pegados al torso.", "Descendé hasta que el pecho quede cerca del suelo y luego empujá hacia arriba extendiendo los brazos.", "Evitá arquear la espalda o abrir los codos hacia los costados."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en máquina
(
    '30000000-0001-0000-0000-000000000009'::uuid,
    'Extensión de tríceps en máquina',
    'system',
    null,
    'triceps',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["Ajustá el asiento de la máquina para que las empuñaduras queden alineadas con tus codos.", "Sujetá las manijas con agarre neutro o pronado según el modelo de máquina.", "Mantené los codos fijos al costado del cuerpo y empujá hacia abajo o hacia adelante extendiendo los brazos completamente.", "Controlá el regreso del peso hasta la posición inicial sin perder la tensión en los tríceps.", "Evitá mover los hombros o balancear el torso."]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con banda elástica
(
    '30000000-0001-0000-0000-000000000010'::uuid,
    'Extensión de tríceps con banda elástica',
    'system',
    null,
    'triceps',
    'resistance_band',
    'isolation',
    '["forearms"]'::jsonb,
    '["Anclá la banda elástica en una superficie firme a la altura del pecho o superior.", "Sujetá los extremos con agarre pronado y parate con los codos pegados al cuerpo.", "Extendé los brazos hacia abajo hasta que queden rectos, contrayendo los tríceps.", "Volvé lentamente a la posición inicial controlando la tensión de la banda.", "Mantené el torso erguido y los codos fijos durante todo el movimiento."]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en banco (bench dips)
(
    '30000000-0001-0000-0000-000000000011'::uuid,
    'Extensión de tríceps en banco (bench dips)',
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["front_delts", "chest_lower"]'::jsonb,
    '["Colocá tus manos sobre un banco detrás tuyo con los dedos apuntando hacia adelante y las piernas extendidas frente a vos", "Apoyá los talones en el suelo y mantené el core firme", "Flexioná los codos lentamente bajando el cuerpo hasta que los brazos queden aproximadamente a 90°", "Empujá con los tríceps para volver a la posición inicial con los brazos completamente extendidos", "No encorvés la espalda ni dejes caer los hombros; mantené los codos cerca del torso"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000001", "30000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea inversa (agarre supino)
(
    '30000000-0001-0000-0000-000000000012'::uuid,
    'Extensión de tríceps en polea inversa (agarre supino)',
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Colocá la barra EZ en la polea alta con agarre supino y sostenela con ambas manos", "Parate derecho con los pies al ancho de hombros y el core firme", "Flexioná ligeramente los codos y mantené los brazos pegados al torso", "Extendé los codos hacia abajo hasta bloquear ligeramente los brazos", "Volvé controladamente a la posición inicial sin mover los codos"]'::jsonb,
    '["cable_machine", "ez_curl_bar"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Press cerrado con barra EZ
(
    '30000000-0001-0000-0000-000000000013'::uuid,
    'Press cerrado con barra EZ',
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["Acuestate en un banco plano con los pies firmes en el suelo", "Sostené la barra EZ con un agarre cerrado y pronado a la altura del pecho", "Bajá la barra controladamente hasta tocar la parte media del pecho", "Empujá hacia arriba usando principalmente los tríceps hasta extender los brazos", "Mantené los codos cerca del torso y no arquées la espalda"]'::jsonb,
    '["ez_curl_bar", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000004", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con kettlebell
(
    '30000000-0001-0000-0000-000000000014'::uuid,
    'Extensión de tríceps con kettlebell',
    'system',
    null,
    'triceps',
    'kettlebell',
    'isolation',
    '[]'::jsonb,
    '["Parate o sentate con la espalda recta y sostené la kettlebell con ambas manos detrás de la cabeza", "Mantené los codos apuntando hacia adelante y cerca de la cabeza", "Extendé los brazos hacia arriba hasta bloquear ligeramente los codos", "Descendé lentamente la kettlebell detrás de la cabeza controlando el movimiento", "No balancees el cuerpo ni abras los codos hacia afuera"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps con banda en suelo
(
    '30000000-0001-0000-0000-000000000015'::uuid,
    'Extensión de tríceps con banda en suelo',
    'system',
    null,
    'triceps',
    'resistance_band',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca arriba sosteniendo la banda con ambas manos, pasando por detrás de la cabeza", "Flexioná los codos y mantenelos apuntando hacia el techo", "Extendé los brazos hacia arriba tensando la banda", "Bajá lentamente a la posición inicial sin perder tensión", "Mantené los hombros relajados y el core firme durante todo el movimiento"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["30000000-0001-0000-0000-000000000014", "30000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Flexiones diamante
(
    '30000000-0001-0000-0000-000000000016'::uuid,
    'Flexiones diamante',
    'system',
    null,
    'triceps',
    'bodyweight',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["Colocate en posición de plancha con las manos juntas formando un diamante bajo el pecho", "Mantené el core firme y la espalda recta", "Flexioná los codos para bajar el pecho hacia las manos", "Empujá hacia arriba usando los tríceps hasta extender los brazos", "No dejes que las caderas se hundan ni arquées la espalda"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003", "30000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en polea a una mano
(
    '30000000-0001-0000-0000-000000000017'::uuid,
    'Extensión de tríceps en polea a una mano',
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["Sostené el mango de la polea con una mano, parate con los pies al ancho de hombros", "Flexioná el codo y mantené el brazo pegado al torso", "Extendé el brazo hacia abajo hasta bloquear ligeramente el codo", "Volvé lentamente a la posición inicial manteniendo tensión en el tríceps", "No balancees el torso ni abras el codo durante el movimiento"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["30000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Press francés en banco inclinado
(
    '30000000-0001-0000-0000-000000000018'::uuid,
    'Press francés en banco inclinado',
    'system',
    null,
    'triceps',
    'ez_curl_bar',
    'isolation',
    '["front_delts"]'::jsonb,
    '["Acostate en un banco inclinado con la barra EZ sobre la frente y agarre pronado", "Flexioná los codos manteniendo los brazos perpendiculares al suelo", "Extendé los codos hacia arriba hasta bloquear ligeramente los brazos", "Bajá lentamente la barra controlando el movimiento", "Mantené los codos quietos y cerca del cuerpo en todo momento"]'::jsonb,
    '["ez_curl_bar", "incline_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps tumbado en polea baja
(
    '30000000-0001-0000-0000-000000000019'::uuid,
    'Extensión de tríceps tumbado en polea baja',
    'system',
    null,
    'triceps',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca arriba en un banco plano con el mango de la polea baja en ambas manos", "Flexioná los codos y mantenelos cerca del torso", "Extendé los brazos hacia arriba hasta bloquear ligeramente los codos", "Descendé controladamente sin que los codos se abran hacia afuera", "Mantené la espalda apoyada y el core firme durante todo el movimiento"]'::jsonb,
    '["cable_machine", "flat_bench"]'::jsonb,
    '["30000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Extensión de tríceps en máquina de empuje vertical
(
    '30000000-0001-0000-0000-000000000020'::uuid,
    'Extensión de tríceps en máquina de empuje vertical',
    'system',
    null,
    'triceps',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina ajustando el asiento a la altura de los codos", "Sostené las manijas con agarre neutro o pronado según la máquina", "Extendé los brazos hasta bloquear ligeramente los codos", "Volvé controladamente a la posición inicial sin perder tensión", "Mantené la espalda recta y los hombros relajados durante todo el movimiento"]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_triceps 
FROM exercises 
WHERE source = 'system' AND main_muscle_group = 'triceps';
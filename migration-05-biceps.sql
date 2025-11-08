-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: BÍCEPS (exercisesBiceps)
-- ============================================================================
-- Ejecutar este script después de migration-04-back.sql para migrar todos los ejercicios de bíceps

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

-- Curl de bíceps con barra
(
    '50000000-0001-0000-0000-000000000001'::uuid,
    'Curl de bíceps con barra',
    'system',
    null,
    'biceps',
    'barbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate derecho con los pies al ancho de los hombros y la barra sostenida con agarre supino (palmas hacia arriba)", "Dejá los codos pegados al torso y los brazos extendidos completamente al inicio", "Flexioná los codos levantando la barra de forma controlada hasta que los antebrazos estén verticales", "Evitá mover los hombros o balancear el cuerpo; el movimiento debe ser solo de los codos", "Bajá lentamente la barra hasta la posición inicial, controlando la fase excéntrica"]'::jsonb,
    '["barbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl de bíceps con mancuernas
(
    '50000000-0001-0000-0000-000000000002'::uuid,
    'Curl de bíceps con mancuernas',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate con una mancuerna en cada mano, brazos extendidos y palmas mirando hacia adelante", "Mantené los codos cerca del torso y la espalda recta", "Flexioná ambos codos simultáneamente elevando las mancuernas hacia los hombros", "Contraé los bíceps en la parte alta y luego bajá lentamente las mancuernas a la posición inicial"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000004", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl alternado con supinación
(
    '50000000-0001-0000-0000-000000000003'::uuid,
    'Curl alternado con supinación',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["De pie, sostené una mancuerna en cada mano con las palmas mirando hacia el cuerpo (agarre neutro)", "Elevá una mancuerna girando la muñeca progresivamente hasta que la palma mire hacia arriba (supinación)", "Contraé el bíceps al llegar arriba y luego bajá la mancuerna lentamente mientras girás la muñeca de nuevo a neutro", "Alterná los brazos en cada repetición manteniendo los codos pegados al torso"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl tipo martillo
(
    '50000000-0001-0000-0000-000000000004'::uuid,
    'Curl tipo martillo',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate con los pies al ancho de los hombros y una mancuerna en cada mano con agarre neutro (palmas enfrentadas)", "Con los codos pegados al torso, flexioná ambos codos simultáneamente sin girar las muñecas", "Subí hasta que las mancuernas estén a la altura de los hombros y contraé los bíceps", "Bajá de forma controlada hasta la posición inicial sin soltar la tensión"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl en banco predicador (Scott)
(
    '50000000-0001-0000-0000-000000000005'::uuid,
    'Curl en banco predicador (Scott)',
    'system',
    null,
    'biceps',
    'ez_curl_bar',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sentate en el banco predicador con los brazos apoyados completamente sobre el pad y la barra EZ sostenida con agarre supino", "Extendé los codos lentamente hasta casi estirarlos, sin bloquearlos completamente", "Flexioná los codos levantando la barra hasta que los antebrazos estén verticales", "Contraé los bíceps al final del movimiento y luego bajá lentamente hasta la posición inicial"]'::jsonb,
    '["ez_curl_bar", "preacher_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000005", "50000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Curl en polea baja
(
    '50000000-0001-0000-0000-000000000006'::uuid,
    'Curl en polea baja',
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Colocate frente a una polea baja con barra recta o cuerda y agarre supino (palmas hacia arriba)", "Mantené los codos pegados al torso y la espalda recta", "Flexioná los codos para elevar la barra o cuerda hacia los hombros sin mover los hombros", "Bajá lentamente el peso hasta la extensión casi completa de los brazos"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000001", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl con banda elástica
(
    '50000000-0001-0000-0000-000000000007'::uuid,
    'Curl con banda elástica',
    'system',
    null,
    'biceps',
    'resistance_band',
    'isolation',
    '["forearms"]'::jsonb,
    '["Parate sobre el centro de la banda con los pies al ancho de los hombros y sostené los extremos con las palmas hacia adelante", "Con los codos pegados al torso, flexioná los brazos elevando las manos hacia los hombros", "Mantené la contracción un segundo arriba y luego bajá de forma controlada", "Evitá inclinar el torso o usar impulso"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl concentrado
(
    '50000000-0001-0000-0000-000000000008'::uuid,
    'Curl concentrado',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Sentate en un banco con las piernas separadas y una mancuerna en una mano", "Apoyá el codo del brazo que trabaja sobre la parte interna del muslo del mismo lado", "Dejá el brazo extendido hacia abajo y luego flexioná el codo llevando la mancuerna hacia el hombro", "Contraé el bíceps arriba y bajá lentamente controlando el movimiento"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl en máquina
(
    '50000000-0001-0000-0000-000000000009'::uuid,
    'Curl en máquina',
    'system',
    null,
    'biceps',
    'seated_row_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sentate en la máquina de curls y ajustá el asiento para que los codos queden alineados con el eje de rotación", "Sostené las manijas con agarre supino y brazos extendidos", "Flexioná los codos levantando las manijas hacia los hombros mientras exhalás", "Descendé lentamente hasta la posición inicial controlando la tensión"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Curl inverso (para antebrazos)
(
    '50000000-0001-0000-0000-000000000010'::uuid,
    'Curl inverso (para antebrazos)',
    'system',
    null,
    'forearms',
    'ez_curl_bar',
    'isolation',
    '["biceps"]'::jsonb,
    '["Parate con una barra EZ sostenida con agarre prono (palmas hacia abajo)", "Mantené los codos pegados al torso y la espalda recta", "Flexioná los codos elevando la barra hacia los hombros sin mover los brazos superiores", "Bajá lentamente la barra a la posición inicial controlando el peso"]'::jsonb,
    '["ez_curl_bar"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl de muñeca con barra (flexión de antebrazos)
(
    '50000000-0001-0000-0000-000000000011'::uuid,
    'Curl de muñeca con barra (flexión de antebrazos)',
    'system',
    null,
    'forearms',
    'barbell',
    'isolation',
    '[]'::jsonb,
    '["Sentate en un banco con los antebrazos apoyados sobre los muslos o el banco, palmas hacia arriba sosteniendo la barra", "Dejá que la barra ruede hasta la punta de los dedos para estirar completamente los antebrazos", "Flexioná las muñecas llevando la barra hacia arriba lo más alto posible", "Bajá lentamente a la posición inicial y repetí"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Curl de muñeca inverso (extensión)
(
    '50000000-0001-0000-0000-000000000012'::uuid,
    'Curl de muñeca inverso (extensión)',
    'system',
    null,
    'forearms',
    'barbell',
    'isolation',
    '[]'::jsonb,
    '["Sentate con los antebrazos apoyados en los muslos o en un banco, con las palmas hacia abajo sosteniendo la barra", "Mantené los codos fijos y extendé las muñecas levantando la barra hacia arriba", "Descendé lentamente controlando el movimiento hasta volver al punto inicial"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Curl con cable en polea alta
(
    '50000000-0001-0000-0000-000000000013'::uuid,
    'Curl con cable en polea alta',
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Colocate frente a la polea alta con los pies al ancho de hombros y el core firme", "Sostené el mango con agarre supino y brazos extendidos hacia abajo", "Flexioná los codos llevando el mango hacia los hombros sin mover los hombros", "Contraé los bíceps en la parte superior y mantené 1 segundo", "Descendé controladamente hasta estirar los brazos completamente", "No balancees el torso ni uses impulso durante el movimiento"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl tipo drag (arrastrado con barra)
(
    '50000000-0001-0000-0000-000000000014'::uuid,
    'Curl tipo drag (arrastrado con barra)',
    'system',
    null,
    'biceps',
    'barbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sostené la barra con agarre supino al ancho de hombros y pies firmes", "Manteniendo la barra cerca del torso, elevála arrastrándola por el cuerpo", "Flexioná los codos hasta contraer los bíceps en la parte superior", "Bajá lentamente la barra controlando el movimiento", "No balancees la espalda ni levantes los hombros"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl en predicador con mancuerna
(
    '50000000-0001-0000-0000-000000000015'::uuid,
    'Curl en predicador con mancuerna',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Apoyá el brazo sobre el banco predicador con la mancuerna en mano y agarre supino", "Mantené el torso recto y core firme", "Flexioná el codo llevando la mancuerna hacia el hombro", "Contraé el bíceps arriba 1 segundo", "Descendé lentamente hasta estirar completamente el brazo", "No balancees el torso ni levantés el hombro"]'::jsonb,
    '["dumbbell", "preacher_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Curl con kettlebell
(
    '50000000-0001-0000-0000-000000000016'::uuid,
    'Curl con kettlebell',
    'system',
    null,
    'biceps',
    'kettlebell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sostené la kettlebell con agarre supino y brazos extendidos a los costados", "Parate con pies al ancho de hombros y core firme", "Flexioná los codos levantando la kettlebell hacia el hombro", "Contraé el bíceps en la parte superior y mantené 1 segundo", "Bajá controladamente hasta estirar completamente los brazos", "No balancees el torso ni uses impulso"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000006", "50000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Curl a un brazo en polea baja
(
    '50000000-0001-0000-0000-000000000017'::uuid,
    'Curl a un brazo en polea baja',
    'system',
    null,
    'biceps',
    'cable_machine',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sostené el mango de la polea baja con una mano, pies firmes y torso recto", "Flexioná el codo elevando el mango hacia el hombro", "Contraé el bíceps en la parte superior 1 segundo", "Descendé lentamente sin mover el hombro ni torso", "Repetí para el otro brazo"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["50000000-0001-0000-0000-000000000007", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Curl con banda en suelo
(
    '50000000-0001-0000-0000-000000000018'::uuid,
    'Curl con banda en suelo',
    'system',
    null,
    'biceps',
    'resistance_band',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca arriba sobre el suelo sujetando la banda con ambas manos y pies firmes", "Flexioná los codos llevando las manos hacia los hombros", "Contraé los bíceps arriba 1 segundo", "Bajá controladamente hasta estirar los brazos manteniendo tensión en la banda", "No arquees la espalda ni uses impulso"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl Zottman (supinación + pronación)
(
    '50000000-0001-0000-0000-000000000019'::uuid,
    'Curl Zottman (supinación + pronación)',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Sostené una mancuerna en cada mano con agarre supino y brazos extendidos a los costados", "Flexioná los codos elevando las mancuernas hacia los hombros", "Contraé los bíceps en la parte superior 1 segundo", "Girá las muñecas a pronación y descendé lentamente las mancuernas hasta estirar los brazos", "Mantené torso recto y core firme durante todo el movimiento"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Curl de concentración con apoyo en muslo
(
    '50000000-0001-0000-0000-000000000020'::uuid,
    'Curl de concentración con apoyo en muslo',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Sentate en un banco y apoyá el codo del brazo que trabajás sobre el muslo interno", "Sostené la mancuerna con agarre supino y brazo extendido", "Flexioná el codo llevando la mancuerna hacia el hombro", "Contraé el bíceps en la parte superior 1 segundo", "Bajá lentamente sin mover el codo ni el hombro"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000002", "50000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Curl isométrico (sosteniendo mitad del recorrido)
(
    '50000000-0001-0000-0000-000000000021'::uuid,
    'Curl isométrico (sosteniendo mitad del recorrido)',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Sostené una mancuerna con agarre supino y elevá el brazo hasta la mitad del recorrido", "Mantené esa posición 10-30 segundos con bíceps contraído", "Controlá la respiración y mantené torso recto y core firme", "Volvé lentamente a la posición inicial", "No balancees el brazo ni uses impulso"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["50000000-0001-0000-0000-000000000022", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_time'
),

-- Curl en TRX o suspensión
(
    '50000000-0001-0000-0000-000000000022'::uuid,
    'Curl en TRX o suspensión',
    'system',
    null,
    'biceps',
    'suspension_trainer',
    'isolation',
    '["forearms"]'::jsonb,
    '["Agarrá las asas del TRX con agarre supino y pies firmes en el suelo", "Inclinate hacia atrás manteniendo el cuerpo recto y core firme", "Flexioná los codos llevando las manos hacia la frente", "Contraé los bíceps en la parte superior 1 segundo", "Descendé lentamente hasta estirar los brazos sin perder la postura"]'::jsonb,
    '["suspension_trainer"]'::jsonb,
    '["50000000-0001-0000-0000-000000000023", "50000000-0001-0000-0000-000000000013"]'::jsonb,
    'weight_reps'
),

-- Curl inclinado con mancuernas
(
    '50000000-0001-0000-0000-000000000023'::uuid,
    'Curl inclinado con mancuernas',
    'system',
    null,
    'biceps',
    'dumbbell',
    'isolation',
    '["forearms"]'::jsonb,
    '["Acuestate boca arriba en un banco inclinado con la espalda apoyada y los pies firmes en el suelo", "Sostené una mancuerna en cada mano con agarre supino, dejando los brazos colgando hacia atrás", "Mantené los codos fijos y el core firme durante todo el movimiento", "Flexioná los codos levantando las mancuernas hacia los hombros de forma controlada", "Contraé los bíceps en la parte superior 1 segundo", "Descendé lentamente las mancuernas hasta estirar completamente los brazos, sintiendo el estiramiento en la cabeza larga del bíceps", "No balancees el torso ni movas los hombros durante el movimiento"]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["50000000-0001-0000-0000-000000000008", "50000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_biceps 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('biceps', 'forearms');
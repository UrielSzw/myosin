-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: PIERNAS (exercisesLegs)
-- ============================================================================
-- Ejecutar este script después de migration-06-core.sql para migrar todos los ejercicios de piernas

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

-- Sentadilla con barra
(
    '70000000-0001-0000-0000-000000000001'::uuid,
    'Sentadilla con barra',
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings", "erector_spinae"]'::jsonb,
    '["Parate con los pies al ancho de hombros, la barra apoyada sobre trapecios, agarre pronado", "Retracta los omóplatos y mantené el core firme", "Flexioná rodillas y caderas descendiendo hasta que los muslos queden paralelos al suelo", "Elevá el torso contrayendo glúteos y cuádriceps hasta la posición inicial", "Evita que las rodillas se vayan hacia adentro o que la espalda se redondee"]'::jsonb,
    '["barbell", "flat_bench", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000005", "70000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Sentadilla frontal
(
    '70000000-0001-0000-0000-000000000002'::uuid,
    'Sentadilla frontal',
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings", "erector_spinae"]'::jsonb,
    '["Colocá la barra frente a los hombros apoyada sobre deltoides anteriores, codos elevados", "Parate con pies al ancho de hombros y core activado", "Flexioná rodillas y caderas descendiendo controladamente hasta que los muslos queden paralelos al suelo", "Elevá el torso y piernas contrayendo cuádriceps y glúteos hasta la posición inicial", "Mantené la espalda recta y codos elevados durante todo el movimiento"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Sentadilla goblet
(
    '70000000-0001-0000-0000-000000000003'::uuid,
    'Sentadilla goblet',
    'system',
    null,
    'quads',
    'dumbbell',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Sostén una mancuerna con ambas manos frente al pecho, codos apuntando hacia abajo", "Parate con pies al ancho de hombros y core activado", "Flexioná rodillas y caderas descendiendo hasta que los muslos queden paralelos al suelo", "Elevá el torso contrayendo glúteos y cuádriceps hasta la posición inicial", "Mantené la espalda recta y el peso cercano al pecho durante todo el movimiento"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000002", "70000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Sentadilla en máquina Smith
(
    '70000000-0001-0000-0000-000000000004'::uuid,
    'Sentadilla en máquina Smith',
    'system',
    null,
    'quads',
    'smith_machine',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Colocate bajo la barra de la Smith Machine apoyando la barra sobre trapecios", "Parate con pies al ancho de hombros y core activado", "Flexioná rodillas y caderas descendiendo hasta que los muslos queden paralelos al suelo", "Elevá el torso contrayendo glúteos y cuádriceps hasta la posición inicial", "Evita inclinar demasiado el torso hacia adelante o arquear la espalda"]'::jsonb,
    '["smith_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Prensa de piernas
(
    '70000000-0001-0000-0000-000000000005'::uuid,
    'Prensa de piernas',
    'system',
    null,
    'quads',
    'leg_press',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Sentate en la prensa con pies al ancho de hombros sobre la plataforma", "Desbloqueá la seguridad manteniendo core activado", "Flexioná rodillas y caderas descendiendo la plataforma controladamente", "Elevá la plataforma extendiendo piernas hasta la posición inicial sin bloquear las rodillas", "Mantené la espalda apoyada en el respaldo durante todo el movimiento"]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Zancadas (lunges)
(
    '70000000-0001-0000-0000-000000000006'::uuid,
    'Zancadas (lunges)',
    'system',
    null,
    'quads',
    'bodyweight',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Parate con pies al ancho de caderas y manos a los lados o con mancuernas", "Dá un paso largo hacia adelante y flexioná ambas rodillas hasta 90°", "Empujá con la pierna delantera para volver a la posición inicial", "Alterná piernas controlando el torso recto y el core activado", "Evita que la rodilla delantera supere los dedos del pie"]'::jsonb,
    '["bodyweight", "dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000007", "70000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Zancadas búlgaras
(
    '70000000-0001-0000-0000-000000000007'::uuid,
    'Zancadas búlgaras',
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["quads", "hamstrings"]'::jsonb,
    '["Colocate de espaldas a un banco y apoyá el pie trasero sobre él", "Parate con la pierna delantera firmemente apoyada y core activado", "Flexioná la rodilla delantera descendiendo hasta 90°", "Elevá el torso y pierna delantera hasta la posición inicial contrayendo glúteos y cuádriceps", "Mantené el torso recto y evita que la rodilla delantera pase los dedos del pie"]'::jsonb,
    '["bodyweight", "dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000006", "70000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Step-up (subida al banco)
(
    '70000000-0001-0000-0000-000000000008'::uuid,
    'Step-up (subida al banco)',
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["quads", "hamstrings"]'::jsonb,
    '["Parate frente a un banco estable con pies al ancho de caderas y mancuernas en manos opcional", "Apoyá un pie sobre el banco y elevá el torso empujando con la pierna de apoyo", "Descendé controladamente hasta el suelo y alterná piernas", "Mantené el core activado y torso recto durante todo el movimiento"]'::jsonb,
    '["bodyweight", "dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000006", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Peso muerto rumano
(
    '70000000-0001-0000-0000-000000000009'::uuid,
    'Peso muerto rumano',
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["Parate con pies al ancho de hombros y barra frente a los muslos, agarre pronado", "Flexioná ligeramente rodillas y bajá la barra deslizando por los muslos manteniendo espalda recta", "Elevá el torso contrayendo femorales y glúteos hasta la posición inicial", "Evita redondear la espalda durante todo el movimiento"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000018", "40000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Curl de piernas acostado en máquina
(
    '70000000-0001-0000-0000-000000000010'::uuid,
    'Curl de piernas acostado en máquina',
    'system',
    null,
    'hamstrings',
    'leg_curl_machine',
    'isolation',
    '[]'::jsonb,
    '["Acostate boca abajo en la máquina con tobillos apoyados en el rodillo", "Flexioná las rodillas llevando los talones hacia glúteos", "Volvé lentamente a la posición inicial controlando la fase excéntrica"]'::jsonb,
    '["leg_curl_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Curl de piernas sentado
(
    '70000000-0001-0000-0000-000000000011'::uuid,
    'Curl de piernas sentado',
    'system',
    null,
    'hamstrings',
    'leg_curl_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina con el respaldo recto y tobillos apoyados en el rodillo", "Flexioná las rodillas llevando los talones hacia glúteos de forma controlada", "Volvé lentamente a la posición inicial sin perder la tensión en femorales"]'::jsonb,
    '["leg_curl_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000012", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Extensión de piernas en máquina
(
    '70000000-0001-0000-0000-000000000012'::uuid,
    'Extensión de piernas en máquina',
    'system',
    null,
    'quads',
    'leg_extension_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina con espalda apoyada y rodillas alineadas con el eje del aparato", "Extendé las piernas hasta quedar completamente rectas contrayendo cuádriceps", "Descendé lentamente a la posición inicial controlando la fase excéntrica"]'::jsonb,
    '["leg_extension_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000013", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Hip Thrust (empuje de cadera con barra)
(
    '70000000-0001-0000-0000-000000000013'::uuid,
    'Hip Thrust (empuje de cadera con barra)',
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["hamstrings", "lower_back"]'::jsonb,
    '["Apoyá la parte superior de la espalda en un banco y la barra sobre caderas", "Parate con pies firmes en el suelo al ancho de hombros", "Elevá las caderas contrayendo glúteos hasta que el torso y muslos formen línea recta", "Descendé lentamente controlando la fase excéntrica sin tocar el suelo con glúteos", "Mantené el core activado y evitate hiperextender la zona lumbar"]'::jsonb,
    '["barbell", "flat_bench", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Puente de glúteos (glute bridge)
(
    '70000000-0001-0000-0000-000000000014'::uuid,
    'Puente de glúteos (glute bridge)',
    'system',
    null,
    'glutes',
    'bodyweight',
    'compound',
    '["hamstrings", "lower_back"]'::jsonb,
    '["Acostate boca arriba con pies apoyados en el suelo y rodillas flexionadas", "Elevá las caderas contrayendo glúteos hasta alinear torso y muslos", "Descendé controladamente sin que los glúteos toquen el suelo", "Mantené el core firme durante todo el movimiento"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Abducción de cadera en máquina
(
    '70000000-0001-0000-0000-000000000015'::uuid,
    'Abducción de cadera en máquina',
    'system',
    null,
    'hip_abductors',
    'leg_press',
    'isolation',
    '["glutes"]'::jsonb,
    '["Sentate en la máquina con piernas apoyadas en los soportes y espalda recta", "Separá las piernas contrayendo abductores y glúteos", "Volvé lentamente a la posición inicial controlando la fase excéntrica", "Evita balancear el torso durante el movimiento"]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Abducción de cadera con banda
(
    '70000000-0001-0000-0000-000000000016'::uuid,
    'Abducción de cadera con banda',
    'system',
    null,
    'hip_abductors',
    'resistance_band',
    'isolation',
    '["glutes"]'::jsonb,
    '["Colocá una banda elástica alrededor de las rodillas o tobillos y parate con pies al ancho de caderas", "Separá lateralmente las piernas contrayendo abductores y glúteos", "Volvé lentamente a la posición inicial controlando la fase excéntrica", "Mantené el core firme y espalda recta durante todo el movimiento"]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["70000000-0001-0000-0000-000000000009", "70000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Adducción de cadera en máquina
(
    '70000000-0001-0000-0000-000000000017'::uuid,
    'Adducción de cadera en máquina',
    'system',
    null,
    'hip_adductors',
    'leg_press',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina con piernas abiertas apoyadas en los soportes y espalda recta", "Juntá las piernas contrayendo aductores internos", "Volvé lentamente a la posición inicial controlando la fase excéntrica", "Evita balancear el torso durante el movimiento"]'::jsonb,
    '["leg_press", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Peso muerto a una pierna
(
    '70000000-0001-0000-0000-000000000018'::uuid,
    'Peso muerto a una pierna',
    'system',
    null,
    'hamstrings',
    'dumbbell',
    'compound',
    '["glutes", "erector_spinae"]'::jsonb,
    '["Parate sobre una pierna con mancuerna en cada mano frente a los muslos", "Flexioná cadera descendiendo el torso y extendiendo la pierna libre hacia atrás", "Elevá torso y pierna libre hasta la posición inicial contrayendo glúteos y femorales", "Mantené la espalda recta y core activado durante todo el movimiento"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["70000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de talones de pie (pantorrillas)
(
    '70000000-0001-0000-0000-000000000019'::uuid,
    'Elevaciones de talones de pie (pantorrillas)',
    'system',
    null,
    'calves',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["Parate con pies al ancho de caderas, opcionalmente sosteniendo mancuernas", "Elevá talones contrayendo pantorrillas hasta punta de pies", "Descendé lentamente a la posición inicial controlando la fase excéntrica", "Mantené torso recto y core firme durante todo el movimiento"]'::jsonb,
    '["bodyweight", "dumbbell", "smith_machine"]'::jsonb,
    '["70000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de talones sentado
(
    '70000000-0001-0000-0000-000000000020'::uuid,
    'Elevaciones de talones sentado',
    'system',
    null,
    'calves',
    'seated_row_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate con la punta de los pies apoyada en la plataforma y peso sobre los muslos", "Elevá talones contrayendo pantorrillas hasta punta de pies", "Descendé lentamente a la posición inicial controlando la fase excéntrica", "Mantené torso recto y core firme durante todo el movimiento"]'::jsonb,
    '["seated_row_machine", "weight_plate"]'::jsonb,
    '["70000000-0001-0000-0000-000000000019"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Hack
(
    '70000000-0001-0000-0000-000000000021'::uuid,
    'Sentadilla Hack',
    'system',
    null,
    'quads',
    'leg_press',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Colocate en la máquina hack squat con los hombros apoyados y los pies firmes sobre la plataforma.", "Ajustá la posición de los pies al ancho de los hombros y mantené la espalda apoyada en el respaldo.", "Liberá los seguros y descendé flexionando las rodillas controladamente hasta que los muslos queden paralelos al suelo.", "Empujá con los talones para volver a la posición inicial sin bloquear completamente las rodillas.", "Mantené el core firme y las rodillas alineadas con los pies durante todo el movimiento."]'::jsonb,
    '["leg_press"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Sissy
(
    '70000000-0001-0000-0000-000000000022'::uuid,
    'Sentadilla Sissy',
    'system',
    null,
    'quads',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Parate derecho con los pies al ancho de los hombros y el cuerpo erguido.", "Sostené un punto fijo o apoyo si necesitás equilibrio.", "Inclinate lentamente hacia atrás manteniendo el cuerpo en línea recta desde las rodillas hasta los hombros.", "Descendé controlando la flexión de las rodillas y sentí la tensión en los cuádriceps.", "Empujá hacia arriba volviendo a la posición inicial manteniendo el core activado."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Zercher
(
    '70000000-0001-0000-0000-000000000023'::uuid,
    'Sentadilla Zercher',
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "rectus_abdominis"]'::jsonb,
    '["Colocá la barra en la parte interior de los codos y sostenela cerca del pecho.", "Parate con los pies al ancho de los hombros y el pecho erguido.", "Descendé flexionando las rodillas y caderas hasta que los muslos queden paralelos al suelo.", "Mantené la barra pegada al cuerpo y la espalda recta.", "Empujá con los talones para volver a la posición inicial."]'::jsonb,
    '["barbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con Salto
(
    '70000000-0001-0000-0000-000000000024'::uuid,
    'Sentadilla con Salto',
    'system',
    null,
    'quads',
    'bodyweight',
    'compound',
    '["glutes", "calves"]'::jsonb,
    '["Parate con los pies al ancho de los hombros y el core firme.", "Descendé en una sentadilla controlada hasta que los muslos estén paralelos al suelo.", "Impulsate hacia arriba saltando explosivamente y extendiendo completamente las piernas.", "Aterrizá suavemente absorbiendo el impacto con las rodillas flexionadas.", "Repetí el movimiento manteniendo el ritmo controlado."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000013", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con Banda Elástica
(
    '70000000-0001-0000-0000-000000000025'::uuid,
    'Sentadilla con Banda Elástica',
    'system',
    null,
    'quads',
    'resistance_band',
    'compound',
    '["glutes"]'::jsonb,
    '["Colocá la banda elástica alrededor de las rodillas o los hombros según la variante.", "Parate con los pies separados al ancho de los hombros.", "Descendé flexionando las rodillas y empujando las caderas hacia atrás.", "Mantené la tensión de la banda durante todo el movimiento.", "Empujá con los talones para volver a la posición inicial."]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla Sumo con Mancuerna
(
    '70000000-0001-0000-0000-000000000026'::uuid,
    'Sentadilla Sumo con Mancuerna',
    'system',
    null,
    'glutes',
    'dumbbell',
    'compound',
    '["quads", "hamstrings", "hip_adductors"]'::jsonb,
    '["Sostené una mancuerna con ambas manos frente al cuerpo.", "Adoptá una postura amplia con los pies orientados ligeramente hacia afuera.", "Descendé manteniendo la espalda recta y el pecho erguido.", "Bajá hasta que las caderas queden a la altura de las rodillas.", "Empujá con los talones para volver a la posición inicial contrayendo glúteos al final."]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["70000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000028"]'::jsonb,
    'weight_reps'
),

-- Sentadilla a Caja
(
    '70000000-0001-0000-0000-000000000027'::uuid,
    'Sentadilla a Caja',
    'system',
    null,
    'quads',
    'barbell',
    'compound',
    '["glutes", "hamstrings"]'::jsonb,
    '["Colocá un banco o caja detrás tuyo a una altura media.", "Con la barra sobre los trapecios, parate con los pies al ancho de los hombros.", "Descendé lentamente hasta sentarte suavemente en la caja sin relajar completamente los músculos.", "Empujá con los talones para ponerte de pie nuevamente.", "Mantené el core firme y la espalda recta durante todo el movimiento."]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto Sumo
(
    '70000000-0001-0000-0000-000000000028'::uuid,
    'Peso Muerto Sumo',
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["quads", "hamstrings", "erector_spinae"]'::jsonb,
    '["Parate con los pies más anchos que los hombros y las puntas hacia afuera.", "Agarrá la barra con un agarre estrecho entre las piernas.", "Mantené la espalda recta y el pecho alto.", "Empujá con las piernas para levantar la barra, extendiendo caderas y rodillas al mismo tiempo.", "Descendé controladamente manteniendo la barra cerca del cuerpo."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000029"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto con Trap Bar
(
    '70000000-0001-0000-0000-000000000029'::uuid,
    'Peso Muerto con Trap Bar',
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["quads", "hamstrings", "erector_spinae"]'::jsonb,
    '["Parate dentro de la trap bar con los pies al ancho de los hombros.", "Agarrá las manijas laterales manteniendo el pecho erguido y la espalda recta.", "Empujá el suelo con los talones y extendé las piernas y caderas simultáneamente.", "Evitá redondear la espalda durante el ascenso.", "Bajá la barra controladamente hasta el suelo repitiendo el movimiento."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000030"]'::jsonb,
    'weight_reps'
),

-- Peso Muerto con Kettlebell
(
    '70000000-0001-0000-0000-000000000030'::uuid,
    'Peso Muerto con Kettlebell',
    'system',
    null,
    'glutes',
    'kettlebell',
    'compound',
    '["hamstrings", "erector_spinae"]'::jsonb,
    '["Colocá una kettlebell entre tus pies con una postura al ancho de los hombros.", "Flexioná caderas y rodillas bajando el torso con la espalda recta.", "Agarrá la kettlebell y extendé las caderas para ponerte de pie.", "Descendé de forma controlada manteniendo el core firme.", "Mantené la kettlebell cerca del cuerpo durante todo el movimiento."]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "40000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_piernas 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('quads', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_adductors');
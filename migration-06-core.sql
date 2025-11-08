-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: CORE/ABDOMINALES (exercisesCore)
-- ============================================================================
-- Ejecutar este script después de migration-05-biceps.sql para migrar todos los ejercicios de core/abdominales

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

-- Crunch abdominal clásico
(
    '60000000-0001-0000-0000-000000000001'::uuid,
    'Crunch abdominal clásico',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["Acuéstate boca arriba con las rodillas flexionadas y los pies apoyados en el suelo", "Coloca las manos detrás de la cabeza o cruzadas sobre el pecho", "Elevá el tronco de forma controlada contrayendo el abdomen sin despegar completamente la zona lumbar del suelo", "Bajá lentamente hasta la posición inicial manteniendo la tensión en el abdomen"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000002", "60000000-0001-0000-0000-000000000003", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Crunch en máquina
(
    '60000000-0001-0000-0000-000000000002'::uuid,
    'Crunch en máquina',
    'system',
    null,
    'rectus_abdominis',
    'seated_row_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina ajustando el respaldo y los rodillos para que queden sobre los hombros", "Agarrá las manijas o apoyá las manos según la máquina", "Flexioná el tronco hacia adelante contrayendo el abdomen mientras exhalás", "Volvé lentamente a la posición inicial controlando la fase excéntrica"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Crunch en polea alta
(
    '60000000-0001-0000-0000-000000000003'::uuid,
    'Crunch en polea alta',
    'system',
    null,
    'rectus_abdominis',
    'cable_machine',
    'isolation',
    '[]'::jsonb,
    '["Arrodillate frente a la polea alta con cuerda, agarrando ambos extremos", "Mantén la espalda recta y los codos flexionados a los lados", "Flexioná el tronco llevando la cuerda hacia las rodillas contrayendo el abdomen", "Volvé lentamente a la posición inicial sin perder tensión en el core"]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Crunch inverso
(
    '60000000-0001-0000-0000-000000000004'::uuid,
    'Crunch inverso',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Acuéstate boca arriba con los brazos a los lados y las piernas flexionadas", "Elevá las caderas y las piernas hacia el pecho contrayendo el abdomen", "Mantené la contracción un segundo arriba y bajá lentamente sin tocar el suelo con las piernas"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Plancha frontal
(
    '60000000-0001-0000-0000-000000000005'::uuid,
    'Plancha frontal',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "obliques", "lower_back"]'::jsonb,
    '["Apoyá los antebrazos y las puntas de los pies en el suelo, manteniendo el cuerpo recto", "Contraé el abdomen y los glúteos para alinear hombros, cadera y tobillos", "Mantené la posición el tiempo deseado sin que la cadera caiga o se eleve demasiado"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Plancha lateral
(
    '60000000-0001-0000-0000-000000000006'::uuid,
    'Plancha lateral',
    'system',
    null,
    'obliques',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "rectus_abdominis"]'::jsonb,
    '["Apoyá un antebrazo en el suelo y el lateral del pie correspondiente, formando una línea recta con el cuerpo", "Elevá la cadera contrayendo el abdomen y glúteos", "Mantené la posición evitando que la cadera se hunda o gire hacia adelante"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000007", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Giros rusos (Russian twist)
(
    '60000000-0001-0000-0000-000000000007'::uuid,
    'Giros rusos (Russian twist)',
    'system',
    null,
    'obliques',
    'medicine_ball',
    'isolation',
    '["rectus_abdominis", "transverse_abdominis"]'::jsonb,
    '["Sentate con las piernas flexionadas y los pies elevados ligeramente del suelo, sosteniendo un medicine ball", "Inclinate ligeramente hacia atrás manteniendo la espalda recta", "Rotá el tronco de un lado al otro llevando el balón lateralmente", "Mantene la contracción abdominal y respirá de manera controlada"]'::jsonb,
    '["medicine_ball", "bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000006", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de piernas colgado
(
    '60000000-0001-0000-0000-000000000008'::uuid,
    'Elevaciones de piernas colgado',
    'system',
    null,
    'rectus_abdominis',
    'pull_up_bar',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Agarrate de la barra con agarre pronado y brazos extendidos", "Mantené el torso estable y elevá las piernas juntas hasta formar un ángulo de 90° con el tronco", "Bajá lentamente sin balancear el cuerpo y mantené la contracción en el abdomen"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["60000000-0001-0000-0000-000000000009", "60000000-0001-0000-0000-000000000010"]'::jsonb,
    'weight_reps'
),

-- Elevaciones de rodillas colgado
(
    '60000000-0001-0000-0000-000000000009'::uuid,
    'Elevaciones de rodillas colgado',
    'system',
    null,
    'rectus_abdominis',
    'pull_up_bar',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Colgate en la barra con agarre pronado y brazos extendidos", "Flexioná las rodillas y llevá las piernas hacia el pecho controlando el movimiento", "Bajá lentamente las piernas manteniendo la tensión abdominal"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Ab wheel (rueda abdominal)
(
    '60000000-0001-0000-0000-000000000010'::uuid,
    'Ab wheel (rueda abdominal)',
    'system',
    null,
    'rectus_abdominis',
    'ab_wheel',
    'isolation',
    '["obliques", "lower_back"]'::jsonb,
    '["Arrodillate sobre un pad y sujetá la rueda abdominal con ambas manos", "Rodá hacia adelante extendiendo el torso sin que la espalda lumbar se hunda", "Contraé el abdomen y los glúteos para volver a la posición inicial de forma controlada"]'::jsonb,
    '["ab_wheel"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Extensión lumbar en banco romano
(
    '60000000-0001-0000-0000-000000000011'::uuid,
    'Extensión lumbar en banco romano',
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["Colocate boca abajo sobre el banco romano con los tobillos sujetos", "Cruzá los brazos sobre el pecho o detrás de la cabeza", "Flexioná el tronco hacia abajo controlando el movimiento y luego elevá hasta alinear con las piernas", "Evita hiperextender la espalda y mantené la contracción en los erectores"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000012", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Superman
(
    '60000000-0001-0000-0000-000000000012'::uuid,
    'Superman',
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["Acuéstate boca abajo con brazos y piernas extendidos", "Elevá simultáneamente brazos, pecho y piernas del suelo contrayendo lumbares y glúteos", "Mantene la posición 1-2 segundos y bajá lentamente controlando la fase excéntrica"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000011", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Peso muerto rumano
(
    '60000000-0001-0000-0000-000000000013'::uuid,
    'Peso muerto rumano',
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["Parate con los pies al ancho de hombros y la barra frente a los muslos, agarre pronado o mixto", "Mantén la espalda recta y los hombros retraídos", "Flexioná ligeramente las rodillas y bajá la barra deslizando por los muslos hasta sentir estiramiento en isquios y lumbares", "Elevá el torso contrayendo glúteos y femorales hasta la posición inicial"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["40000000-0001-0000-0000-000000000009", "40000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Bird-Dog
(
    '60000000-0001-0000-0000-000000000014'::uuid,
    'Bird-Dog',
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "rectus_abdominis", "hip_flexors"]'::jsonb,
    '["Apoyate en cuatro puntos, manos alineadas con hombros y rodillas con caderas", "Elevá simultáneamente el brazo derecho y la pierna izquierda hasta formar línea recta con el torso", "Mantene 1-2 segundos contrayendo abdomen y glúteos, luego volvé lentamente a la posición inicial", "Alterná brazo y pierna opuestos en cada repetición"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000015", "60000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Dead Bug
(
    '60000000-0001-0000-0000-000000000015'::uuid,
    'Dead Bug',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["transverse_abdominis", "hip_flexors"]'::jsonb,
    '["Acostate boca arriba con brazos extendidos hacia el techo y piernas flexionadas en 90°", "Bajá lentamente el brazo derecho y la pierna izquierda hacia el suelo sin que la espalda lumbar se despegue", "Volvé a la posición inicial y alterná lado contrario", "Mantené la contracción abdominal durante todo el movimiento"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Crunch en banco declinado
(
    '60000000-0001-0000-0000-000000000016'::uuid,
    'Crunch en banco declinado',
    'system',
    null,
    'rectus_abdominis',
    'decline_bench',
    'isolation',
    '[]'::jsonb,
    '["Acuéstate boca arriba en un banco declinado con pies asegurados y manos detrás de la cabeza", "Mantén el core activo y la espalda baja pegada al banco", "Contrae el abdomen elevando la parte superior del torso hacia las rodillas", "Mantené la contracción 1 segundo arriba", "Baja lentamente hasta volver a la posición inicial", "No tires del cuello ni balancees el torso"]'::jsonb,
    '["decline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Crunch con piernas elevadas
(
    '60000000-0001-0000-0000-000000000017'::uuid,
    'Crunch con piernas elevadas',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '[]'::jsonb,
    '["Acuéstate boca arriba con piernas flexionadas en ángulo de 90° y pies elevados", "Coloca las manos detrás de la cabeza y mantén el core firme", "Eleva el torso contrayendo el abdomen hasta acercar los hombros a las caderas", "Mantén la contracción 1 segundo arriba", "Descende lentamente sin arquear la espalda", "Evita tirar del cuello o balancear el cuerpo"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000004", "60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Crunch con kettlebell
(
    '60000000-0001-0000-0000-000000000018'::uuid,
    'Crunch con kettlebell',
    'system',
    null,
    'rectus_abdominis',
    'kettlebell',
    'isolation',
    '[]'::jsonb,
    '["Acuéstate boca arriba en un banco plano sosteniendo una kettlebell sobre el pecho", "Mantén los pies apoyados y core firme", "Eleva el torso contrayendo el abdomen hacia la kettlebell", "Mantén la contracción 1 segundo", "Baja lentamente sin perder tensión en el core", "No uses impulso con la kettlebell ni arquees la espalda"]'::jsonb,
    '["kettlebell", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000001", "60000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Plancha con toques de hombros
(
    '60000000-0001-0000-0000-000000000019'::uuid,
    'Plancha con toques de hombros',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "transverse_abdominis"]'::jsonb,
    '["Colócate en posición de plancha alta con manos directamente debajo de los hombros", "Mantén el cuerpo en línea recta desde cabeza hasta pies y core activado", "Toca alternadamente cada hombro con la mano opuesta sin rotar el torso", "Mantén el abdomen contraído durante todo el ejercicio", "Controla el movimiento evitando balancear la cadera"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000020"]'::jsonb,
    'time_only'
),

-- Plancha con deslizadores
(
    '60000000-0001-0000-0000-000000000020'::uuid,
    'Plancha con deslizadores',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "transverse_abdominis", "lower_back"]'::jsonb,
    '["Colócate en plancha alta con pies sobre deslizadores y manos debajo de los hombros", "Desliza los pies hacia adelante y hacia atrás manteniendo la línea recta del cuerpo", "Activá el core y glúteos durante todo el movimiento", "Evita que la cadera se hunda o se eleve demasiado", "Controla el ritmo y respiración"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000021"]'::jsonb,
    'time_only'
),

-- Plancha con elevación de pierna
(
    '60000000-0001-0000-0000-000000000021'::uuid,
    'Plancha con elevación de pierna',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["glutes", "lower_back", "obliques"]'::jsonb,
    '["Colócate en plancha alta con manos bajo hombros y core firme", "Eleva una pierna hacia atrás manteniendo el torso estable", "Mantén 1-2 segundos y baja lentamente sin arquear la espalda", "Alterna piernas manteniendo la alineación corporal", "Evita balancear la cadera o girar el torso"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000005", "60000000-0001-0000-0000-000000000019"]'::jsonb,
    'time_only'
),

-- Mountain climbers cruzados
(
    '60000000-0001-0000-0000-000000000022'::uuid,
    'Mountain climbers cruzados',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'compound',
    '["obliques", "hip_flexors"]'::jsonb,
    '["Colócate en plancha alta con manos debajo de los hombros y core activado", "Lleva alternativamente la rodilla derecha hacia el codo izquierdo y viceversa", "Mantén el torso estable y no levantes la cadera", "Realiza el movimiento controlado y rítmico", "Respira de manera constante y mantené abdominales contraídos"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000019", "60000000-0001-0000-0000-000000000021"]'::jsonb,
    'distance_time'
),

-- Dragon flag (avanzado)
(
    '60000000-0001-0000-0000-000000000023'::uuid,
    'Dragon flag (avanzado)',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "hip_flexors", "lower_back"]'::jsonb,
    '["Acuéstate boca arriba en un banco y agarra firmemente los extremos del banco con las manos", "Eleva el torso y piernas formando una línea recta desde los hombros hasta los pies", "Mantén el abdomen contraído y el cuerpo recto", "Baja lentamente sin tocar el banco con la espalda media y baja", "No arquear la espalda ni doblar las piernas durante el movimiento"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000026", "60000000-0001-0000-0000-000000000028"]'::jsonb,
    'weight_time'
),

-- Side bend con mancuerna (oblicuos)
(
    '60000000-0001-0000-0000-000000000024'::uuid,
    'Side bend con mancuerna (oblicuos)',
    'system',
    null,
    'obliques',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Parate derecho con pies al ancho de hombros sosteniendo una mancuerna en una mano", "Inclinate lateralmente hacia el lado de la mancuerna sin girar el torso", "Contrae los oblicuos al bajar y sube controladamente", "Mantén el core firme y espalda recta", "No balancees el torso ni uses impulso"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["60000000-0001-0000-0000-000000000025", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Side crunch en banco romano
(
    '60000000-0001-0000-0000-000000000025'::uuid,
    'Side crunch en banco romano',
    'system',
    null,
    'obliques',
    'decline_bench',
    'isolation',
    '[]'::jsonb,
    '["Colocate de lado en el banco romano con piernas aseguradas y core firme", "Coloca la mano libre detrás de la cabeza", "Eleva el torso hacia el lado superior contrayendo los oblicuos", "Baja lentamente hasta la posición inicial controlando el movimiento", "Evita balancear el torso o tirar del cuello"]'::jsonb,
    '["decline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000024", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- V-ups
(
    '60000000-0001-0000-0000-000000000026'::uuid,
    'V-ups',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'compound',
    '["hip_flexors", "obliques"]'::jsonb,
    '["Acuéstate boca arriba con brazos extendidos por encima de la cabeza y piernas rectas", "Eleva simultáneamente torso y piernas formando una \"V\"", "Contrae el abdomen en la parte superior", "Baja lentamente controlando el movimiento sin tocar el suelo con torso y piernas", "No uses impulso ni arquees la espalda"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000027", "60000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps_range'
),

-- Jackknife
(
    '60000000-0001-0000-0000-000000000027'::uuid,
    'Jackknife',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Acuéstate boca arriba con brazos extendidos por encima de la cabeza y piernas rectas", "Eleva simultáneamente torso y piernas llevando manos hacia los pies", "Contrae el abdomen arriba 1 segundo", "Baja lentamente hasta posición inicial sin perder tensión en el core", "Evita balancear el torso o arquear la espalda"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000026", "60000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps_range'
),

-- Leg raises en banco inclinado
(
    '60000000-0001-0000-0000-000000000028'::uuid,
    'Leg raises en banco inclinado',
    'system',
    null,
    'rectus_abdominis',
    'incline_bench',
    'isolation',
    '["hip_flexors"]'::jsonb,
    '["Acuéstate boca arriba en banco inclinado con manos sosteniendo los extremos", "Mantén piernas rectas y core activado", "Eleva las piernas hasta formar un ángulo de 90°", "Baja lentamente hasta posición inicial sin perder tensión en abdomen", "Evita arquear la espalda o usar impulso"]'::jsonb,
    '["incline_bench"]'::jsonb,
    '["60000000-0001-0000-0000-000000000008", "60000000-0001-0000-0000-000000000017"]'::jsonb,
    'weight_reps'
),

-- Plancha con rueda abdominal doble
(
    '60000000-0001-0000-0000-000000000029'::uuid,
    'Plancha con rueda abdominal doble',
    'system',
    null,
    'rectus_abdominis',
    'ab_wheel',
    'isolation',
    '["obliques", "lower_back", "erector_spinae"]'::jsonb,
    '["Colócate de rodillas con manos en las ruedas abdominales y core firme", "Rueda hacia adelante extendiendo brazos y manteniendo línea recta del cuerpo", "Contrae el abdomen y baja controladamente sin tocar el suelo con torso", "Regresa a la posición inicial controlando el movimiento", "Evita arquear la espalda o perder la alineación corporal"]'::jsonb,
    '["ab_wheel"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_time'
),

-- Hollow hold (sostén hueco)
(
    '60000000-0001-0000-0000-000000000030'::uuid,
    'Hollow hold (sostén hueco)',
    'system',
    null,
    'rectus_abdominis',
    'bodyweight',
    'isolation',
    '["obliques", "hip_flexors"]'::jsonb,
    '["Acostate boca arriba con brazos extendidos sobre la cabeza y piernas rectas", "Eleva hombros y piernas del suelo formando una posición hueca", "Mantén core y glúteos contraídos durante 20-60 segundos", "No arquees la espalda baja ni levantes demasiado los hombros", "Respira controladamente y mantén la postura estable"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["60000000-0001-0000-0000-000000000010", "60000000-0001-0000-0000-000000000005"]'::jsonb,
    'time_only'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_core 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('rectus_abdominis', 'obliques', 'erector_spinae', 'hamstrings');
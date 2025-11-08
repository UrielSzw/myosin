-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: CUERPO COMPLETO (exercisesFullBody)
-- ============================================================================
-- Ejecutar este script después de migration-07-legs.sql para migrar todos los ejercicios de cuerpo completo

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

-- Burpees
(
    '80000000-0001-0000-0000-000000000001'::uuid,
    'Burpees',
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["quads", "glutes", "chest_middle", "triceps", "rectus_abdominis"]'::jsonb,
    '["Parate con pies al ancho de hombros y core activado", "Descendé al suelo flexionando rodillas y apoyando manos, llevando pecho al suelo", "Hacé una flexión de brazos completa", "Impulsate con manos al suelo y saltá llevando pies adelante", "Elevate explosivamente desde esa posición y saltá verticalmente con brazos extendidos", "Aterrizá suavemente y volvé a la posición inicial manteniendo core firme"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000012", "80000000-0001-0000-0000-000000000013", "80000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Swing con kettlebell
(
    '80000000-0001-0000-0000-000000000002'::uuid,
    'Swing con kettlebell',
    'system',
    null,
    'glutes',
    'kettlebell',
    'compound',
    '["hamstrings", "lower_back", "front_delts", "quads"]'::jsonb,
    '["Parate con pies un poco más anchos que caderas sosteniendo kettlebell con ambas manos frente a vos", "Flexioná ligeramente rodillas y empujá cadera hacia atrás manteniendo espalda recta", "Impulsá cadera hacia adelante generando fuerza para elevar kettlebell hasta la altura de los hombros", "Dejá que el peso vuelva entre tus piernas controlando el movimiento", "Mantén core firme y mirada al frente durante todo el ejercicio"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Thruster (sentadilla + press de hombros)
(
    '80000000-0001-0000-0000-000000000003'::uuid,
    'Thruster (sentadilla + press de hombros)',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["Parate con pies al ancho de hombros sosteniendo mancuernas a la altura de hombros", "Realizá una sentadilla profunda manteniendo pecho erguido y espalda recta", "Elevá explosivamente las mancuernas sobre la cabeza mientras extendés piernas", "Descendé controladamente a la posición inicial con mancuernas a la altura de hombros", "Mantené core activo durante todo el movimiento"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000015", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Clean con barra
(
    '80000000-0001-0000-0000-000000000004'::uuid,
    'Clean con barra',
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "upper_traps", "forearms"]'::jsonb,
    '["Parate con pies al ancho de hombros y barra frente a tus espinillas", "Flexioná rodillas y cadera manteniendo espalda recta y agarrá barra con agarre pronado", "Elevá barra explosivamente desde piernas hasta hombros (fase de tirón)", "Rotá codos bajo la barra para recibirla sobre deltoides frontales en posición de cuclillas parciales", "Elevate a posición erguida manteniendo barra sobre hombros"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000008", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Snatch con barra
(
    '80000000-0001-0000-0000-000000000005'::uuid,
    'Snatch con barra',
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "front_delts", "upper_traps"]'::jsonb,
    '["Parate con pies al ancho de hombros, barra frente a espinillas", "Agarrá barra con agarre amplio pronado, espalda recta y core activado", "Elevá barra explosivamente extendiendo cadera, rodillas y tobillos", "Recibí barra sobre cabeza en posición completa con brazos extendidos y torso recto", "Descendé controladamente y preparate para repetir"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000008", "80000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Remo renegado con mancuernas
(
    '80000000-0001-0000-0000-000000000006'::uuid,
    'Remo renegado con mancuernas',
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis", "obliques"]'::jsonb,
    '["Colocate en posición de plancha con mancuernas debajo de hombros", "Mantené cuerpo recto, core firme y pies ligeramente separados", "Remá una mancuerna hacia torso sin girar cadera", "Descendé lentamente y alterná brazo contrario", "Evita arquear espalda o mover cadera lateralmente"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Clean & Press con mancuernas
(
    '80000000-0001-0000-0000-000000000007'::uuid,
    'Clean & Press con mancuernas',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["Parate con pies al ancho de hombros sosteniendo mancuernas frente a muslos", "Realizá un clean llevando mancuernas a hombros flexionando cadera y rodillas", "Desde esa posición, presioná mancuernas sobre cabeza hasta brazos extendidos", "Descendé controladamente mancuernas a hombros y luego a muslos", "Mantené core firme durante todo el movimiento"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000003", "80000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Power Clean
(
    '80000000-0001-0000-0000-000000000008'::uuid,
    'Power Clean',
    'system',
    null,
    'full_body',
    'barbell',
    'compound',
    '["quads", "glutes", "hamstrings", "upper_traps", "forearms"]'::jsonb,
    '["Parate con pies al ancho de hombros, barra frente a espinillas", "Agarrá barra con agarre pronado y espalda recta", "Elevá barra explosivamente con extensión de cadera, rodillas y tobillos", "Recibí barra sobre hombros en cuclillas parciales y luego elevate a posición erguida", "Mantené core activado durante todo el movimiento"]'::jsonb,
    '["barbell", "weight_plate"]'::jsonb,
    '["80000000-0001-0000-0000-000000000004", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Step-up con press
(
    '80000000-0001-0000-0000-000000000009'::uuid,
    'Step-up con press',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["Sujeta mancuernas a los costados y colocate frente a banco estable", "Subí un pie al banco y elevá cadera hasta extender pierna delantera", "Mientras subís, presioná mancuernas sobre cabeza con brazos extendidos", "Bajá controladamente y alterná pierna para la siguiente repetición", "Mantené core firme y espalda recta durante todo el movimiento"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["70000000-0001-0000-0000-000000000008", "70000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Turkish Get-Up
(
    '80000000-0001-0000-0000-000000000010'::uuid,
    'Turkish Get-Up',
    'system',
    null,
    'full_body',
    'kettlebell',
    'compound',
    '["front_delts", "glutes", "rectus_abdominis", "quads"]'::jsonb,
    '["Acostate de lado con kettlebell apoyada en mano extendida hacia techo", "Realizá roll a codo, luego a mano para elevar torso mientras mantienes brazo con kettlebell recto", "Subí a posición de rodilla y luego de pie manteniendo kettlebell sobre cabeza", "Invertí movimientos controladamente para volver al suelo", "Mantené mirada al frente y core activado durante todo el ejercicio"]'::jsonb,
    '["kettlebell", "bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000007", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Battle Ropes
(
    '80000000-0001-0000-0000-000000000011'::uuid,
    'Battle Ropes',
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["front_delts", "lats"]'::jsonb,
    '["Sujeta cuerdas con ambas manos y parate con pies al ancho de hombros", "Flexioná ligeramente rodillas y activá core", "Realizá ondas alternadas con las manos manteniendo torso estable", "Controlá respiración y evitá balancear el torso"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Mountain Climbers
(
    '80000000-0001-0000-0000-000000000012'::uuid,
    'Mountain Climbers',
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["rectus_abdominis", "obliques", "quads", "hip_flexors"]'::jsonb,
    '["Colocate en posición de plancha alta con manos debajo de hombros", "Llevá rodilla derecha al pecho y luego alterná con izquierda de forma rápida", "Mantén core firme y espalda recta durante todo el ejercicio", "Evita elevar caderas o arquear espalda"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Saltos al cajón (Box Jump)
(
    '80000000-0001-0000-0000-000000000013'::uuid,
    'Saltos al cajón (Box Jump)',
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["quads", "glutes", "calves", "hamstrings"]'::jsonb,
    '["Parate frente a caja estable con pies al ancho de caderas", "Flexioná rodillas y cadera para impulso", "Saltá explosivamente sobre la caja y caé suavemente con ambos pies", "Descendé con control a posición inicial evitando sobreextender rodillas"]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "70000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Bear Crawl
(
    '80000000-0001-0000-0000-000000000014'::uuid,
    'Bear Crawl',
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["front_delts", "obliques", "quads", "glutes"]'::jsonb,
    '["Colocate en posición de cuadrupedia con manos debajo de hombros y rodillas ligeramente levantadas", "Avanzá manos y pies alternando movimientos manteniendo torso estable", "Mantén core firme y espalda recta durante todo el movimiento", "Evita tocar rodillas al suelo"]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000012", "80000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Sentadilla con press de hombros (full-body compound)
(
    '80000000-0001-0000-0000-000000000015'::uuid,
    'Sentadilla con press de hombros (full-body compound)',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["Parate con pies al ancho de hombros sosteniendo mancuernas a la altura de hombros", "Realizá una sentadilla profunda manteniendo pecho erguido y espalda recta", "Elevá mancuernas sobre cabeza mientras extendés piernas", "Descendé controladamente a posición inicial con mancuernas a altura de hombros", "Mantené core firme durante todo el movimiento"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000003", "70000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Man Maker
(
    '80000000-0001-0000-0000-000000000016'::uuid,
    'Man Maker',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["chest_middle", "front_delts", "triceps", "quads", "glutes", "erector_spinae"]'::jsonb,
    '["Colocate de pie con una mancuerna en cada mano a los lados del cuerpo", "Realiza un burpee llevando las mancuernas al suelo y apoyando pecho y rodillas", "Haz un push-up con mancuernas y torso estable", "Desde la posición de push-up, remá cada mancuerna hacia tu torso alternadamente", "Impúlsate con las piernas y torso para realizar un clean y lleva las mancuernas a los hombros", "Presiona ambas mancuernas por encima de la cabeza hasta extensión completa", "Baja controladamente y vuelve a la posición inicial"]'::jsonb,
    '["dumbbell", "bodyweight"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Devil Press
(
    '80000000-0001-0000-0000-000000000017'::uuid,
    'Devil Press',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["chest_middle", "front_delts", "triceps", "quads", "glutes"]'::jsonb,
    '["Colocate de pie con una mancuerna en cada mano frente a los muslos", "Realiza un burpee llevando las mancuernas al suelo", "Haz un push-up sosteniendo las mancuernas", "Levanta el torso y realiza un clean llevando mancuernas a los hombros", "Presiona las mancuernas por encima de la cabeza hasta extensión completa", "Baja controladamente a la posición inicial"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000016", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Farmer's Walk
(
    '80000000-0001-0000-0000-000000000018'::uuid,
    'Farmer''s Walk',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["forearms", "upper_traps", "glutes", "erector_spinae"]'::jsonb,
    '["Sostén una mancuerna en cada mano a los costados del cuerpo con agarre firme", "Mantén torso erguido y core activado", "Camina en línea recta durante la distancia indicada sin inclinar el torso", "Evita balancear los hombros o encorvar la espalda", "Respira de manera controlada y mantiene la postura estable"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000019", "80000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_distance'
),

-- Overhead Carry
(
    '80000000-0001-0000-0000-000000000019'::uuid,
    'Overhead Carry',
    'system',
    null,
    'full_body',
    'dumbbell',
    'compound',
    '["front_delts", "triceps", "glutes"]'::jsonb,
    '["Sostén una mancuerna o kettlebell sobre la cabeza con ambos brazos extendidos", "Mantén torso erguido, core firme y pies al ancho de hombros", "Camina en línea recta durante la distancia indicada sin inclinar el torso", "Controla la respiración y evita arquear la espalda", "Mantén la carga estable y movimientos suaves"]'::jsonb,
    '["dumbbell"]'::jsonb,
    '["80000000-0001-0000-0000-000000000018", "80000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_distance'
),

-- Sprint en cinta o trineo
(
    '80000000-0001-0000-0000-000000000020'::uuid,
    'Sprint en cinta o trineo',
    'system',
    null,
    'quads',
    'other',
    'compound',
    '["hamstrings", "glutes", "calves"]'::jsonb,
    '["Colocate en la cinta de correr o frente al trineo con postura erguida y core activado", "Inicia carrera a máxima velocidad controlada", "Mantén la zancada explosiva y brazos activos", "Controla respiración y postura durante el sprint", "Detente progresivamente al finalizar la distancia o tiempo indicado"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000014", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
),

-- Slam con balón medicinal
(
    '80000000-0001-0000-0000-000000000021'::uuid,
    'Slam con balón medicinal',
    'system',
    null,
    'full_body',
    'medicine_ball',
    'compound',
    '["rectus_abdominis", "front_delts", "glutes"]'::jsonb,
    '["Colocate de pie con pies al ancho de hombros sosteniendo un balón medicinal frente al pecho", "Flexiona ligeramente las rodillas y lleva el balón sobre la cabeza", "Explosivamente lanza el balón hacia el suelo con fuerza", "Flexiona rodillas y cadera al recibir el rebote o al retomar el balón", "Mantén core firme durante todo el movimiento", "Evita arquear la espalda o doblar excesivamente la columna"]'::jsonb,
    '["medicine_ball"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000022"]'::jsonb,
    'weight_reps'
),

-- Wall Ball
(
    '80000000-0001-0000-0000-000000000022'::uuid,
    'Wall Ball',
    'system',
    null,
    'full_body',
    'medicine_ball',
    'compound',
    '["quads", "glutes", "front_delts", "triceps"]'::jsonb,
    '["Sostén un balón medicinal frente al pecho con pies al ancho de hombros", "Flexiona rodillas y cadera realizando una sentadilla profunda", "Explosivamente extiende piernas y brazos lanzando el balón hacia la pared a la altura indicada", "Atrapa el balón al caer y vuelve a iniciar la sentadilla", "Mantén core activo y espalda recta durante todo el movimiento"]'::jsonb,
    '["medicine_ball"]'::jsonb,
    '["80000000-0001-0000-0000-000000000021", "80000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps_range'
),

-- Jump Rope
(
    '80000000-0001-0000-0000-000000000023'::uuid,
    'Jump Rope',
    'system',
    null,
    'full_body',
    'bodyweight',
    'compound',
    '["calves", "forearms", "quads"]'::jsonb,
    '["Sujeta la cuerda de saltar con ambas manos a los lados del cuerpo", "Mantén core activado y espalda recta", "Realiza saltos pequeños y rápidos, manteniendo ritmo constante", "Aterriza suavemente sobre la punta de los pies", "Controla la respiración y el ritmo durante la serie"]'::jsonb,
    '["bodyweight", "other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000001", "80000000-0001-0000-0000-000000000020"]'::jsonb,
    'distance_time'
),

-- Ski Erg o simulador de esquí
(
    '80000000-0001-0000-0000-000000000024'::uuid,
    'Ski Erg o simulador de esquí',
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["lats", "front_delts", "glutes", "erector_spinae"]'::jsonb,
    '["Colocate de pie frente al Ski Erg con pies al ancho de hombros y core activo", "Agarra los mangos con agarre pronado", "Empuja los mangos hacia abajo y atrás mientras flexionas ligeramente rodillas y cadera", "Extiende brazos completamente y vuelve controladamente a la posición inicial", "Mantén ritmo constante y torso estable durante todo el movimiento"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000025", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
),

-- Assault Bike o Air Bike
(
    '80000000-0001-0000-0000-000000000025'::uuid,
    'Assault Bike o Air Bike',
    'system',
    null,
    'full_body',
    'other',
    'compound',
    '["quads", "hamstrings", "glutes"]'::jsonb,
    '["Ajusta el asiento de la bicicleta según tu altura y asegura los pies en los pedales", "Agarrá los manillares y mantén torso erguido", "Pedalea con fuerza alternando brazos y piernas para generar resistencia", "Mantén ritmo constante y respiración controlada durante la serie", "Evita encorvar el torso o soltar los manillares"]'::jsonb,
    '["other"]'::jsonb,
    '["80000000-0001-0000-0000-000000000020", "80000000-0001-0000-0000-000000000024", "80000000-0001-0000-0000-000000000012"]'::jsonb,
    'distance_time'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_fullbody 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('full_body', 'glutes', 'lats', 'quads');
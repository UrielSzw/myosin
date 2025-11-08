-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: ESPALDA (exercisesBack)
-- ============================================================================
-- Ejecutar este script después de migration-03-triceps.sql para migrar todos los ejercicios de espalda

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

-- Dominadas
(
    '40000000-0001-0000-0000-000000000001'::uuid,
    'Dominadas',
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["biceps", "rear_delts", "rhomboids", "mid_traps"]'::jsonb,
    '["Sujetate de la barra con agarre pronado (palmas hacia adelante) y manos separadas un poco más que el ancho de los hombros.", "Colgá el cuerpo completamente extendido, manteniendo los omóplatos retraídos y el core firme.", "Iniciá el movimiento tirando de los codos hacia abajo y atrás, llevando el mentón por encima de la barra.", "Controlá el descenso hasta estirar los brazos completamente sin perder tensión en la espalda.", "Evitá impulsarte con las piernas o balancearte durante el movimiento."]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Jalón al pecho en polea
(
    '40000000-0001-0000-0000-000000000002'::uuid,
    'Jalón al pecho en polea',
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["biceps", "rear_delts", "rhomboids", "mid_traps"]'::jsonb,
    '["Sentate en la máquina de jalón y ajustá el apoyo de las piernas.", "Agarrá la barra con agarre pronado y manos más separadas que el ancho de los hombros.", "Con el torso ligeramente inclinado hacia atrás, jalá la barra hacia el pecho contrayendo la espalda.", "Llevá los codos hacia abajo y atrás sin mover el tronco.", "Subí lentamente la barra hasta extender completamente los brazos sin soltar la tensión muscular."]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000001", "40000000-0001-0000-0000-000000000003"]'::jsonb,
    'weight_reps'
),

-- Jalón tras nuca (avanzado)
(
    '40000000-0001-0000-0000-000000000003'::uuid,
    'Jalón tras nuca (avanzado)',
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["rear_delts", "upper_traps", "rhomboids"]'::jsonb,
    '["Sentate en la máquina de jalón con el apoyo de piernas ajustado.", "Agarrá la barra con agarre pronado y amplio, más allá del ancho de los hombros.", "Mantené el torso erguido y jalá la barra detrás de la cabeza hasta que toque la parte superior de la nuca.", "Subí lentamente controlando la carga hasta estirar los brazos completamente.", "Evitá inclinar el cuello hacia adelante o arquear la espalda en exceso."]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["30000000-0001-0000-0000-000000000002", "30000000-0001-0000-0000-000000000006", "30000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Remo con barra
(
    '40000000-0001-0000-0000-000000000004'::uuid,
    'Remo con barra',
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps", "lower_back"]'::jsonb,
    '["Parate con los pies al ancho de los hombros y sujetá la barra con agarre pronado.", "Flexioná ligeramente las rodillas e incliná el torso hacia adelante manteniendo la espalda recta.", "Desde esa posición, jalá la barra hacia el abdomen retrayendo los omóplatos.", "Bajá la barra lentamente hasta estirar completamente los brazos.", "Evitá arquear la espalda o levantar el torso durante el movimiento."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con mancuernas
(
    '40000000-0001-0000-0000-000000000005'::uuid,
    'Remo con mancuernas',
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["rhomboids", "rear_delts", "biceps", "mid_traps"]'::jsonb,
    '["Apoyá una rodilla y una mano en un banco plano, manteniendo la espalda recta y paralela al suelo.", "Con la otra mano, sujetá una mancuerna con el brazo extendido hacia abajo.", "Jalá la mancuerna hacia el torso, llevando el codo hacia atrás y pegado al cuerpo.", "Bajá la mancuerna lentamente hasta estirar completamente el brazo.", "Evitá girar el torso o arquear la espalda durante el movimiento."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo en máquina
(
    '40000000-0001-0000-0000-000000000006'::uuid,
    'Remo en máquina',
    'system',
    null,
    'lats',
    'seated_row_machine',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["Sentate en la máquina con el pecho apoyado o los pies firmes sobre las plataformas.", "Agarrá las manijas con agarre neutro o pronado según el modelo.", "Jalá las manijas hacia el torso, retrayendo los omóplatos y manteniendo el pecho erguido.", "Controlá el regreso del peso hasta extender completamente los brazos.", "Evitá balancearte o mover el torso hacia atrás."]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Remo con polea baja
(
    '40000000-0001-0000-0000-000000000007'::uuid,
    'Remo con polea baja',
    'system',
    null,
    'lats',
    'cable_machine',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["Sentate frente a la polea baja con los pies apoyados en las plataformas.", "Agarrá la barra o manija con agarre neutro o pronado.", "Con la espalda recta y el torso levemente inclinado hacia adelante, jalá el cable hacia el abdomen.", "Llevá los codos hacia atrás retrayendo los omóplatos.", "Devolvé el cable de manera controlada hasta extender completamente los brazos."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Peso muerto convencional
(
    '40000000-0001-0000-0000-000000000008'::uuid,
    'Peso muerto convencional',
    'system',
    null,
    'glutes',
    'barbell',
    'compound',
    '["hamstrings", "erector_spinae", "lower_back", "lats", "forearms"]'::jsonb,
    '["Parate con los pies al ancho de los hombros y la barra sobre la mitad del pie.", "Agachate flexionando caderas y rodillas hasta agarrar la barra con agarre pronado o mixto.", "Mantené la espalda recta y el pecho arriba.", "Extendé las caderas y rodillas al mismo tiempo para levantar la barra, manteniéndola pegada al cuerpo.", "Una vez erguido, bajá la barra de forma controlada siguiendo el mismo recorrido.", "Evitá arquear la espalda o tirar con los brazos."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Peso muerto con piernas rígidas
(
    '40000000-0001-0000-0000-000000000009'::uuid,
    'Peso muerto con piernas rígidas',
    'system',
    null,
    'hamstrings',
    'barbell',
    'compound',
    '["glutes", "erector_spinae", "lower_back"]'::jsonb,
    '["Parate con los pies al ancho de las caderas sosteniendo una barra frente a los muslos.", "Mantené una leve flexión en las rodillas y la espalda recta.", "Descendé la barra deslizando las caderas hacia atrás hasta sentir el estiramiento en los isquiotibiales.", "No dejes que la barra se aleje del cuerpo.", "Volvé a la posición inicial contrayendo los glúteos y los femorales."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Pull-over con mancuerna o cable
(
    '40000000-0001-0000-0000-000000000010'::uuid,
    'Pull-over con mancuerna o cable',
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["chest_lower", "serratus_anterior"]'::jsonb,
    '["Acostate en un banco plano sosteniendo una mancuerna con ambas manos sobre el pecho.", "Con una ligera flexión de codos, bajá la mancuerna detrás de la cabeza hasta sentir el estiramiento en el pecho y dorsales.", "Evitá arquear la espalda o soltar el control del peso.", "Llevá la mancuerna nuevamente sobre el pecho contrayendo la espalda y el serrato.", "Mantené el movimiento fluido y controlado durante todo el ejercicio."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000008", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Remo en T (T-Bar Row)
(
    '40000000-0001-0000-0000-000000000011'::uuid,
    'Remo en T (T-Bar Row)',
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["rhomboids", "mid_traps", "rear_delts", "biceps"]'::jsonb,
    '["Colocá un extremo de la barra en una esquina o soporte y cargá el otro con discos.", "Parate sobre la barra y sujetá el asa o manija en el extremo cargado.", "Con las rodillas levemente flexionadas y el torso inclinado, jalá la barra hacia el abdomen retrayendo los omóplatos.", "Bajá lentamente hasta estirar completamente los brazos sin soltar la tensión.", "Mantené la espalda recta durante todo el movimiento."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000007", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Face Pull (para trapecios y deltoide posterior)
(
    '40000000-0001-0000-0000-000000000012'::uuid,
    'Face Pull (para trapecios y deltoide posterior)',
    'system',
    null,
    'rear_delts',
    'cable_machine',
    'isolation',
    '["rhomboids", "mid_traps", "rotator_cuff"]'::jsonb,
    '["Colocá una cuerda en la polea alta y sujetala con ambas manos con agarre neutro.", "Con el torso erguido, jalá la cuerda hacia la cara separando las manos al final del recorrido.", "Retractá los omóplatos y mantené los codos altos durante el movimiento.", "Volvé lentamente a la posición inicial sin perder la tensión.", "Evitá usar impulso con el cuerpo o bajar los codos."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000011", "40000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Encogimientos de hombros con mancuernas
(
    '40000000-0001-0000-0000-000000000013'::uuid,
    'Encogimientos de hombros con mancuernas',
    'system',
    null,
    'upper_traps',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Parate derecho con una mancuerna en cada mano a los costados del cuerpo.", "Mantené los brazos rectos y los hombros relajados.", "Elevá los hombros hacia las orejas lo más alto posible contrayendo los trapecios.", "Bajá lentamente a la posición inicial sin balancear el cuerpo.", "Evitá rotar los hombros hacia adelante o atrás."]'::jsonb,
    '["dumbbell"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Remo con banda elástica
(
    '40000000-0001-0000-0000-000000000014'::uuid,
    'Remo con banda elástica',
    'system',
    null,
    'lats',
    'resistance_band',
    'compound',
    '["rhomboids", "mid_traps", "biceps"]'::jsonb,
    '["Sentate con las piernas extendidas y la banda elástica anclada frente a vos a la altura de los pies.", "Sujetá los extremos de la banda con ambas manos y el torso erguido.", "Jalá los extremos hacia el abdomen retrayendo los omóplatos.", "Extendé los brazos lentamente hasta la posición inicial.", "Evitá encorvar la espalda o usar impulso."]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Superman (para lumbar)
(
    '40000000-0001-0000-0000-000000000015'::uuid,
    'Superman (para lumbar)',
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["glutes", "hamstrings"]'::jsonb,
    '["Acostate boca abajo con los brazos extendidos al frente y las piernas estiradas.", "Elevá simultáneamente los brazos, el pecho y las piernas del suelo contrayendo los lumbares y glúteos.", "Mantené la posición 1–2 segundos arriba.", "Bajá lentamente sin relajar completamente los músculos.", "Evitá arquear el cuello o levantar en exceso el torso."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["40000000-0001-0000-0000-000000000027", "40000000-0001-0000-0000-000000000016"]'::jsonb,
    'weight_reps'
),

-- Buenos días con barra
(
    '40000000-0001-0000-0000-000000000016'::uuid,
    'Buenos días con barra',
    'system',
    null,
    'erector_spinae',
    'barbell',
    'compound',
    '["hamstrings", "glutes", "lower_back"]'::jsonb,
    '["Colocá la barra sobre la parte superior de la espalda (como en una sentadilla).", "Parate con los pies al ancho de las caderas y las rodillas levemente flexionadas.", "Inclinate hacia adelante desde las caderas manteniendo la espalda recta.", "Descendé hasta que el torso quede casi paralelo al suelo, sintiendo el estiramiento en los isquiotibiales.", "Volvé a la posición inicial contrayendo los lumbares y glúteos.", "Evitá redondear la espalda o flexionar demasiado las rodillas."]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Dominadas supinas
(
    '40000000-0001-0000-0000-000000000017'::uuid,
    'Dominadas supinas',
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["biceps", "rhomboids"]'::jsonb,
    '["Agarra la barra con agarre supino (palmas mirando hacia vos) a la anchura de los hombros", "Cuelgate con los brazos totalmente extendidos y el core activado, piernas flexionadas si necesitás espacio", "Tirate hacia arriba llevando el pecho hacia la barra hasta que la barbilla supere la altura de la barra", "Bajá de forma controlada hasta la extensión completa de brazos manteniendo tensión en dorsales", "Evitá hacer balanceos y no tirés con impulso de las piernas; controlá la respiración durante todo el movimiento"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000026"]'::jsonb,
    'weight_reps'
),

-- Dominadas neutras
(
    '40000000-0001-0000-0000-000000000018'::uuid,
    'Dominadas neutras',
    'system',
    null,
    'lats',
    'pull_up_bar',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["Colocate en la barra o agarres con empuñadura neutral (palmas enfrentadas)", "Cuelgate con los brazos extendidos y el cuerpo en línea; activá el core", "Conducí la escápula hacia abajo y atrás y tirá con los dorsales hasta llevar el mentón por encima de la barra", "Descendé controlando la fase excéntrica hasta la extensión completa de los brazos", "Evita balancear el torso o arquear excesivamente la zona lumbar; mantené ritmo controlado"]'::jsonb,
    '["pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000021", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Jalón con agarre cerrado
(
    '40000000-0001-0000-0000-000000000019'::uuid,
    'Jalón con agarre cerrado',
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["Sentate en la máquina de jalones y agarra la barra con un agarre cerrado (manos juntas)", "Apoyá las piernas en los soportes y mantené el torso ligeramente inclinado hacia atrás", "Tirá la barra hacia el pecho llevando los codos hacia atrás y juntando los omóplatos", "Volvé de forma controlada hasta la posición inicial con los brazos casi extendidos", "No uses impulso del torso ni arquees la espalda; concentrate en tirar con los dorsales"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000020"]'::jsonb,
    'weight_reps'
),

-- Jalón con agarre supino
(
    '40000000-0001-0000-0000-000000000020'::uuid,
    'Jalón con agarre supino',
    'system',
    null,
    'lats',
    'lat_pulldown',
    'compound',
    '["biceps", "rhomboids"]'::jsonb,
    '["Sentate correctamente en la estación de jalón con el agarre supino (palmas hacia vos)", "Apoyá los pies y mantené el torso estable con ligera inclinación hacia atrás", "Tirá la barra hacia la parte superior del pecho acercando los codos al cuerpo", "Descendé la barra de forma controlada hasta permitir casi la extensión completa de los brazos", "Evita balanceos y no arquear la zona lumbar; controlá el movimiento y la respiración"]'::jsonb,
    '["lat_pulldown"]'::jsonb,
    '["40000000-0001-0000-0000-000000000002", "40000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Remo invertido
(
    '40000000-0001-0000-0000-000000000021'::uuid,
    'Remo invertido',
    'system',
    null,
    'rhomboids',
    'bodyweight',
    'compound',
    '["mid_traps", "biceps"]'::jsonb,
    '["Colocate bajo una barra fijada a la altura de la cintura o en una estación de remo invertido", "Agarra la barra con agarre prono o neutro y extendé las piernas manteniendo el cuerpo en línea recta", "Tirá del pecho hacia la barra retrayendo los omóplatos y doblando los codos", "Bajá controladamente hasta la posición inicial con brazos extendidos y núcleo activo", "No dejés caer las caderas ni arquear la espalda; mantené el cuerpo rígido durante todo el movimiento"]'::jsonb,
    '["bodyweight", "pull_up_bar"]'::jsonb,
    '["40000000-0001-0000-0000-000000000022", "40000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Remo con TRX
(
    '40000000-0001-0000-0000-000000000022'::uuid,
    'Remo con TRX',
    'system',
    null,
    'rhomboids',
    'suspension_trainer',
    'compound',
    '["biceps", "mid_traps"]'::jsonb,
    '["Ajustá las correas TRX a la longitud adecuada y sujetá las empuñaduras con agarre neutro", "Inclinate hacia atrás manteniendo el cuerpo en línea y las manos extendidas", "Tirá de las manijas llevando el pecho hacia las manos y juntando los omóplatos", "Volvé lentamente a la posición inicial controlando la fase excéntrica", "Mantené el core activo y evitá balancear las piernas; ajustá la inclinación para variar la dificultad"]'::jsonb,
    '["suspension_trainer"]'::jsonb,
    '["40000000-0001-0000-0000-000000000021", "40000000-0001-0000-0000-000000000005"]'::jsonb,
    'weight_reps'
),

-- Remo en máquina Hammer Strength
(
    '40000000-0001-0000-0000-000000000023'::uuid,
    'Remo en máquina Hammer Strength',
    'system',
    null,
    'lats',
    'seated_row_machine',
    'compound',
    '["rhomboids", "biceps"]'::jsonb,
    '["Sentate en la máquina con el pecho apoyado si la máquina lo permite y agarrá las empuñaduras", "Manteniendo el torso estable, tirá con los codos hacia atrás hasta acercar las manos al torso", "Contraé fuertemente los dorsales y los omóplatos en la fase concéntrica", "Regresá controlando la carga hasta la extensión casi completa de los brazos", "Evitá impulsos del torso y mantené una respiración controlada durante todo el movimiento"]'::jsonb,
    '["seated_row_machine"]'::jsonb,
    '["40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con agarre supino
(
    '40000000-0001-0000-0000-000000000024'::uuid,
    'Remo con agarre supino',
    'system',
    null,
    'lats',
    'barbell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["Colocate de pie con las rodillas ligeramente flexionadas y el torso inclinado hacia adelante con la espalda recta", "Agarrá la barra con agarre supino (palmas hacia vos) a la anchura de los hombros", "Tirá de la barra hacia el abdomen manteniendo los codos pegados al cuerpo", "Descendé la barra de forma controlada hasta la posición inicial con los brazos casi extendidos", "Mantené la espalda neutra y evitá balancear el cuerpo; activá el core durante todo el movimiento"]'::jsonb,
    '["barbell"]'::jsonb,
    '["40000000-0001-0000-0000-000000000004", "40000000-0001-0000-0000-000000000025"]'::jsonb,
    'weight_reps'
),

-- Remo Kroc
(
    '40000000-0001-0000-0000-000000000025'::uuid,
    'Remo Kroc',
    'system',
    null,
    'lats',
    'dumbbell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["Apoyá una mano y la misma rodilla en un banco, con la otra pierna estable en el suelo", "Sostené una mancuerna pesada con la mano libre y descendé el brazo totalmente", "Tirá con fuerza llevando la mancuerna hacia la cadera en un movimiento explosivo-controlado", "Controlá la bajada hasta estirar el brazo y repetí varias repeticiones con carga desafiante", "Mantené el torso estable y evitá rotar la columna; repetí con el otro brazo"]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["40000000-0001-0000-0000-000000000005", "40000000-0001-0000-0000-000000000006", "40000000-0001-0000-0000-000000000007"]'::jsonb,
    'weight_reps'
),

-- Remo con kettlebell
(
    '40000000-0001-0000-0000-000000000026'::uuid,
    'Remo con kettlebell',
    'system',
    null,
    'lats',
    'kettlebell',
    'compound',
    '["biceps", "erector_spinae"]'::jsonb,
    '["Adoptá una postura semiflexionada con la espalda recta y la kettlebell entre los pies", "Agarrá la kettlebell con una mano y mantené el torso estable", "Tirá la kettlebell hacia la cadera contrayendo dorsal y omóplato", "Descendé controlando hasta estirar el brazo sin perder la alineación de la espalda", "No uses impulso del cuerpo; mantené el core firme y repetí del otro lado"]'::jsonb,
    '["kettlebell"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
),

-- Superman hold
(
    '40000000-0001-0000-0000-000000000027'::uuid,
    'Superman hold',
    'system',
    null,
    'erector_spinae',
    'bodyweight',
    'isolation',
    '["lower_back", "glutes"]'::jsonb,
    '["Acuestate boca abajo sobre una colchoneta con los brazos extendidos hacia adelante", "Elevá simultáneamente los brazos, el pecho y las piernas manteniendo la mirada neutra", "Sostené la posición máxima con contracción de la zona lumbar y glúteos", "Respirá de forma controlada y mantené la posición el tiempo indicado", "Bajá lentamente al suelo para descansar y repetí las series"]'::jsonb,
    '["bodyweight", "stability_ball"]'::jsonb,
    '[]'::jsonb,
    'time_only'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_espalda 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('lats', 'rhomboids', 'mid_traps', 'upper_traps', 'erector_spinae', 'glutes', 'hamstrings', 'rear_delts', 'lower_back');
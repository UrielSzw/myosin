-- ============================================================================
-- MIGRACIÓN DE EJERCICIOS - GRUPO: PECHO (exercisesChest)
-- ============================================================================
-- Ejecutar este script primero para migrar todos los ejercicios de pecho

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

-- Press de banca con barra
(
    '10000000-0001-0000-0000-000000000001'::uuid,
    'Press de banca con barra',
    'system',
    null,
    'chest_middle',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Acuéstate boca arriba en un banco plano con los pies firmes en el suelo y la espalda ligeramente arqueada.", "Sujeta la barra con un agarre pronado, un poco más ancho que el ancho de los hombros.", "Desengancha la barra del soporte y mantenela sobre el pecho con los brazos extendidos.", "Bajá la barra de manera controlada hasta que toque suavemente el pecho a la altura de los pezones.", "Empujá la barra hacia arriba extendiendo los brazos sin bloquear los codos completamente.", "Mantené los omóplatos retraídos y la tensión en el pecho durante todo el movimiento."]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000014"]'::jsonb,
    'weight_reps'
),

-- Press de banca con mancuernas
(
    '10000000-0001-0000-0000-000000000002'::uuid,
    'Press de banca con mancuernas',
    'system',
    null,
    'chest_middle',
    'dumbbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Acuéstate en un banco plano sosteniendo una mancuerna en cada mano sobre tu pecho con los brazos extendidos.", "Mantén las palmas mirando hacia adelante y los pies firmes en el suelo.", "Desciende lentamente las mancuernas hacia los lados del pecho hasta que los codos queden ligeramente por debajo del banco.", "Presiona las mancuernas hacia arriba juntándolas ligeramente en la parte superior sin golpearlas.", "Controlá el descenso en cada repetición y mantené los omóplatos retraídos."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con barra
(
    '10000000-0001-0000-0000-000000000003'::uuid,
    'Press inclinado con barra',
    'system',
    null,
    'chest_upper',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Ajustá el banco a un ángulo de 30° a 45° e instalá la barra en el soporte superior.", "Acuéstate y sujetá la barra con un agarre un poco más ancho que el ancho de los hombros.", "Descolgá la barra y sostenela sobre la parte superior del pecho.", "Bajá la barra lentamente hasta que toque suavemente el pecho superior.", "Empujá la barra hacia arriba extendiendo los brazos completamente.", "Mantené la retracción escapular y la mirada fija al techo durante todo el movimiento."]'::jsonb,
    '["barbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000004", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con mancuernas
(
    '10000000-0001-0000-0000-000000000004'::uuid,
    'Press inclinado con mancuernas',
    'system',
    null,
    'chest_upper',
    'dumbbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Ajustá el respaldo del banco entre 30° y 45° e incliná ligeramente la espalda.", "Sostené una mancuerna en cada mano sobre el pecho con los brazos extendidos y las palmas mirando al frente.", "Descendé lentamente las mancuernas hacia los costados del pecho superior.", "Empujá las mancuernas hacia arriba juntándolas ligeramente arriba sin perder la tensión.", "Mantené los pies firmes, el abdomen contraído y los omóplatos retraídos."]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000013", "10000000-0001-0000-0000-000000000012"]'::jsonb,
    'weight_reps'
),

-- Press declinado con barra
(
    '10000000-0001-0000-0000-000000000005'::uuid,
    'Press declinado con barra',
    'system',
    null,
    'chest_lower',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Ajustá el banco declinado y asegurá tus piernas en el soporte para estabilidad.", "Tomá la barra con un agarre pronado, apenas más ancho que los hombros.", "Descolgá la barra y mantenela extendida sobre el pecho inferior.", "Bajá la barra de manera controlada hasta que toque ligeramente el pecho bajo.", "Empujá la barra hacia arriba hasta extender los brazos sin bloquear los codos.", "Mantené la tensión constante en el pecho y no arquees excesivamente la espalda."]'::jsonb,
    '["barbell", "decline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000010", "10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000006"]'::jsonb,
    'weight_reps'
),

-- Aperturas con mancuernas en banco plano
(
    '10000000-0001-0000-0000-000000000006'::uuid,
    'Aperturas con mancuernas en banco plano',
    'system',
    null,
    'chest_middle',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Acuéstate en un banco plano con una mancuerna en cada mano sobre el pecho, con los brazos extendidos y las palmas enfrentadas.", "Con un leve doblez en los codos, abrí los brazos hacia los costados hasta sentir el estiramiento en el pecho.", "Evitá bajar demasiado para no comprometer los hombros.", "Llevá las mancuernas nuevamente hacia arriba siguiendo el mismo arco hasta que casi se toquen.", "Controlá el movimiento en todo momento y mantené la contracción del pecho al final."]'::jsonb,
    '["dumbbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000007", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Aperturas con mancuernas en banco inclinado
(
    '10000000-0001-0000-0000-000000000007'::uuid,
    'Aperturas con mancuernas en banco inclinado',
    'system',
    null,
    'chest_upper',
    'dumbbell',
    'isolation',
    '[]'::jsonb,
    '["Ajustá el banco a 30°-45° y sostené una mancuerna en cada mano con las palmas enfrentadas.", "Con los brazos ligeramente flexionados, abrí lentamente los brazos hacia los costados hasta sentir el estiramiento en el pecho superior.", "Evitá bajar más allá del nivel del hombro.", "Juntá las mancuernas siguiendo el mismo arco de movimiento hasta la posición inicial.", "Mantené el control del peso y el pecho activado en todo momento."]'::jsonb,
    '["dumbbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000006", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Aperturas en máquina o contractor
(
    '10000000-0001-0000-0000-000000000008'::uuid,
    'Aperturas en máquina o contractor',
    'system',
    null,
    'chest_middle',
    'chest_press_machine',
    'isolation',
    '[]'::jsonb,
    '["Sentate en la máquina con la espalda apoyada y los pies firmes en el suelo.", "Ajustá el asiento para que las empuñaduras queden a la altura del pecho.", "Tomá las manijas con los codos ligeramente flexionados.", "Empujá las empuñaduras hacia adelante hasta que casi se toquen frente a tu pecho.", "Volvé lentamente a la posición inicial controlando el retorno.", "Mantené el pecho firme y evitá estirar completamente los codos."]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000006", "10000000-0001-0000-0000-000000000009"]'::jsonb,
    'weight_reps'
),

-- Cruce de poleas (cable crossover)
(
    '10000000-0001-0000-0000-000000000009'::uuid,
    'Cruce de poleas (cable crossover)',
    'system',
    null,
    'chest_middle',
    'cable_machine',
    'isolation',
    '["chest_upper", "chest_lower"]'::jsonb,
    '["Colocate en el centro entre dos poleas altas, sujetando una manija en cada mano.", "Dá un paso al frente con una pierna y mantené una ligera inclinación del torso.", "Con los codos levemente flexionados, llevá las manos al frente del pecho siguiendo un arco amplio.", "Contraé el pecho en la posición final y mantené un segundo la tensión.", "Volvé lentamente a la posición inicial controlando el movimiento.", "Evitá mover los hombros o balancear el cuerpo."]'::jsonb,
    '["cable_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000011", "10000000-0001-0000-0000-000000000001"]'::jsonb,
    'weight_reps'
),

-- Fondos en paralelas (enfocado en pecho)
(
    '10000000-0001-0000-0000-000000000010'::uuid,
    'Fondos en paralelas (enfocado en pecho)',
    'system',
    null,
    'chest_lower',
    'parallel_bars',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Sostenete en las barras paralelas con los brazos extendidos y el torso levemente inclinado hacia adelante.", "Flexioná los codos bajando el cuerpo hasta que los hombros estén al nivel de los codos.", "Mantené los codos apuntando ligeramente hacia afuera para activar el pecho.", "Empujá el cuerpo hacia arriba extendiendo los brazos hasta volver a la posición inicial.", "Evitá balancearte y controlá la bajada en todo momento."]'::jsonb,
    '["parallel_bars"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Flexiones de brazos (push-ups)
(
    '10000000-0001-0000-0000-000000000011'::uuid,
    'Flexiones de brazos (push-ups)',
    'system',
    null,
    'chest_middle',
    'bodyweight',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis"]'::jsonb,
    '["Colocá las manos en el suelo un poco más anchas que los hombros y estirá las piernas hacia atrás.", "Mantené el cuerpo recto desde la cabeza hasta los talones.", "Bajá el pecho hacia el suelo flexionando los codos a unos 90 grados.", "Empujá el suelo extendiendo los brazos y regresá a la posición inicial.", "Evitá arquear la espalda o levantar la cadera durante el movimiento."]'::jsonb,
    '["bodyweight"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000015"]'::jsonb,
    'weight_reps'
),

-- Flexiones declinadas
(
    '10000000-0001-0000-0000-000000000012'::uuid,
    'Flexiones declinadas',
    'system',
    null,
    'chest_upper',
    'bodyweight',
    'compound',
    '["triceps", "front_delts", "rectus_abdominis"]'::jsonb,
    '["Apoyá los pies sobre un banco o superficie elevada y las manos en el suelo a la altura de los hombros.", "Mantené el cuerpo alineado desde los talones hasta la cabeza.", "Bajá el pecho hacia el suelo flexionando los codos hasta que estén a 90 grados.", "Empujá el cuerpo hacia arriba extendiendo los brazos por completo.", "Mantené la tensión en el abdomen para evitar hundir la cadera."]'::jsonb,
    '["bodyweight", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004"]'::jsonb,
    'weight_reps'
),

-- Press en máquina de pecho
(
    '10000000-0001-0000-0000-000000000013'::uuid,
    'Press en máquina de pecho',
    'system',
    null,
    'chest_middle',
    'chest_press_machine',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Ajustá el asiento de la máquina para que las empuñaduras estén a la altura del pecho.", "Sentate con la espalda apoyada y los pies firmes en el suelo.", "Tomá las empuñaduras con agarre pronado y los codos a 90 grados.", "Empujá las manijas hacia adelante hasta extender los brazos sin bloquear los codos.", "Volvé lentamente a la posición inicial controlando la resistencia.", "Evitá despegar la espalda del respaldo."]'::jsonb,
    '["chest_press_machine"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000008"]'::jsonb,
    'weight_reps'
),

-- Press en máquina Smith
(
    '10000000-0001-0000-0000-000000000014'::uuid,
    'Press en máquina Smith',
    'system',
    null,
    'chest_middle',
    'smith_machine',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Colocá un banco plano debajo de la barra Smith y acostate con los pies firmes en el suelo.", "Ajustá la barra a una altura cómoda para poder extender los brazos completamente.", "Tomá la barra con agarre pronado un poco más ancho que los hombros.", "Desbloqueá la barra, bajala controladamente hasta tocar el pecho medio y empujá hacia arriba.", "Mantené los omóplatos retraídos y el abdomen firme durante el movimiento."]'::jsonb,
    '["smith_machine", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con banda elástica
(
    '10000000-0001-0000-0000-000000000015'::uuid,
    'Press con banda elástica',
    'system',
    null,
    'chest_middle',
    'resistance_band',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Anclá la banda elástica a una estructura estable a la altura del pecho.", "Sujetá los extremos de la banda y da un paso hacia adelante para generar tensión.", "Con el torso levemente inclinado, empujá las manos hacia adelante hasta extender los brazos.", "Regresá lentamente a la posición inicial controlando la resistencia.", "Mantené el abdomen firme y los codos levemente flexionados todo el tiempo."]'::jsonb,
    '["resistance_band"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000011"]'::jsonb,
    'weight_reps'
),

-- Press de banca con agarre cerrado
(
    '10000000-0001-0000-0000-000000000016'::uuid,
    'Press de banca con agarre cerrado',
    'system',
    null,
    'triceps',
    'barbell',
    'compound',
    '["chest_middle", "front_delts"]'::jsonb,
    '["Acuéstate boca arriba en un banco plano con los pies apoyados en el suelo", "Agarra la barra con las manos separadas al ancho de los hombros o un poco menos, con agarre pronado", "Despega la barra del soporte y posiciónala sobre tu pecho con los brazos extendidos", "Baja la barra lentamente hacia la parte inferior del pecho manteniendo los codos cerca del cuerpo", "Empuja la barra hacia arriba hasta extender completamente los brazos sin bloquear los codos", "Mantén los omóplatos retraídos y evita abrir los codos durante todo el movimiento"]'::jsonb,
    '["barbell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002", "10000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press inclinado con agarre cerrado
(
    '10000000-0001-0000-0000-000000000017'::uuid,
    'Press inclinado con agarre cerrado',
    'system',
    null,
    'chest_upper',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Ajustá el banco a una inclinación de unos 30 a 45 grados", "Acuéstate y agarra la barra con las manos al ancho de los hombros, con agarre pronado", "Despega la barra y sostenela sobre el pecho superior con los brazos extendidos", "Baja la barra de forma controlada hasta la parte alta del pecho manteniendo los codos cerca del torso", "Empuja la barra hacia arriba extendiendo los brazos hasta la posición inicial", "Conservá los omóplatos retraídos y el pecho elevado durante todo el movimiento"]'::jsonb,
    '["barbell", "incline_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000003", "10000000-0001-0000-0000-000000000004", "10000000-0001-0000-0000-000000000018"]'::jsonb,
    'weight_reps'
),

-- Press en suelo (Floor Press)
(
    '10000000-0001-0000-0000-000000000018'::uuid,
    'Press en suelo (Floor Press)',
    'system',
    null,
    'chest_middle',
    'barbell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Recostate en el suelo boca arriba con las rodillas flexionadas y los pies apoyados", "Sostené la barra con las manos un poco más separadas que el ancho de los hombros", "Extiende los brazos y posicioná la barra sobre el pecho", "Bajá la barra de forma controlada hasta que los tríceps toquen el suelo", "Empujá la barra hacia arriba hasta extender completamente los brazos", "Evitá arquear la espalda o levantar los glúteos del suelo"]'::jsonb,
    '["barbell"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000014", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
),

-- Press con kettlebell
(
    '10000000-0001-0000-0000-000000000019'::uuid,
    'Press con kettlebell',
    'system',
    null,
    'chest_middle',
    'kettlebell',
    'compound',
    '["triceps", "front_delts"]'::jsonb,
    '["Acuéstate en un banco plano sosteniendo una kettlebell en cada mano con agarre firme", "Coloca las kettlebells sobre el pecho con los brazos extendidos", "Baja las kettlebells de forma controlada hacia los lados del pecho", "Empuja las kettlebells hacia arriba hasta extender completamente los brazos", "Mantén el equilibrio y control durante todo el movimiento evitando que las kettlebells se balanceen"]'::jsonb,
    '["kettlebell", "flat_bench"]'::jsonb,
    '["10000000-0001-0000-0000-000000000001", "10000000-0001-0000-0000-000000000002"]'::jsonb,
    'weight_reps'
);

-- Verificar la inserción
SELECT COUNT(*) as total_ejercicios_pecho 
FROM exercises 
WHERE source = 'system' AND main_muscle_group IN ('chest_middle', 'chest_upper', 'chest_lower', 'triceps');
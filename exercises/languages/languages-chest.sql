-- ============================================================================
-- TRADUCCIONES DE EJERCICIOS - GRUPO: PECHO
-- ============================================================================
-- Tabla: exercise_translations
-- Campos: exercise_id, language_code, name, name_search, instructions

-- ============================================================================
-- ESPAÑOL (es)
-- ============================================================================

INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions) VALUES

-- Press de banca con barra
(
    '10000000-0001-0000-0000-000000000001',
    'es',
    'Press de banca con barra',
    'press de banca con barra',
    '["Acuéstate boca arriba en un banco plano con los pies firmes en el suelo y la espalda ligeramente arqueada.", "Sujeta la barra con un agarre pronado, un poco más ancho que el ancho de los hombros.", "Desengancha la barra del soporte y mantenela sobre el pecho con los brazos extendidos.", "Bajá la barra de manera controlada hasta que toque suavemente el pecho a la altura de los pezones.", "Empujá la barra hacia arriba extendiendo los brazos sin bloquear los codos completamente.", "Mantené los omóplatos retraídos y la tensión en el pecho durante todo el movimiento."]'::jsonb
),

-- Press de banca con mancuernas
(
    '10000000-0001-0000-0000-000000000002',
    'es',
    'Press de banca con mancuernas',
    'press de banca con mancuernas',
    '["Acuéstate en un banco plano sosteniendo una mancuerna en cada mano sobre tu pecho con los brazos extendidos.", "Mantén las palmas mirando hacia adelante y los pies firmes en el suelo.", "Desciende lentamente las mancuernas hacia los lados del pecho hasta que los codos queden ligeramente por debajo del banco.", "Presiona las mancuernas hacia arriba juntándolas ligeramente en la parte superior sin golpearlas.", "Controlá el descenso en cada repetición y mantené los omóplatos retraídos."]'::jsonb
),

-- Press inclinado con barra
(
    '10000000-0001-0000-0000-000000000003',
    'es',
    'Press inclinado con barra',
    'press inclinado con barra',
    '["Ajustá el banco a un ángulo de 30° a 45° e instalá la barra en el soporte superior.", "Acuéstate y sujetá la barra con un agarre un poco más ancho que el ancho de los hombros.", "Descolgá la barra y sostenela sobre la parte superior del pecho.", "Bajá la barra lentamente hasta que toque suavemente el pecho superior.", "Empujá la barra hacia arriba extendiendo los brazos completamente.", "Mantené la retracción escapular y la mirada fija al techo durante todo el movimiento."]'::jsonb
),

-- Press inclinado con mancuernas
(
    '10000000-0001-0000-0000-000000000004',
    'es',
    'Press inclinado con mancuernas',
    'press inclinado con mancuernas',
    '["Ajustá el respaldo del banco entre 30° y 45° e incliná ligeramente la espalda.", "Sostené una mancuerna en cada mano sobre el pecho con los brazos extendidos y las palmas mirando al frente.", "Descendé lentamente las mancuernas hacia los costados del pecho superior.", "Empujá las mancuernas hacia arriba juntándolas ligeramente arriba sin perder la tensión.", "Mantené los pies firmes, el abdomen contraído y los omóplatos retraídos."]'::jsonb
),

-- Press declinado con barra
(
    '10000000-0001-0000-0000-000000000005',
    'es',
    'Press declinado con barra',
    'press declinado con barra',
    '["Ajustá el banco declinado y asegurá tus piernas en el soporte para estabilidad.", "Tomá la barra con un agarre pronado, apenas más ancho que los hombros.", "Descolgá la barra y mantenela extendida sobre el pecho inferior.", "Bajá la barra de manera controlada hasta que toque ligeramente el pecho bajo.", "Empujá la barra hacia arriba hasta extender los brazos sin bloquear los codos.", "Mantené la tensión constante en el pecho y no arquees excesivamente la espalda."]'::jsonb
),

-- Aperturas con mancuernas en banco plano
(
    '10000000-0001-0000-0000-000000000006',
    'es',
    'Aperturas con mancuernas en banco plano',
    'aperturas con mancuernas en banco plano',
    '["Acuéstate en un banco plano con una mancuerna en cada mano sobre el pecho, con los brazos extendidos y las palmas enfrentadas.", "Con un leve doblez en los codos, abrí los brazos hacia los costados hasta sentir el estiramiento en el pecho.", "Evitá bajar demasiado para no comprometer los hombros.", "Llevá las mancuernas nuevamente hacia arriba siguiendo el mismo arco hasta que casi se toquen.", "Controlá el movimiento en todo momento y mantené la contracción del pecho al final."]'::jsonb
),

-- Aperturas con mancuernas en banco inclinado
(
    '10000000-0001-0000-0000-000000000007',
    'es',
    'Aperturas con mancuernas en banco inclinado',
    'aperturas con mancuernas en banco inclinado',
    '["Ajustá el banco a 30°-45° y sostené una mancuerna en cada mano con las palmas enfrentadas.", "Con los brazos ligeramente flexionados, abrí lentamente los brazos hacia los costados hasta sentir el estiramiento en el pecho superior.", "Evitá bajar más allá del nivel del hombro.", "Juntá las mancuernas siguiendo el mismo arco de movimiento hasta la posición inicial.", "Mantené el control del peso y el pecho activado en todo momento."]'::jsonb
),

-- Aperturas en máquina o contractor
(
    '10000000-0001-0000-0000-000000000008',
    'es',
    'Aperturas en máquina o contractor',
    'aperturas en maquina o contractor pec deck',
    '["Sentate en la máquina con la espalda apoyada y los pies firmes en el suelo.", "Ajustá el asiento para que las empuñaduras queden a la altura del pecho.", "Tomá las manijas con los codos ligeramente flexionados.", "Empujá las empuñaduras hacia adelante hasta que casi se toquen frente a tu pecho.", "Volvé lentamente a la posición inicial controlando el retorno.", "Mantené el pecho firme y evitá estirar completamente los codos."]'::jsonb
),

-- Cruce de poleas (cable crossover)
(
    '10000000-0001-0000-0000-000000000009',
    'es',
    'Cruce de poleas (cable crossover)',
    'cruce de poleas cable crossover',
    '["Colocate en el centro entre dos poleas altas, sujetando una manija en cada mano.", "Dá un paso al frente con una pierna y mantené una ligera inclinación del torso.", "Con los codos levemente flexionados, llevá las manos al frente del pecho siguiendo un arco amplio.", "Contraé el pecho en la posición final y mantené un segundo la tensión.", "Volvé lentamente a la posición inicial controlando el movimiento.", "Evitá mover los hombros o balancear el cuerpo."]'::jsonb
),

-- Fondos en paralelas (enfocado en pecho)
(
    '10000000-0001-0000-0000-000000000010',
    'es',
    'Fondos en paralelas (enfocado en pecho)',
    'fondos en paralelas enfocado en pecho dips',
    '["Sostenete en las barras paralelas con los brazos extendidos y el torso levemente inclinado hacia adelante.", "Flexioná los codos bajando el cuerpo hasta que los hombros estén al nivel de los codos.", "Mantené los codos apuntando ligeramente hacia afuera para activar el pecho.", "Empujá el cuerpo hacia arriba extendiendo los brazos hasta volver a la posición inicial.", "Evitá balancearte y controlá la bajada en todo momento."]'::jsonb
),

-- Flexiones de brazos (push-ups)
(
    '10000000-0001-0000-0000-000000000011',
    'es',
    'Flexiones de brazos (push-ups)',
    'flexiones de brazos push ups lagartijas',
    '["Colocá las manos en el suelo un poco más anchas que los hombros y estirá las piernas hacia atrás.", "Mantené el cuerpo recto desde la cabeza hasta los talones.", "Bajá el pecho hacia el suelo flexionando los codos a unos 90 grados.", "Empujá el suelo extendiendo los brazos y regresá a la posición inicial.", "Evitá arquear la espalda o levantar la cadera durante el movimiento."]'::jsonb
),

-- Flexiones declinadas
(
    '10000000-0001-0000-0000-000000000012',
    'es',
    'Flexiones declinadas',
    'flexiones declinadas push ups',
    '["Apoyá los pies sobre un banco o superficie elevada y las manos en el suelo a la altura de los hombros.", "Mantené el cuerpo alineado desde los talones hasta la cabeza.", "Bajá el pecho hacia el suelo flexionando los codos hasta que estén a 90 grados.", "Empujá el cuerpo hacia arriba extendiendo los brazos por completo.", "Mantené la tensión en el abdomen para evitar hundir la cadera."]'::jsonb
),

-- Press en máquina de pecho
(
    '10000000-0001-0000-0000-000000000013',
    'es',
    'Press en máquina de pecho',
    'press en maquina de pecho',
    '["Ajustá el asiento de la máquina para que las empuñaduras estén a la altura del pecho.", "Sentate con la espalda apoyada y los pies firmes en el suelo.", "Tomá las empuñaduras con agarre pronado y los codos a 90 grados.", "Empujá las manijas hacia adelante hasta extender los brazos sin bloquear los codos.", "Volvé lentamente a la posición inicial controlando la resistencia.", "Evitá despegar la espalda del respaldo."]'::jsonb
),

-- Press en máquina Smith
(
    '10000000-0001-0000-0000-000000000014',
    'es',
    'Press en máquina Smith',
    'press en maquina smith',
    '["Colocá un banco plano debajo de la barra Smith y acostate con los pies firmes en el suelo.", "Ajustá la barra a una altura cómoda para poder extender los brazos completamente.", "Tomá la barra con agarre pronado un poco más ancho que los hombros.", "Desbloqueá la barra, bajala controladamente hasta tocar el pecho medio y empujá hacia arriba.", "Mantené los omóplatos retraídos y el abdomen firme durante el movimiento."]'::jsonb
),

-- Press con banda elástica
(
    '10000000-0001-0000-0000-000000000015',
    'es',
    'Press con banda elástica',
    'press con banda elastica resistance band',
    '["Anclá la banda elástica a una estructura estable a la altura del pecho.", "Sujetá los extremos de la banda y da un paso hacia adelante para generar tensión.", "Con el torso levemente inclinado, empujá las manos hacia adelante hasta extender los brazos.", "Regresá lentamente a la posición inicial controlando la resistencia.", "Mantené el abdomen firme y los codos levemente flexionados todo el tiempo."]'::jsonb
),

-- Press de banca con agarre cerrado
(
    '10000000-0001-0000-0000-000000000016',
    'es',
    'Press de banca con agarre cerrado',
    'press de banca con agarre cerrado close grip',
    '["Acuéstate boca arriba en un banco plano con los pies apoyados en el suelo", "Agarra la barra con las manos separadas al ancho de los hombros o un poco menos, con agarre pronado", "Despega la barra del soporte y posiciónala sobre tu pecho con los brazos extendidos", "Baja la barra lentamente hacia la parte inferior del pecho manteniendo los codos cerca del cuerpo", "Empuja la barra hacia arriba hasta extender completamente los brazos sin bloquear los codos", "Mantén los omóplatos retraídos y evita abrir los codos durante todo el movimiento"]'::jsonb
),

-- Press inclinado con agarre cerrado
(
    '10000000-0001-0000-0000-000000000017',
    'es',
    'Press inclinado con agarre cerrado',
    'press inclinado con agarre cerrado close grip',
    '["Ajustá el banco a una inclinación de unos 30 a 45 grados", "Acuéstate y agarra la barra con las manos al ancho de los hombros, con agarre pronado", "Despega la barra y sostenela sobre el pecho superior con los brazos extendidos", "Baja la barra de forma controlada hasta la parte alta del pecho manteniendo los codos cerca del torso", "Empuja la barra hacia arriba extendiendo los brazos hasta la posición inicial", "Conservá los omóplatos retraídos y el pecho elevado durante todo el movimiento"]'::jsonb
),

-- Press en suelo (Floor Press)
(
    '10000000-0001-0000-0000-000000000018',
    'es',
    'Press en suelo (Floor Press)',
    'press en suelo floor press',
    '["Recostate en el suelo boca arriba con las rodillas flexionadas y los pies apoyados", "Sostené la barra con las manos un poco más separadas que el ancho de los hombros", "Extiende los brazos y posicioná la barra sobre el pecho", "Bajá la barra de forma controlada hasta que los tríceps toquen el suelo", "Empujá la barra hacia arriba hasta extender completamente los brazos", "Evitá arquear la espalda o levantar los glúteos del suelo"]'::jsonb
),

-- Press con kettlebell
(
    '10000000-0001-0000-0000-000000000019',
    'es',
    'Press con kettlebell',
    'press con kettlebell pesa rusa',
    '["Acuéstate en un banco plano sosteniendo una kettlebell en cada mano con agarre firme", "Coloca las kettlebells sobre el pecho con los brazos extendidos", "Baja las kettlebells de forma controlada hacia los lados del pecho", "Empuja las kettlebells hacia arriba hasta extender completamente los brazos", "Mantén el equilibrio y control durante todo el movimiento evitando que las kettlebells se balanceen"]'::jsonb
);

-- ============================================================================
-- ENGLISH (en)
-- ============================================================================

INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions) VALUES

-- Barbell Bench Press
(
    '10000000-0001-0000-0000-000000000001',
    'en',
    'Barbell Bench Press',
    'barbell bench press',
    '["Lie face up on a flat bench with your feet firmly on the floor and your back slightly arched.", "Grip the bar with an overhand grip, slightly wider than shoulder width.", "Unrack the bar and hold it over your chest with arms extended.", "Lower the bar in a controlled manner until it lightly touches your chest at nipple height.", "Push the bar up by extending your arms without fully locking the elbows.", "Keep your shoulder blades retracted and maintain chest tension throughout the movement."]'::jsonb
),

-- Dumbbell Bench Press
(
    '10000000-0001-0000-0000-000000000002',
    'en',
    'Dumbbell Bench Press',
    'dumbbell bench press',
    '["Lie on a flat bench holding a dumbbell in each hand over your chest with arms extended.", "Keep your palms facing forward and feet firmly on the floor.", "Slowly lower the dumbbells to the sides of your chest until your elbows are slightly below the bench.", "Press the dumbbells up, bringing them slightly together at the top without banging them.", "Control the descent on each rep and keep your shoulder blades retracted."]'::jsonb
),

-- Incline Barbell Press
(
    '10000000-0001-0000-0000-000000000003',
    'en',
    'Incline Barbell Press',
    'incline barbell press bench',
    '["Set the bench to a 30° to 45° angle and position the bar on the upper rack.", "Lie down and grip the bar slightly wider than shoulder width.", "Unrack the bar and hold it over your upper chest.", "Lower the bar slowly until it lightly touches your upper chest.", "Push the bar up by fully extending your arms.", "Maintain scapular retraction and keep your gaze fixed on the ceiling throughout."]'::jsonb
),

-- Incline Dumbbell Press
(
    '10000000-0001-0000-0000-000000000004',
    'en',
    'Incline Dumbbell Press',
    'incline dumbbell press bench',
    '["Set the bench backrest between 30° and 45° and lean back slightly.", "Hold a dumbbell in each hand over your chest with arms extended and palms facing forward.", "Slowly lower the dumbbells toward the sides of your upper chest.", "Press the dumbbells up, bringing them slightly together at the top without losing tension.", "Keep your feet firm, core engaged, and shoulder blades retracted."]'::jsonb
),

-- Decline Barbell Press
(
    '10000000-0001-0000-0000-000000000005',
    'en',
    'Decline Barbell Press',
    'decline barbell press bench',
    '["Set the decline bench and secure your legs in the support for stability.", "Grip the bar with an overhand grip, slightly wider than shoulder width.", "Unrack the bar and hold it extended over your lower chest.", "Lower the bar in a controlled manner until it lightly touches your lower chest.", "Push the bar up until your arms are extended without locking the elbows.", "Maintain constant chest tension and avoid excessive back arching."]'::jsonb
),

-- Flat Dumbbell Flyes
(
    '10000000-0001-0000-0000-000000000006',
    'en',
    'Flat Dumbbell Flyes',
    'flat dumbbell flyes fly chest',
    '["Lie on a flat bench with a dumbbell in each hand over your chest, arms extended and palms facing each other.", "With a slight bend in your elbows, open your arms to the sides until you feel a stretch in your chest.", "Avoid lowering too far to protect your shoulders.", "Bring the dumbbells back up following the same arc until they almost touch.", "Control the movement throughout and maintain chest contraction at the end."]'::jsonb
),

-- Incline Dumbbell Flyes
(
    '10000000-0001-0000-0000-000000000007',
    'en',
    'Incline Dumbbell Flyes',
    'incline dumbbell flyes fly chest',
    '["Set the bench to 30°-45° and hold a dumbbell in each hand with palms facing each other.", "With slightly bent arms, slowly open your arms to the sides until you feel a stretch in your upper chest.", "Avoid lowering beyond shoulder level.", "Bring the dumbbells together following the same arc back to the starting position.", "Maintain weight control and keep your chest engaged throughout."]'::jsonb
),

-- Pec Deck Machine
(
    '10000000-0001-0000-0000-000000000008',
    'en',
    'Pec Deck Machine',
    'pec deck machine fly chest contractor',
    '["Sit on the machine with your back supported and feet firmly on the floor.", "Adjust the seat so the handles are at chest height.", "Grab the handles with slightly bent elbows.", "Push the handles forward until they almost touch in front of your chest.", "Slowly return to the starting position controlling the return.", "Keep your chest firm and avoid fully extending your elbows."]'::jsonb
),

-- Cable Crossover
(
    '10000000-0001-0000-0000-000000000009',
    'en',
    'Cable Crossover',
    'cable crossover fly chest',
    '["Stand in the center between two high pulleys, holding a handle in each hand.", "Step forward with one leg and maintain a slight torso lean.", "With slightly bent elbows, bring your hands to the front of your chest in a wide arc.", "Contract your chest at the final position and hold the tension for a second.", "Slowly return to the starting position controlling the movement.", "Avoid moving your shoulders or swinging your body."]'::jsonb
),

-- Chest Dips
(
    '10000000-0001-0000-0000-000000000010',
    'en',
    'Chest Dips',
    'chest dips parallel bars',
    '["Support yourself on parallel bars with arms extended and torso slightly leaning forward.", "Bend your elbows lowering your body until your shoulders are at elbow level.", "Keep your elbows pointing slightly outward to activate the chest.", "Push your body up by extending your arms back to the starting position.", "Avoid swinging and control the descent throughout."]'::jsonb
),

-- Push-Ups
(
    '10000000-0001-0000-0000-000000000011',
    'en',
    'Push-Ups',
    'push ups pushups bodyweight chest',
    '["Place your hands on the floor slightly wider than shoulder width and extend your legs back.", "Keep your body straight from head to heels.", "Lower your chest toward the floor by bending your elbows to about 90 degrees.", "Push the floor away by extending your arms and return to the starting position.", "Avoid arching your back or raising your hips during the movement."]'::jsonb
),

-- Decline Push-Ups
(
    '10000000-0001-0000-0000-000000000012',
    'en',
    'Decline Push-Ups',
    'decline push ups pushups elevated',
    '["Place your feet on a bench or elevated surface and hands on the floor at shoulder width.", "Keep your body aligned from heels to head.", "Lower your chest toward the floor by bending your elbows to 90 degrees.", "Push your body up by fully extending your arms.", "Maintain core tension to prevent your hips from sagging."]'::jsonb
),

-- Chest Press Machine
(
    '10000000-0001-0000-0000-000000000013',
    'en',
    'Chest Press Machine',
    'chest press machine',
    '["Adjust the machine seat so the handles are at chest height.", "Sit with your back supported and feet firmly on the floor.", "Grip the handles with an overhand grip and elbows at 90 degrees.", "Push the handles forward until your arms are extended without locking the elbows.", "Slowly return to the starting position controlling the resistance.", "Avoid lifting your back off the backrest."]'::jsonb
),

-- Smith Machine Bench Press
(
    '10000000-0001-0000-0000-000000000014',
    'en',
    'Smith Machine Bench Press',
    'smith machine bench press',
    '["Place a flat bench under the Smith bar and lie down with feet firmly on the floor.", "Adjust the bar to a comfortable height to fully extend your arms.", "Grip the bar with an overhand grip slightly wider than shoulder width.", "Unlock the bar, lower it controlled to touch your mid-chest, and push up.", "Keep your shoulder blades retracted and core engaged throughout."]'::jsonb
),

-- Resistance Band Chest Press
(
    '10000000-0001-0000-0000-000000000015',
    'en',
    'Resistance Band Chest Press',
    'resistance band chest press elastic',
    '["Anchor the resistance band to a stable structure at chest height.", "Hold the ends of the band and step forward to create tension.", "With a slight torso lean, push your hands forward until arms are extended.", "Slowly return to the starting position controlling the resistance.", "Keep your core engaged and elbows slightly bent throughout."]'::jsonb
),

-- Close Grip Bench Press
(
    '10000000-0001-0000-0000-000000000016',
    'en',
    'Close Grip Bench Press',
    'close grip bench press narrow',
    '["Lie face up on a flat bench with feet on the floor.", "Grip the bar with hands shoulder-width apart or slightly narrower, overhand grip.", "Unrack the bar and position it over your chest with arms extended.", "Lower the bar slowly toward your lower chest keeping elbows close to your body.", "Push the bar up until arms are fully extended without locking elbows.", "Keep shoulder blades retracted and avoid flaring elbows throughout."]'::jsonb
),

-- Close Grip Incline Press
(
    '10000000-0001-0000-0000-000000000017',
    'en',
    'Close Grip Incline Press',
    'close grip incline press narrow',
    '["Set the bench to a 30 to 45 degree incline.", "Lie down and grip the bar at shoulder width with an overhand grip.", "Unrack the bar and hold it over your upper chest with arms extended.", "Lower the bar in a controlled manner to your upper chest keeping elbows close to torso.", "Push the bar up extending your arms to the starting position.", "Keep shoulder blades retracted and chest elevated throughout."]'::jsonb
),

-- Floor Press
(
    '10000000-0001-0000-0000-000000000018',
    'en',
    'Floor Press',
    'floor press barbell',
    '["Lie on the floor face up with knees bent and feet flat.", "Hold the bar with hands slightly wider than shoulder width.", "Extend your arms and position the bar over your chest.", "Lower the bar in a controlled manner until your triceps touch the floor.", "Push the bar up until arms are fully extended.", "Avoid arching your back or lifting your glutes off the floor."]'::jsonb
),

-- Kettlebell Chest Press
(
    '10000000-0001-0000-0000-000000000019',
    'en',
    'Kettlebell Chest Press',
    'kettlebell chest press bench',
    '["Lie on a flat bench holding a kettlebell in each hand with a firm grip.", "Position the kettlebells over your chest with arms extended.", "Lower the kettlebells in a controlled manner toward the sides of your chest.", "Push the kettlebells up until arms are fully extended.", "Maintain balance and control throughout avoiding kettlebell swinging."]'::jsonb
);

-- Verificar la inserción
SELECT language_code, COUNT(*) as total 
FROM exercise_translations 
WHERE exercise_id::text LIKE '10000000-0001-%'
GROUP BY language_code;

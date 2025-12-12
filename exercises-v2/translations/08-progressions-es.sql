-- =============================================
-- PROGRESSIONS EXERCISES - SPANISH TRANSLATIONS
-- =============================================

-- 1. Scapular Pulls
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000001',
  'es',
  'Jalones escapulares',
  'jalones escapulares colgado activacion escapulas retraccion hombros',
  '[
    "Colgá de una barra con brazos completamente extendidos.",
    "Sin doblar los codos, tirá las escápulas hacia abajo y atrás.",
    "Tu cuerpo debería subir levemente al activar los dorsales.",
    "Mantené la posición arriba sintiendo la contracción en los dorsales.",
    "Relajá lentamente volviendo a la posición de colgado pasivo.",
    "Repetí el número deseado de repeticiones."
  ]',
  '["Doblar los codos para ayudarse", "Usar impulso o balanceo", "No relajar completamente entre reps", "Encoger hombros en vez de deprimirlos"]'
);

-- 2. Arch Hangs
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000002',
  'es',
  'Colgado arqueado',
  'colgado arqueado arch hang activo espalda arqueada activacion dorsal',
  '[
    "Empezá en un colgado pasivo con brazos completamente extendidos.",
    "Deprimí las escápulas, tirándolas hacia abajo y atrás.",
    "Arqueá la espalda mientras empujás el pecho hacia adelante y arriba.",
    "Tu pecho debería mirar hacia arriba con un arco pronunciado en la espalda alta.",
    "Mantené esta posición activa por el tiempo indicado.",
    "Enfocate en mantener los hombros alejados de las orejas."
  ]',
  '["Relajarse en un colgado pasivo", "Doblar los codos", "No arquear suficiente la espalda alta", "Aguantar la respiración en vez de respirar constantemente"]'
);

-- 3. Negative Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000003',
  'es',
  'Dominadas negativas',
  'dominadas negativas excentrica pullup bajada menton sobre barra',
  '[
    "Usá una caja o saltá para quedar con la pera sobre la barra.",
    "Agarrá la barra con manos al ancho de hombros, palmas hacia afuera.",
    "Empezá con la pera sobre la barra y codos completamente flexionados.",
    "Bajá lentamente en 3-5 segundos.",
    "Controlá el descenso todo el camino hasta quedar colgado.",
    "Volvé a subir y repetí el número deseado de reps."
  ]',
  '["Bajar muy rápido sin control", "No empezar con la pera completamente sobre la barra", "Dejarte caer de golpe abajo", "Usar kipping o impulso para subir"]'
);

-- 4. Weighted Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000004',
  'es',
  'Dominadas con peso',
  'dominadas peso lastre cinturon chaleco mancuerna',
  '[
    "Agregá peso usando un cinturón de lastre, chaleco con peso, o mancuerna entre los pies.",
    "Agarrá la barra con manos al ancho de hombros, palmas hacia afuera.",
    "Empezá colgado con brazos completamente extendidos.",
    "Subí hasta que la pera pase la barra.",
    "Bajá con control hasta la posición de colgado.",
    "Progresá el peso gradualmente a medida que te fortalecés."
  ]',
  '["Agregar demasiado peso muy pronto", "Usar kipping o impulso", "No lograr rango completo de movimiento", "Balancear el peso durante el movimiento"]'
);

-- 5. L-sit Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000005',
  'es',
  'Dominadas en L',
  'dominadas L piernas horizontales core compresion l-sit pull-ups pullups',
  '[
    "Colgá de la barra y levantá las piernas a 90 grados, paralelas al piso.",
    "Mantené las piernas rectas y juntas durante todo el movimiento.",
    "Manteniendo la posición de L, subí hasta que la pera pase la barra.",
    "Bajá con control manteniendo las piernas a 90 grados.",
    "Enfocate en mantener el core apretado y piernas paralelas.",
    "Volvé a extensión completa de brazos antes de la siguiente rep."
  ]',
  '["Dejar caer las piernas durante la subida", "Doblar las rodillas para hacerlo más fácil", "Perder la L en la parte alta del movimiento", "No mantener tensión en el core"]'
);

-- 6. Archer Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000006',
  'es',
  'Dominadas arquero',
  'dominadas arquero archer pull-ups pullup un brazo progresion asimetrica agarre ancho',
  '[
    "Agarrá la barra más ancho que el ancho de hombros.",
    "Subí hacia una mano mientras extendés el otro brazo recto.",
    "Arriba, un brazo debería estar doblado mientras el otro está casi recto.",
    "Bajá con control a la posición inicial.",
    "Alterná lados con cada rep o completá todas las reps de un lado primero.",
    "Cuanto más recto el brazo asistente, más difícil el ejercicio."
  ]',
  '["Doblar demasiado el brazo asistente", "No subir suficientemente alto hacia un lado", "Usar impulso en vez de fuerza controlada", "Agarre muy angosto para lograr la forma correcta"]'
);

-- 7. Typewriter Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000007',
  'es',
  'Dominadas máquina de escribir',
  'dominadas maquina escribir typewriter pull-ups pullup lateral lado a lado',
  '[
    "Agarrá la barra más ancho que el ancho de hombros.",
    "Subí hasta que la pera esté sobre la barra.",
    "Manteniéndote arriba, desplazá el cuerpo hacia una mano.",
    "Movete horizontalmente hacia la otra mano como máquina de escribir.",
    "Mantené la pera sobre la barra durante todo el movimiento lateral.",
    "Bajá y repetí, alternando la dirección de viaje."
  ]',
  '["Caer debajo de la barra durante el desplazamiento", "Moverte muy rápido sin control", "No ir completamente hacia cada lado", "Usar un agarre muy angosto"]'
);

-- 8. One Arm Pull-up
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000008',
  'es',
  'Dominada a un brazo',
  'dominada un brazo single arm pullup avanzado OAP',
  '[
    "Colgá de la barra usando solo un brazo.",
    "Poné la mano libre detrás de la espalda o al costado.",
    "Activá el dorsal y subí la pera sobre la barra usando un brazo.",
    "Controlá el movimiento, evitando rotación excesiva.",
    "Bajá con control hasta quedar colgado completamente.",
    "Esto requiere años de entrenamiento para lograr de forma segura."
  ]',
  '["Intentar antes de desarrollar fuerza adecuada", "Rotación excesiva del cuerpo durante la subida", "Usar impulso o kipping", "No lograr rango completo de movimiento"]'
);

-- 9. High Pull-ups (Chest to Bar)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000009',
  'es',
  'Dominadas altas (Pecho a barra)',
  'dominadas altas pecho barra C2B chest to bar explosiva progresion muscle up high pull-ups',
  '[
    "Agarrá la barra con manos al ancho de hombros.",
    "Empezá colgado con hombros activados.",
    "Tirá explosivamente, llevando los codos hacia abajo y atrás.",
    "Seguí tirando hasta que el pecho toque la barra.",
    "Bajá con control a la posición inicial.",
    "Enfocate en el tirón explosivo necesario para muscle-ups."
  ]',
  '["Solo subir la pera a altura de barra", "No tirar lo suficientemente explosivo", "Kipping excesivo sin control", "Dejar que los hombros se desactiven abajo"]'
);

-- 10. False Grip Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000010',
  'es',
  'Dominadas con agarre falso',
  'dominadas agarre falso false grip pull-ups anillas rings muñeca flexionada transicion muscle up',
  '[
    "Agarrá las anillas con las muñecas flexionadas sobre las anillas (agarre falso).",
    "Las muñecas deben estar dobladas para que la base de la palma esté sobre la anilla.",
    "Desde colgado, subí manteniendo el agarre falso.",
    "Continuá hasta que el pecho llegue a altura de anillas.",
    "Bajá con control manteniendo el agarre falso todo el tiempo.",
    "Este agarre es esencial para muscle-ups en anillas."
  ]',
  '["Perder el agarre falso durante la subida", "Agarrar muy liviano", "No subir lo suficiente", "Muñecas enderezándose a mitad del movimiento"]'
);

-- 11. Muscle-up Negative
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000011',
  'es',
  'Muscle-up negativo',
  'muscle up negativo negative eccentric excentrica transicion bajada barra anillas rings',
  '[
    "Empezá en la posición de apoyo arriba de la barra o anillas.",
    "Los brazos deben estar rectos, soportando tu cuerpo sobre el aparato.",
    "Lentamente inclinate hacia adelante y comenzá a bajar por la transición.",
    "Controlá el descenso en 3-5 segundos por la parte más difícil.",
    "Continuá bajando hasta quedar colgado.",
    "Usá una caja para volver arriba y repetí."
  ]',
  '["Dejarte caer por la transición muy rápido", "No controlar la inclinación hacia adelante", "Empezar sin posición de apoyo correcta", "Apurar la fase excéntrica"]'
);

-- 12. Muscle-up (Bar)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000012',
  'es',
  'Muscle-up en barra',
  'muscle up barra bar muscle-up transicion tiron explosivo calistenia',
  '[
    "Agarrá la barra con manos al ancho de hombros, usando leve agarre falso.",
    "Empezá con un pequeño balanceo o desde colgado.",
    "Tirá explosivamente, llevando el pecho a la barra.",
    "Al llegar arriba, inclinate hacia adelante y pasá el pecho sobre la barra.",
    "Empujá hacia abajo para extender los brazos y terminar en posición de apoyo.",
    "Bajá con control o dejate caer y reseteá."
  ]',
  '["No subir suficiente antes de la transición", "Subir un brazo a la vez (chicken wing)", "Demasiado kip sin fuerza", "No inclinarse suficiente hacia adelante en la transición"]'
);

-- 13. Ring Muscle-up
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000013',
  'es',
  'Muscle-up en anillas',
  'muscle up anillas ring muscle-up rings gimnasia transicion',
  '[
    "Agarrá las anillas con agarre falso, muñecas sobre las anillas.",
    "Empezá colgado con anillas levemente rotadas hacia afuera.",
    "Subí manteniendo el agarre falso.",
    "Cuando el pecho llegue a altura de anillas, inclinate hacia adelante en la transición.",
    "Empujá hasta brazos rectos en posición de apoyo.",
    "Las anillas deben estar rotadas hacia afuera (RTO) arriba."
  ]',
  '["Perder el agarre falso durante el movimiento", "Altura de tirón insuficiente", "No inclinarse suficiente hacia adelante en transición", "Anillas rotadas hacia adentro arriba en vez de afuera"]'
);

-- 14. Incline Inverted Row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000014',
  'es',
  'Remo invertido inclinado',
  'remo invertido inclinado bodyweight angulo elevado principiante',
  '[
    "Colocá una barra a altura del pecho o usá anillas/TRX a altura apropiada.",
    "Agarrá la barra y caminá los pies hacia adelante, cuerpo inclinado.",
    "Cuanto más vertical tu cuerpo, más fácil el ejercicio.",
    "Tirá el pecho hacia la barra, juntando las escápulas.",
    "Bajá con control hasta brazos extendidos.",
    "Progresá caminando los pies más adelante para aumentar dificultad."
  ]',
  '["Caderas caídas durante el movimiento", "No llevar el pecho completamente a la barra", "Codos abriéndose a 90 grados", "No controlar la fase de bajada"]'
);

-- 15. Wide Grip Inverted Row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000015',
  'es',
  'Remo invertido agarre ancho',
  'remo invertido agarre ancho horizontal deltoides posterior espalda alta',
  '[
    "Agarrá la barra más ancho que el ancho de hombros.",
    "Posicioná tu cuerpo en línea recta de cabeza a talones.",
    "Tirá el pecho hacia la barra, llevando los codos hacia afuera.",
    "Juntá las escápulas arriba.",
    "Bajá con control hasta extensión completa de brazos.",
    "Mantené el cuerpo rígido como una plancha todo el tiempo."
  ]',
  '["Caderas caídas o levantadas", "No lograr rango completo de movimiento", "Tirar con brazos en vez de espalda", "Perder tensión corporal durante el movimiento"]'
);

-- 16. Tuck Front Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000016',
  'es',
  'Front lever agrupado',
  'front lever agrupado tuck front lever horizontal isometrico barra anillas rings',
  '[
    "Colgá de una barra o anillas con brazos completamente extendidos.",
    "Llevá las rodillas apretadas hacia el pecho en posición agrupada.",
    "Activá los dorsales y llevá el cuerpo a horizontal.",
    "Mantené las caderas a altura de hombros con espalda paralela al piso.",
    "Los brazos deben permanecer rectos durante todo el aguante.",
    "Enfocate en deprimir los hombros y activar el core."
  ]',
  '["Caderas muy bajas, sin lograr horizontal", "Doblar los brazos", "No agrupar las rodillas lo suficiente", "Hombros encogiéndose hacia las orejas"]'
);

-- 17. Advanced Tuck Front Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000017',
  'es',
  'Front lever agrupado avanzado',
  'front lever agrupado avanzado advanced tuck espalda plana horizontal progresion',
  '[
    "Empezá en posición de front lever agrupado.",
    "Abrí el ángulo de cadera para que los muslos estén perpendiculares al torso.",
    "Mantené la espalda plana, no redondeada como en el agrupado básico.",
    "Mantené brazos rectos y hombros deprimidos.",
    "Tu cuerpo desde hombros hasta rodillas debe estar horizontal.",
    "Esto es significativamente más difícil que el agrupado básico."
  ]',
  '["Redondear la espalda como en agrupado básico", "No abrir ángulo de cadera a 90 grados", "Caderas cayendo debajo de altura de hombros", "Doblar brazos para compensar debilidad"]'
);

-- 18. Straddle Front Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000018',
  'es',
  'Front lever abierto',
  'front lever abierto straddle front lever horizontal piernas separadas progresion',
  '[
    "Colgá de una barra o anillas con brazos extendidos.",
    "Llevá el cuerpo a horizontal con piernas separadas y abiertas.",
    "Mantené las piernas rectas y tan abiertas como permita tu flexibilidad.",
    "Mantené el cuerpo plano de cabeza a pies, paralelo al piso.",
    "Los brazos quedan rectos con hombros deprimidos.",
    "Mayor apertura lo hace más fácil; trabajá hacia cerrar con el tiempo."
  ]',
  '["Caderas cayendo debajo de hombros", "Doblar las rodillas", "No abrir las piernas lo suficiente", "Brazos doblándose durante el aguante"]'
);

-- 19. Full Front Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000019',
  'es',
  'Front lever completo',
  'front lever completo horizontal cuerpo recto avanzado calistenia',
  '[
    "Colgá de una barra o anillas con brazos completamente extendidos.",
    "Activá dorsales y core para llevar el cuerpo a horizontal.",
    "Mantené todo el cuerpo recto y paralelo al piso.",
    "Piernas juntas, puntas estiradas, todo en una línea.",
    "Los brazos permanecen rectos con hombros deprimidos.",
    "Aguantá por tiempo manteniendo posición perfecta."
  ]',
  '["Cualquier quiebre en el cuerpo (caderas caídas)", "Brazos doblándose", "Cabeza cayendo o subiendo", "No mantener tensión corporal completa"]'
);

-- 20. Front Lever Rows
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000020',
  'es',
  'Remos en front lever',
  'remos front lever horizontal dinamico avanzado tiron',
  '[
    "Empezá en posición de front lever (o progresión agrupada/abierta).",
    "Manteniendo posición horizontal del cuerpo, tirá el pecho a la barra.",
    "Mantené el cuerpo rígido y paralelo al piso todo el tiempo.",
    "Bajá con control hasta brazos rectos.",
    "Tu cuerpo no debe cambiar de ángulo durante el remo.",
    "Este es un ejercicio extremadamente demandante."
  ]',
  '["Ángulo del cuerpo cambiando durante el remo", "No llevar el pecho completamente a la barra", "Caderas cayendo durante el tirón", "Perder tensión corporal entre reps"]'
);

-- 21. Parallel Bar Support Hold
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000021',
  'es',
  'Apoyo en paralelas',
  'apoyo paralelas soporte isometrico bloqueo fondos',
  '[
    "Agarrá las paralelas y subí o empujá hasta brazos rectos.",
    "Bloqueá los codos completamente en la posición superior.",
    "Deprimí los hombros, empujándolos hacia abajo lejos de las orejas.",
    "Mantené el cuerpo quieto y el core activado.",
    "Mirá hacia adelante con columna neutral.",
    "Aguantá por el tiempo indicado manteniendo la posición."
  ]',
  '["Hombros encogiéndose hacia las orejas", "Codos no completamente bloqueados", "Cuerpo balanceándose", "Inclinación excesiva hacia adelante"]'
);

-- 22. Negative Dips
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000022',
  'es',
  'Fondos negativos',
  'fondos negativos excentrica bajada paralelas progresion',
  '[
    "Empezá en posición de apoyo con brazos bloqueados.",
    "Bajá lentamente el cuerpo doblando los codos.",
    "Tomá 3-5 segundos para bajar a la posición inferior.",
    "Bajá hasta que los hombros estén debajo de los codos o sientas estiramiento.",
    "Usá los pies para ayudarte a volver arriba.",
    "Repetí el número deseado de reps."
  ]',
  '["Bajar muy rápido", "No bajar lo suficiente", "Hombros encogiéndose durante el descenso", "Codos abriéndose excesivamente"]'
);

-- 23. Weighted Dips
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000023',
  'es',
  'Fondos con peso',
  'fondos peso paralelas lastre cinturon cadenas',
  '[
    "Agregá peso usando cinturón de lastre, chaleco con peso, o mancuerna entre los pies.",
    "Empezá en posición de apoyo con brazos bloqueados.",
    "Bajá el cuerpo hasta que los hombros estén a nivel de codos o más abajo.",
    "Mantené leve inclinación hacia adelante para énfasis en pecho o erguido para tríceps.",
    "Empujá hacia arriba hasta bloqueo completo.",
    "Progresá el peso gradualmente a medida que aumenta la fuerza."
  ]',
  '["Agregar demasiado peso muy pronto", "Acortar la profundidad", "Inclinación excesiva hacia adelante perdiendo control", "No bloquear arriba"]'
);

-- 24. Ring Dips
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000024',
  'es',
  'Fondos en anillas',
  'fondos anillas ring dips rings gimnasia inestable empuje',
  '[
    "Agarrá las anillas y empujá hasta apoyo con brazos bloqueados.",
    "Mantené las anillas cerca del cuerpo para estabilidad.",
    "Bajá el cuerpo con control hasta que los hombros lleguen a profundidad de codos.",
    "Mantené los codos hacia atrás, sin abrirlos excesivamente.",
    "Empujá hasta bloqueo completo, rotando anillas hacia afuera arriba si es posible.",
    "Mantené tensión en el core para minimizar balanceo."
  ]',
  '["Anillas alejándose del cuerpo", "No lograr profundidad adecuada", "Balanceo o inestabilidad excesiva", "No bloquear brazos arriba"]'
);

-- 25. Ring Support Hold (RTO)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000025',
  'es',
  'Apoyo en anillas (RTO)',
  'apoyo anillas RTO rings turned out support hold rotadas afuera isometrico gimnasia',
  '[
    "Empujá hasta posición de apoyo en anillas con brazos bloqueados.",
    "Rotá las anillas hacia afuera para que las palmas miren hacia adelante (RTO).",
    "Deprimí los hombros y activá el core.",
    "Mantené el cuerpo quieto con mínimo balanceo.",
    "Aguantá por el tiempo indicado manteniendo rotación de anillas.",
    "Esto desarrolla la estabilidad necesaria para trabajo avanzado en anillas."
  ]',
  '["Anillas rotando hacia adentro durante el aguante", "Hombros encogiéndose", "Balanceo excesivo del cuerpo", "Codos doblándose para compensar"]'
);

-- 26. Wall Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000026',
  'es',
  'Flexiones en pared',
  'flexiones pared pushups principiante inclinado vertical empuje',
  '[
    "Parate frente a una pared a distancia de un brazo.",
    "Colocá las manos en la pared a altura y ancho de hombros.",
    "Mantené el cuerpo recto de cabeza a talones.",
    "Doblá los codos para llevar el pecho hacia la pared.",
    "Empujá de vuelta a la posición inicial con brazos extendidos.",
    "Progresá a superficies más bajas a medida que te fortalecés."
  ]',
  '["Caderas caídas o espalda arqueada", "Manos muy altas o muy bajas", "No llevar el pecho suficientemente cerca de la pared", "Codos abriéndose a 90 grados"]'
);

-- 27. Knee Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000027',
  'es',
  'Flexiones de rodillas',
  'flexiones rodillas pushups modificado principiante arrodillado',
  '[
    "Empezá en cuatro puntos, luego caminá las manos hacia adelante.",
    "Mantené las rodillas en el piso con pies levantados.",
    "Tu cuerpo debe estar recto desde rodillas hasta cabeza.",
    "Bajá el pecho hacia el piso doblando los codos.",
    "Empujá de vuelta hasta extensión completa de brazos.",
    "Mantené el core activado durante todo el movimiento."
  ]',
  '["Caderas cayendo hacia el piso", "Caderas muy levantadas", "No bajar el pecho suficientemente cerca del piso", "Mirar hacia arriba en vez de mantener cuello neutral"]'
);

-- 28. Diamond Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000028',
  'es',
  'Flexiones diamante',
  'flexiones diamante pushups agarre cerrado triangulo triceps',
  '[
    "Empezá en posición de flexión con manos juntas debajo del pecho.",
    "Formá un diamante con los pulgares e índices tocándose.",
    "Mantené el cuerpo en línea recta de cabeza a talones.",
    "Bajá el pecho hacia las manos, codos hacia atrás.",
    "Empujá de vuelta hasta extensión completa.",
    "Esta variación enfatiza significativamente más los tríceps."
  ]',
  '["Codos abriéndose en vez de ir hacia atrás", "Caderas caídas o levantadas", "Manos posicionadas muy hacia adelante", "No lograr profundidad completa"]'
);

-- 29. Archer Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000029',
  'es',
  'Flexiones arquero',
  'flexiones arquero pushups un brazo progresion asimetrica ancho',
  '[
    "Empezá en posición de flexión con manos más anchas que ancho de hombros.",
    "Bajá hacia una mano mientras extendés el otro brazo hacia el lado.",
    "El brazo de trabajo se dobla mientras el otro se extiende.",
    "Empujá de vuelta a la posición inicial.",
    "Alterná lados con cada rep o completá todas las reps por lado.",
    "Cuanto más recto el brazo extendido, más difícil."
  ]',
  '["Doblar demasiado el brazo extendido", "No bajar lo suficiente", "Caderas rotando durante el movimiento", "Ancho de manos insuficiente"]'
);

-- 30. Pseudo Planche Push-ups (PPPU)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000030',
  'es',
  'Flexiones pseudo planche (PPPU)',
  'flexiones pseudo planche PPPU inclinacion adelante preparacion planche',
  '[
    "Empezá en posición de flexión con manos junto a las caderas, no los hombros.",
    "Girá los dedos hacia los lados o hacia atrás.",
    "Inclinate hacia adelante significativamente para que los hombros estén adelante de las manos.",
    "Hacé flexiones manteniendo la inclinación hacia adelante.",
    "Mantené el cuerpo recto y core apretado todo el tiempo.",
    "Mayor inclinación hacia adelante lo hace más difícil."
  ]',
  '["No inclinarse suficiente hacia adelante", "Manos posicionadas muy hacia adelante", "Perder la inclinación durante la flexión", "Muñecas doliendo por mala posición"]'
);

-- 31. Ring Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000031',
  'es',
  'Flexiones en anillas',
  'flexiones anillas ring push-ups pushups rings inestable gimnasia',
  '[
    "Colocá las anillas bajas al piso, unos 15-30 cm de altura.",
    "Agarrá las anillas y ponete en posición de flexión.",
    "Mantené las anillas cerca del cuerpo para estabilidad.",
    "Bajá el pecho entre las anillas con control.",
    "Empujá hacia arriba minimizando el balanceo de anillas.",
    "Mantené el core extra apretado para manejar la inestabilidad."
  ]',
  '["Anillas balanceándose sin control", "No bajar lo suficiente entre anillas", "Cuerpo cayendo por la inestabilidad", "Anillas muy altas haciéndolo muy difícil"]'
);

-- 32. RTO Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000032',
  'es',
  'Flexiones RTO',
  'flexiones RTO rings turned out push-ups anillas rotadas afuera pushups avanzado gimnasia',
  '[
    "Colocá las anillas bajas y ponete en posición de flexión en anillas.",
    "Rotá las anillas hacia afuera para que las palmas miren adelante (RTO) arriba.",
    "Mantené la rotación de anillas durante todo el movimiento.",
    "Bajá con control, manteniendo anillas rotadas hacia afuera.",
    "Empujá de vuelta a posición RTO arriba.",
    "Esto crea tensión adicional en bíceps y pecho."
  ]',
  '["Anillas rotando hacia adentro durante el movimiento", "Perder rotación abajo", "No lograr profundidad completa", "Balanceo excesivo de anillas"]'
);

-- 33. One Arm Push-up
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000033',
  'es',
  'Flexión a un brazo',
  'flexion un brazo pushup single arm avanzado unilateral',
  '[
    "Empezá en posición de flexión con pies más anchos de lo normal.",
    "Poné una mano detrás de la espalda o al costado.",
    "Bajá el pecho hacia el piso usando un brazo.",
    "Mantené el cuerpo lo más cuadrado posible, minimizando rotación.",
    "Empujá de vuelta hasta extensión completa.",
    "Postura más ancha facilita el equilibrio."
  ]',
  '["Rotación excesiva de cadera durante el movimiento", "Pies muy juntos causando problemas de equilibrio", "No lograr profundidad completa", "Codo abriéndose en vez de mantenerse adentro"]'
);

-- 34. Pike Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000034',
  'es',
  'Flexiones pike',
  'flexiones pike pushups press hombros vertical V invertida',
  '[
    "Empezá en posición de perro boca abajo, formando una V invertida.",
    "Manos al ancho de hombros, caderas altas en el aire.",
    "Doblá los codos para bajar la cabeza hacia el piso.",
    "La cabeza debe moverse hacia adelante entre las manos.",
    "Empujá de vuelta a la posición V inicial.",
    "Mantené las piernas lo más rectas posible."
  ]',
  '["No levantar las caderas lo suficiente", "Cabeza moviéndose recto hacia abajo en vez de adelante", "Doblar las rodillas excesivamente", "Codos abriéndose hacia los lados"]'
);

-- 35. Elevated Pike Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000035',
  'es',
  'Flexiones pike elevadas',
  'flexiones pike elevadas pies elevados caja banco progresion HSPU',
  '[
    "Colocá los pies en una caja, banco, o superficie elevada.",
    "Caminá las manos hacia atrás hacia la caja en posición pike.",
    "Cuanto más altos los pies, más vertical se vuelve el press.",
    "Bajá la cabeza hacia el piso entre las manos.",
    "Empujá de vuelta a la posición inicial.",
    "Progresá a superficies más altas a medida que te fortalecés."
  ]',
  '["Pies no elevados lo suficiente para aumentar dificultad", "Perder posición pike durante las reps", "No bajar la cabeza lo suficiente", "Manos muy lejos de la superficie elevada"]'
);

-- 36. Wall Handstand
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000036',
  'es',
  'Parada de manos en pared',
  'parada manos pared handstand aguante equilibrio inversion soporte pared',
  '[
    "Mirá hacia la pared y colocá las manos a unos 15 cm de ella.",
    "Pateá una pierna a la vez para quedar en parada de manos contra la pared.",
    "Tu pecho o espalda puede mirar hacia la pared dependiendo de la entrada.",
    "Apilá hombros sobre muñecas, activá el core.",
    "Empujá a través de los hombros y estirá las puntas de los pies.",
    "Aguantá por tiempo trabajando en alineación y equilibrio."
  ]',
  '["Manos muy lejos de la pared causando espalda de banana", "No extender completamente a través de los hombros", "Aguantar la respiración en vez de respirar", "Arco excesivo en espalda baja"]'
);

-- 37. Wall Handstand Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000037',
  'es',
  'Flexiones en parada de manos en pared',
  'flexiones parada manos pared HSPU soporte pared press vertical',
  '[
    "Ponete en parada de manos en pared con espalda o pecho mirando la pared.",
    "Bajá la cabeza hacia el piso doblando los codos.",
    "Bajá hasta donde sea cómodo, idealmente hasta que la cabeza toque el piso.",
    "Empujá de vuelta hasta extensión completa de brazos.",
    "Mantené el core apretado y cuerpo lo más recto posible.",
    "Usá un abmat debajo de la cabeza si es necesario para consistencia de profundidad."
  ]',
  '["No lograr profundidad completa", "Arco excesivo en la espalda", "Patear la pared para ayudarse", "Posición de cabeza muy adelante o atrás"]'
);

-- 38. Freestanding Handstand Push-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000038',
  'es',
  'Flexiones en parada de manos libre',
  'flexiones parada manos libre HSPU equilibrio avanzado elite',
  '[
    "Pateá hacia una parada de manos libre.",
    "Encontrá tu punto de equilibrio con hombros apilados sobre muñecas.",
    "Bajá lentamente doblando los codos mientras mantenés equilibrio.",
    "Empujá de vuelta a extensión completa sin perder equilibrio.",
    "Usá presión de dedos para hacer micro-ajustes de equilibrio.",
    "Esta es una habilidad de nivel elite que requiere años de práctica."
  ]',
  '["Intentar antes de dominar el aguante de parada de manos libre", "Perder equilibrio durante el press", "No tener descenso controlado", "Manos muy juntas o muy separadas"]'
);

-- 39. Frog Stand
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000039',
  'es',
  'Posición de rana',
  'posicion rana crow pose equilibrio fundamento planche preparacion muñeca',
  '[
    "Agachate y colocá las manos en el piso al ancho de hombros.",
    "Dedos bien abiertos, hacia adelante o levemente hacia afuera.",
    "Doblá los codos y apoyá las rodillas en la parte alta de los brazos.",
    "Inclinate hacia adelante y transferí el peso a las manos.",
    "Levantá los pies del piso y equilibrate sobre las manos.",
    "Enfocate en la inclinación hacia adelante necesaria para desarrollo de planche."
  ]',
  '["No inclinarse suficiente hacia adelante", "Rodillas resbalándose de los brazos", "Dedos no abiertos para equilibrio", "Saltar a la posición en vez de entrada controlada"]'
);

-- 40. Tuck Planche
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000040',
  'es',
  'Planche agrupada',
  'planche agrupada tuck brazos rectos equilibrio isometrico',
  '[
    "Colocá las manos en el piso o en paralelas, al ancho de hombros.",
    "Inclinate hacia adelante significativamente, transfiriendo peso a las manos.",
    "Levantá los pies y llevá las rodillas al pecho.",
    "A diferencia de posición de rana, las rodillas NO descansan en los brazos.",
    "Mantené los brazos completamente rectos todo el tiempo.",
    "Aguantá con cuerpo paralelo al piso, soportado solo por las manos."
  ]',
  '["Brazos doblándose", "Rodillas descansando en codos como posición de rana", "No inclinarse suficiente hacia adelante", "Caderas muy altas o muy bajas"]'
);

-- 41. Advanced Tuck Planche
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000041',
  'es',
  'Planche agrupada avanzada',
  'planche agrupada avanzada espalda plana cadera abierta progresion',
  '[
    "Empezá en posición de planche agrupada en piso o paralelas.",
    "Abrí el ángulo de cadera para que los muslos estén a 90 grados del torso.",
    "Mantené la espalda plana en vez de redondeada.",
    "Los brazos quedan completamente rectos todo el tiempo.",
    "Aguantá paralelo al piso con ángulo de cadera abierto.",
    "Esto es significativamente más difícil que la planche agrupada básica."
  ]',
  '["Espalda todavía redondeada como agrupada básica", "Ángulo de cadera no abierto a 90 grados", "Brazos doblándose para compensar", "Caderas cayendo debajo de altura de hombros"]'
);

-- 42. Straddle Planche
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000042',
  'es',
  'Planche abierta',
  'planche abierta straddle piernas separadas horizontal avanzado',
  '[
    "Desde planche agrupada, extendé las piernas hacia los lados en straddle.",
    "Mantené las piernas rectas y separadas lo más posible.",
    "Mantené brazos rectos e inclinación hacia adelante todo el tiempo.",
    "El cuerpo debe estar horizontal y paralelo al piso.",
    "Mayor apertura lo hace levemente más fácil.",
    "Estirá las puntas y mantené piernas rectas."
  ]',
  '["Piernas no separadas lo suficiente", "Caderas cayendo debajo de hombros", "Brazos doblándose", "Perder la inclinación hacia adelante"]'
);

-- 43. Full Planche
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000043',
  'es',
  'Planche completa',
  'planche completa horizontal cuerpo recto elite calistenia',
  '[
    "Desde planche abierta, juntá las piernas.",
    "Mantené los brazos completamente rectos todo el tiempo.",
    "Mantené todo el cuerpo horizontal y paralelo al piso.",
    "Piernas juntas, puntas estiradas, cuerpo en una línea recta.",
    "Requiere fuerza extrema de hombros y core.",
    "Esta es una de las habilidades más difíciles de lograr en calistenia."
  ]',
  '["Cualquier doblez en los brazos", "Caderas cayendo", "Quebrarse en las caderas", "Cuerpo no manteniéndose horizontal"]'
);

-- 44. Bodyweight Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000044',
  'es',
  'Sentadilla con peso corporal',
  'sentadilla peso corporal air squat basica fundamental piernas',
  '[
    "Parate con pies al ancho de hombros, puntas levemente hacia afuera.",
    "Mantené el pecho arriba y core activado.",
    "Doblá las rodillas y empujá las caderas hacia atrás y abajo.",
    "Bajá hasta que los muslos estén al menos paralelos al piso.",
    "Mantené el peso en todo el pie, no solo en las puntas.",
    "Pararte empujando a través de los talones."
  ]',
  '["Rodillas colapsando hacia adentro", "Talones levantándose del piso", "No hacer sentadilla suficientemente profunda", "Inclinación excesiva hacia adelante perdiendo equilibrio"]'
);

-- 45. Split Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000045',
  'es',
  'Sentadilla dividida',
  'sentadilla dividida split squat estacionaria una pierna unilateral',
  '[
    "Parate con un pie adelante y uno atrás en postura escalonada.",
    "Mantené el torso erguido y core activado.",
    "Bajá la rodilla trasera hacia el piso.",
    "La rodilla delantera debe seguir sobre los dedos, sin pasarlos.",
    "Empujá a través del pie delantero para volver a parado.",
    "Completá todas las reps de un lado antes de cambiar."
  ]',
  '["Rodilla trasera no bajando lo suficiente", "Rodilla delantera yendo muy hacia adelante", "Torso inclinándose excesivamente hacia adelante", "Pies muy juntos o muy separados"]'
);

-- 46. Assisted Pistol Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000046',
  'es',
  'Pistol squat asistida',
  'pistol squat asistida una pierna TRX poste marco puerta soporte',
  '[
    "Agarrate de un TRX, poste, o marco de puerta para soporte.",
    "Parate en una pierna con la otra extendida hacia adelante.",
    "Bajá a sentadilla de una pierna mientras te sostenés para soporte.",
    "Bajá tan profundo como puedas con control.",
    "Usá el soporte mínimamente, solo para equilibrio.",
    "Empujá hacia arriba usando tu pierna lo más posible."
  ]',
  '["Depender demasiado de la asistencia de brazos", "No bajar lo suficiente", "Pierna levantada tocando el piso", "Mal equilibrio incluso con soporte"]'
);

-- 47. Pistol Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000047',
  'es',
  'Pistol squat',
  'pistol squat sentadilla una pierna single leg squat avanzado equilibrio',
  '[
    "Parate en una pierna con la otra extendida recta hacia adelante.",
    "Extendé los brazos hacia adelante para contrapeso.",
    "Bajá a sentadilla profunda en la pierna de apoyo.",
    "Mantené la pierna extendida fuera del piso todo el tiempo.",
    "Bajá lo más posible, idealmente isquio a pantorrilla.",
    "Empujá hacia arriba sin tocar la otra pierna."
  ]',
  '["Pierna levantada tocando el piso", "No lograr profundidad completa", "Caer hacia atrás abajo", "Rodilla colapsando hacia adentro en pierna de trabajo"]'
);

-- 48. Beginner Shrimp Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000048',
  'es',
  'Shrimp squat principiante',
  'shrimp squat principiante una pierna rodilla toca progresion',
  '[
    "Parate en una pierna y agarrá el otro pie detrás tuyo.",
    "Podés sostener el pie con la mano para equilibrio.",
    "Bajá hasta que la rodilla levantada toque el piso.",
    "Mantené el torso lo más erguido posible.",
    "Empujá a través de la pierna de apoyo para volver a parado.",
    "El pie sostenido provee algo de contrapeso."
  ]',
  '["Inclinarse demasiado hacia adelante", "Dejarte caer en vez de controlar el descenso", "No tocar la rodilla al piso", "Perder equilibrio y dar un paso"]'
);

-- 49. Advanced Shrimp Squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000049',
  'es',
  'Shrimp squat avanzada',
  'shrimp squat avanzada una pierna profunda talon a gluteo',
  '[
    "Parate en una pierna sin sostener el pie trasero.",
    "Doblá la pierna trasera para que el talón vaya hacia el glúteo.",
    "Bajá hasta que la rodilla trasera toque el piso.",
    "Abajo, el talón debe estar tocando el glúteo.",
    "Empujá hacia arriba sin asistencia.",
    "Requiere fuerza significativa de cuádriceps y movilidad de cadera."
  ]',
  '["Sostener el pie trasero (esa es la versión principiante)", "No lograr profundidad completa", "Talón no llegando al glúteo abajo", "Mal equilibrio durante todo el movimiento"]'
);

-- 50. Nordic Curl Negative
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000050',
  'es',
  'Nordic curl negativa',
  'nordic curl negativa excentrica isquiotibiales bajada',
  '[
    "Arrodillate en una colchoneta con los pies anclados detrás.",
    "Un compañero puede sostener tus tobillos o usá un ancla segura.",
    "Mantené las caderas extendidas y cuerpo en línea recta.",
    "Bajá lentamente el cuerpo hacia adelante con control.",
    "Usá solo los isquiotibiales para resistir la caída.",
    "Agarrate con las manos abajo y reseteá."
  ]',
  '["Caderas doblándose/quebrándose durante el descenso", "Bajar muy rápido sin control", "No mantener el cuerpo recto", "Agarrarte muy temprano"]'
);

-- 51. Banded Nordic Curl
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000051',
  'es',
  'Nordic curl con banda',
  'nordic curl banda asistida resistencia isquiotibiales',
  '[
    "Colocá una banda de resistencia anclada adelante tuyo.",
    "Sostené la banda a altura del pecho para asistencia.",
    "Arrodillate con pies anclados detrás.",
    "Bajá hacia adelante con control, usando asistencia de banda según necesites.",
    "Subí usando isquiotibiales más ayuda de banda.",
    "Usá bandas más livianas a medida que te fortalecés."
  ]',
  '["Usar demasiada asistencia de banda", "No controlar la fase de bajada", "Caderas quebrándose durante el movimiento", "Banda anclada incorrectamente"]'
);

-- 52. Nordic Curl
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000052',
  'es',
  'Nordic curl',
  'nordic curl hamstring curl isquiotibiales peso corporal excentrica concentrica',
  '[
    "Arrodillate en una colchoneta con pies anclados seguramente detrás.",
    "Mantené las caderas extendidas y cuerpo recto.",
    "Bajá el cuerpo hacia adelante bajo control usando isquiotibiales.",
    "Bajá lo más posible manteniendo control.",
    "Subí usando solo los isquiotibiales.",
    "Este es uno de los mejores ejercicios de isquiotibiales disponibles."
  ]',
  '["Doblarse en caderas en vez de mantenerse recto", "No pasar por rango completo de movimiento", "Usar manos para asistir en la subida", "Tobillos no anclados seguramente"]'
);

-- 53. Foot Supported L-sit
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000053',
  'es',
  'L-sit con pies apoyados',
  'l-sit pies apoyados talones abajo compresion principiante',
  '[
    "Sentate en el piso con piernas extendidas adelante.",
    "Colocá las manos en el piso o paralelas al lado de las caderas.",
    "Empujá hacia abajo para levantar las caderas del piso.",
    "Mantené los talones en el piso para soporte.",
    "Enfocate en empujar hombros hacia abajo y activar core.",
    "Aguantá esta posición por el tiempo indicado."
  ]',
  '["No levantar las caderas lo suficiente", "Hombros encogiéndose hacia arriba", "Doblar las rodillas", "Manos posicionadas muy adelante o atrás"]'
);

-- 54. One Leg L-sit
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000054',
  'es',
  'L-sit una pierna',
  'l-sit una pierna single leg extendida compresion progresion',
  '[
    "Empezá en posición de L-sit con pies apoyados.",
    "Levantá una pierna del piso manteniéndola recta.",
    "Aguantá con una pierna extendida y un talón todavía abajo.",
    "Mantené las caderas levantadas y core activado.",
    "Cambiá de pierna después de aguantar el tiempo indicado.",
    "Progresá levantando la pierna más alto cada sesión."
  ]',
  '["Pierna levantada no quedando recta", "Caderas cayendo cuando se levanta la pierna", "No alternar piernas equitativamente", "Pierna de soporte doblándose"]'
);

-- 55. Tuck L-sit
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000055',
  'es',
  'L-sit agrupada',
  'l-sit agrupada tuck rodillas compresion aguante',
  '[
    "Colocá las manos en el piso o paralelas al lado de las caderas.",
    "Empujá hacia abajo para levantar todo el cuerpo del piso.",
    "Llevá las rodillas hacia el pecho en posición agrupada.",
    "Ambos pies deben estar completamente fuera del piso.",
    "Mantené hombros deprimidos y core apretado.",
    "Aguantá por el tiempo indicado."
  ]',
  '["Pies tocando el piso", "Rodillas no agrupadas lo suficiente", "Hombros encogiéndose hacia arriba", "Inclinarse demasiado hacia atrás"]'
);

-- 56. L-sit
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000056',
  'es',
  'L-sit',
  'l-sit piernas rectas compresion aguante paralelas parallettes piso floor',
  '[
    "Colocá las manos en el piso o paralelas al lado de las caderas.",
    "Empujá hacia abajo para levantar todo el cuerpo del piso.",
    "Extendé las piernas rectas hacia adelante.",
    "Las piernas deben estar a 90 grados del torso.",
    "Mantené las piernas juntas con puntas estiradas.",
    "Aguantá con hombros deprimidos y core activado."
  ]',
  '["Piernas no quedando a 90 grados", "Rodillas doblándose", "Hombros encogiéndose hacia arriba", "Piernas separándose"]'
);

-- 57. V-sit
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000057',
  'es',
  'V-sit',
  'v-sit piernas altas compresion avanzado progresion l-sit',
  '[
    "Empezá en posición de L-sit.",
    "Levantá las piernas más alto de 90 grados hacia el pecho.",
    "Creá una forma de V entre torso y piernas.",
    "Mantené las piernas rectas y juntas con puntas estiradas.",
    "Esto requiere significativamente más fuerza de compresión.",
    "Aguantá por el tiempo indicado manteniendo la posición V."
  ]',
  '["Piernas no suficientemente altas (es solo un L-sit)", "Rodillas doblándose", "Caer hacia atrás", "Incapaz de mantener posición de piernas elevadas"]'
);

-- 58. Dragon Flag (Tuck)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000058',
  'es',
  'Dragon flag agrupada',
  'dragon flag agrupada tuck core abs banco bruce lee',
  '[
    "Acostate en un banco y agarralo detrás de la cabeza.",
    "Levantá el cuerpo para que solo la espalda alta contacte el banco.",
    "Mantené las rodillas agrupadas hacia el pecho.",
    "Aguantá esta posición con core completamente activado.",
    "Bajá con control.",
    "Solo los omóplatos deben tocar el banco arriba."
  ]',
  '["Demasiada espalda en el banco", "Caderas doblándose en vez de cuerpo quedando recto", "Bajar sin control", "No agarrar el banco seguramente"]'
);

-- 59. Dragon Flag (Full)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000059',
  'es',
  'Dragon flag completa',
  'dragon flag completa extendida core abs banco bruce lee avanzado',
  '[
    "Acostate en un banco y agarralo seguramente detrás de la cabeza.",
    "Levantá todo el cuerpo con piernas completamente extendidas.",
    "Solo la espalda alta/omóplatos contactan el banco.",
    "Mantené el cuerpo completamente recto de hombros a pies.",
    "Bajá con control manteniendo el cuerpo recto.",
    "Este ejercicio fue famosamente realizado por Bruce Lee."
  ]',
  '["Cuerpo doblándose en caderas", "Bajar muy rápido", "Demasiado torso en el banco", "Piernas doblándose durante el movimiento"]'
);

-- 60. German Hang
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000060',
  'es',
  'Colgado alemán',
  'colgado aleman german hang estiramiento hombro dislocado posicion back lever prep',
  '[
    "Colgá de anillas o barra.",
    "Rotá hacia atrás a través de los brazos a posición invertida.",
    "Continuá rotando hasta que los brazos estén detrás del cuerpo.",
    "Deberías quedar colgando con brazos estirados detrás.",
    "Aguantá esta posición de estiramiento por el tiempo indicado.",
    "Esto desarrolla flexibilidad de hombros para back lever."
  ]',
  '["Ir muy profundo muy rápido causando lesión", "No controlar la entrada", "Aguantar la respiración durante el estiramiento", "Hombros no listos para este rango de movimiento"]'
);

-- 61. Skin the Cat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000061',
  'es',
  'Skin the cat',
  'skin the cat rotacion movilidad hombro anillas back lever prep',
  '[
    "Colgá de anillas con brazos extendidos.",
    "Levantá las piernas y rotá hacia atrás a través de los brazos.",
    "Continuá hasta llegar a posición de colgado alemán.",
    "Revertí el movimiento para volver al colgado inicial.",
    "Controlá el movimiento todo el tiempo, sin balanceo.",
    "Esto desarrolla movilidad de hombros y fuerza de tirón."
  ]',
  '["Balancearse en vez de movimiento controlado", "No pasar por rango completo de movimiento", "Apurar la rotación", "Hombros no calentados apropiadamente"]'
);

-- 62. Tuck Back Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000062',
  'es',
  'Back lever agrupado',
  'back lever agrupado tuck back lever invertido aguante anillas rings barra',
  '[
    "Desde colgado alemán o skin the cat, extendé hacia adelante.",
    "Llevá el cuerpo a horizontal con rodillas agrupadas al pecho.",
    "Los brazos deben estar rectos, cuerpo mirando hacia abajo.",
    "Tu espalda mira al techo, pecho mira al piso.",
    "Aguantá esta posición horizontal agrupada.",
    "Enfocate en brazos rectos y hombros deprimidos."
  ]',
  '["Brazos doblándose", "No lograr posición horizontal", "Caderas muy altas o muy bajas", "Rodillas no agrupadas lo suficiente"]'
);

-- 63. Full Back Lever
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '90000000-0001-0000-0000-000000000063',
  'es',
  'Back lever completo',
  'back lever completo full back lever horizontal aguante invertido cuerpo recto anillas rings',
  '[
    "Desde back lever agrupado, extendé las piernas rectas.",
    "Mantené todo el cuerpo horizontal y mirando hacia abajo.",
    "Los brazos quedan completamente rectos todo el tiempo.",
    "El cuerpo debe ser una línea recta paralela al piso.",
    "Estirá las puntas y apretá las piernas juntas.",
    "Aguantá por tiempo manteniendo posición perfecta."
  ]',
  '["Brazos doblándose", "Cuerpo cayendo debajo de horizontal", "Arco excesivo en espalda baja", "Piernas separándose o doblándose"]'
);

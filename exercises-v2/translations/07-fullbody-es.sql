-- =============================================
-- FULL BODY EXERCISES - SPANISH TRANSLATIONS
-- =============================================

-- ==================== DEADLIFT VARIATIONS ====================

-- 1. Peso muerto convencional con barra
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000001',
  'es',
  'Peso muerto convencional con barra',
  'peso muerto convencional barra deadlift',
  '[
    "Parate con pies al ancho de caderas, barra sobre los pies.",
    "Agachate y agarrá la barra con agarre prono o mixto.",
    "Espalda recta, pecho arriba, hombros sobre la barra.",
    "Empujá el piso con los pies levantando la barra.",
    "Extendé caderas y rodillas simultáneamente hasta quedar erguido.",
    "Bajá controladamente manteniendo la barra cerca del cuerpo."
  ]',
  '[
    "Redondear la espalda baja durante el levantamiento",
    "Alejar la barra del cuerpo",
    "Hiperextender la espalda arriba",
    "Levantar primero caderas perdiendo tensión en espalda"
  ]'
);

-- 2. Peso muerto con trap bar
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000002',
  'es',
  'Peso muerto con trap bar',
  'peso muerto trap bar hexagonal deadlift',
  '[
    "Parate dentro de la trap bar con pies al ancho de caderas.",
    "Agachate y agarrá los mangos laterales.",
    "Mantené espalda recta y pecho arriba.",
    "Empujá el piso extendiendo piernas y caderas.",
    "Pararte completamente erguido arriba.",
    "Bajá controladamente flexionando caderas y rodillas."
  ]',
  '[
    "Redondear la espalda durante el movimiento",
    "No mantener el torso centrado en la barra",
    "Bloquear rodillas antes que caderas",
    "Inclinarse demasiado hacia adelante"
  ]'
);

-- ==================== OLYMPIC LIFTS ====================

-- 3. Cargada colgante
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000003',
  'es',
  'Cargada colgante',
  'cargada colgante hang clean olimpico',
  '[
    "Parate sosteniendo la barra con agarre prono a la altura de muslos.",
    "Flexioná ligeramente caderas y rodillas (posición colgante).",
    "Extendé explosivamente caderas, rodillas y tobillos.",
    "Encogé los hombros y tirá la barra hacia arriba.",
    "Girá los codos hacia adelante recibiendo la barra en hombros.",
    "Absorbé el peso flexionando rodillas en la recepción."
  ]',
  '[
    "Tirar con brazos en lugar de extensión de caderas",
    "No completar la triple extensión",
    "Recibir la barra con codos bajos",
    "No flexionar rodillas en la recepción"
  ]'
);

-- 4. Power clean
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000004',
  'es',
  'Power clean',
  'power clean cargada potencia olimpico barra',
  '[
    "Posicioná la barra sobre los pies, agarre prono al ancho de hombros.",
    "Agachate con espalda recta, hombros sobre la barra.",
    "Levantá la barra manteniéndola cerca del cuerpo (primer tirón).",
    "Al pasar las rodillas, extendé explosivamente caderas (segundo tirón).",
    "Encogé hombros y tirá barra hacia arriba.",
    "Girá codos recibiendo la barra en hombros en posición de cuarto squat."
  ]',
  '[
    "Tirar con brazos demasiado temprano",
    "Alejar la barra del cuerpo",
    "No completar extensión de caderas",
    "Recibir con torso inclinado hacia adelante"
  ]'
);

-- 5. Arranque colgante
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000005',
  'es',
  'Arranque colgante',
  'arranque colgante hang snatch olimpico barra',
  '[
    "Agarrá la barra con agarre prono muy ancho (snatch grip).",
    "Parate con barra a altura de muslos, ligera flexión de caderas.",
    "Extendé explosivamente caderas, rodillas y tobillos.",
    "Tirá la barra hacia arriba cerca del cuerpo.",
    "Dejate caer debajo de la barra extendiéndola sobre la cabeza.",
    "Estabilizá con brazos bloqueados arriba."
  ]',
  '[
    "Agarre demasiado angosto",
    "Tirar con brazos en lugar de caderas",
    "No pasar la barra cerca del cuerpo",
    "Presionar la barra en lugar de dejarse caer debajo"
  ]'
);

-- 6. Arranque con mancuerna
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000006',
  'es',
  'Arranque con mancuerna',
  'arranque mancuerna snatch unilateral',
  '[
    "Parate con pies al ancho de hombros, mancuerna entre los pies.",
    "Agachate y agarrá la mancuerna con una mano.",
    "Extendé explosivamente levantando la mancuerna.",
    "Tirá el codo hacia arriba y atrás.",
    "Girá el brazo recibiendo la mancuerna sobre la cabeza.",
    "Estabilizá con brazo completamente extendido arriba."
  ]',
  '[
    "No usar suficiente extensión de cadera",
    "Presionar la mancuerna en lugar de tirarla",
    "No estabilizar el core durante el movimiento",
    "Recibir con brazo flexionado"
  ]'
);

-- ==================== THRUSTERS ====================

-- 7. Thruster con barra
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000007',
  'es',
  'Thruster con barra',
  'thruster barra squat press combinado',
  '[
    "Sostené la barra en posición de front squat (hombros).",
    "Pies al ancho de hombros, codos altos.",
    "Bajá a una sentadilla profunda controlada.",
    "Subí explosivamente desde abajo.",
    "Usá el impulso para presionar la barra sobre la cabeza.",
    "Bajá la barra a hombros mientras flexionás para siguiente rep."
  ]',
  '[
    "Separar el squat del press (deben ser un movimiento fluido)",
    "Dejar caer los codos en la sentadilla",
    "No llegar a profundidad completa",
    "Presionar antes de completar la extensión de piernas"
  ]'
);

-- 8. Thruster con mancuernas
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000008',
  'es',
  'Thruster con mancuernas',
  'thruster mancuernas squat press combinado',
  '[
    "Sostené mancuernas a la altura de hombros, palmas enfrentadas.",
    "Pies al ancho de hombros.",
    "Bajá a una sentadilla profunda manteniendo torso erguido.",
    "Subí explosivamente desde abajo.",
    "Usá el impulso para presionar las mancuernas sobre la cabeza.",
    "Bajá las mancuernas mientras flexionás para siguiente rep."
  ]',
  '[
    "Inclinar el torso hacia adelante en la sentadilla",
    "No sincronizar el press con la subida",
    "Presionar con los brazos sin usar impulso de piernas",
    "No llegar a extensión completa arriba"
  ]'
);

-- ==================== KETTLEBELL ====================

-- 9. Swing con kettlebell
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000009',
  'es',
  'Swing con kettlebell',
  'swing kettlebell pesa rusa hip hinge',
  '[
    "Parate con pies un poco más anchos que hombros.",
    "Agarrá la kettlebell con ambas manos, brazos extendidos.",
    "Hacé un hip hinge llevando la kettlebell entre las piernas.",
    "Extendé caderas explosivamente proyectando la kettlebell.",
    "Dejá que suba hasta altura de hombros o sobre la cabeza.",
    "Controlá el descenso volviendo al hip hinge."
  ]',
  '[
    "Hacer sentadilla en lugar de hip hinge",
    "Levantar con brazos en lugar de caderas",
    "Redondear la espalda en el descenso",
    "No contraer glúteos en la extensión"
  ]'
);

-- 10. Clean and press con kettlebell
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000010',
  'es',
  'Clean and press con kettlebell',
  'clean press kettlebell pesa rusa cargada',
  '[
    "Parate con kettlebell entre los pies.",
    "Hacé un hip hinge y agarrá la kettlebell con una mano.",
    "Extendé caderas llevando la kettlebell hacia el hombro (clean).",
    "Recibí la kettlebell en posición de rack sobre el antebrazo.",
    "Presioná la kettlebell sobre la cabeza extendiendo el brazo.",
    "Bajá a posición de rack y luego al piso para siguiente rep."
  ]',
  '[
    "Golpear la muñeca en el clean por mala técnica",
    "No rotar la kettlebell correctamente en el rack",
    "Presionar sin estabilizar primero en el rack",
    "No usar extensión de cadera en el clean"
  ]'
);

-- ==================== BODYWEIGHT ====================

-- 11. Burpee
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000011',
  'es',
  'Burpee',
  'burpee cuerpo completo cardio calistenia',
  '[
    "Parate con pies al ancho de hombros.",
    "Agachate y poné las manos en el piso.",
    "Saltá llevando los pies hacia atrás a posición de plancha.",
    "Hacé una flexión de brazos (opcional).",
    "Saltá llevando los pies hacia las manos.",
    "Saltá hacia arriba extendiendo brazos sobre la cabeza."
  ]',
  '[
    "No llegar a plancha completa",
    "Dejar caer las caderas en la plancha",
    "No completar el salto vertical",
    "Realizar el movimiento de forma descoordinada"
  ]'
);

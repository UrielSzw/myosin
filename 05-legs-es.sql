-- =============================================
-- LEG EXERCISES - SPANISH TRANSLATIONS
-- =============================================

-- ==================== QUADS ====================

-- 1. Sentadilla con barra
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000001',
  'es',
  'Sentadilla con barra',
  'sentadilla barra back squat cuadriceps piernas',
  '[
    "Colocá la barra sobre los trapecios superiores (posición alta) o deltoides posteriores (posición baja).",
    "Parate con los pies al ancho de hombros o ligeramente más, puntas levemente hacia afuera.",
    "Activá el core, sacá pecho y mantené la mirada al frente.",
    "Bajá flexionando cadera y rodillas, como si te sentaras en una silla.",
    "Bajá hasta que los muslos estén paralelos al suelo o más, luego empujá a través de los talones para subir."
  ]',
  '[
    "Dejar que las rodillas colapsen hacia adentro",
    "Redondear la espalda baja (flexión lumbar)",
    "Levantar los talones del suelo",
    "Inclinar el torso excesivamente hacia adelante"
  ]'
);

-- 2. Sentadilla frontal
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000002',
  'es',
  'Sentadilla frontal',
  'sentadilla frontal front squat cuadriceps piernas',
  '[
    "Colocá la barra sobre los deltoides frontales, cruzando los brazos o con agarre limpio.",
    "Mantené los codos bien arriba para que la barra no ruede hacia adelante.",
    "Parate con los pies al ancho de hombros.",
    "Bajá manteniendo el torso lo más vertical posible.",
    "Empujá a través de los talones para subir."
  ]',
  '[
    "Dejar caer los codos, haciendo que la barra ruede",
    "Inclinarse hacia adelante perdiendo la barra",
    "No tener suficiente movilidad de muñeca o tobillo",
    "Colapsar las rodillas hacia adentro"
  ]'
);

-- 3. Sentadilla en Smith
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000003',
  'es',
  'Sentadilla en máquina Smith',
  'sentadilla smith maquina cuadriceps piernas',
  '[
    "Ubicá la barra sobre los trapecios y desenganchala girando.",
    "Los pies pueden estar ligeramente adelantados de la barra.",
    "Bajá de forma controlada hasta paralelo o más.",
    "Empujá hacia arriba sin bloquear completamente las rodillas.",
    "Al terminar, gira la barra para engancharla en los seguros."
  ]',
  '[
    "Colocar los pies demasiado adelante estresando la espalda baja",
    "Bloquear agresivamente las rodillas arriba",
    "No bajar suficiente profundidad",
    "Depender solo del Smith sin hacer sentadilla libre"
  ]'
);

-- 4. Sentadilla Hack
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000004',
  'es',
  'Sentadilla Hack',
  'sentadilla hack hack squat maquina cuadriceps piernas',
  '[
    "Ubicá la espalda contra el respaldo y los hombros bajo las almohadillas.",
    "Colocá los pies en la plataforma al ancho de hombros.",
    "Liberá los seguros y bajá flexionando las rodillas.",
    "Bajá hasta que los muslos estén paralelos o más.",
    "Empujá para subir sin bloquear completamente las rodillas."
  ]',
  '[
    "Colocar los pies demasiado arriba o abajo en la plataforma",
    "Despegar la espalda baja del respaldo",
    "Bloquear las rodillas agresivamente",
    "Usar demasiado peso con rango limitado"
  ]'
);

-- 5. Prensa de piernas
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000005',
  'es',
  'Prensa de piernas',
  'prensa piernas leg press maquina cuadriceps piernas',
  '[
    "Sentate en la máquina con la espalda y glúteos bien apoyados.",
    "Colocá los pies en la plataforma al ancho de hombros.",
    "Liberá los seguros y bajá la plataforma flexionando las rodillas.",
    "Bajá hasta que las rodillas formen 90 grados sin que los glúteos se levanten.",
    "Empujá para subir sin bloquear completamente las rodillas."
  ]',
  '[
    "Levantar los glúteos del asiento al bajar demasiado",
    "Bloquear las rodillas agresivamente arriba",
    "Colocar los pies demasiado juntos o separados",
    "Usar demasiado peso con rango muy corto"
  ]'
);

-- 6. Extensión de cuádriceps
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000006',
  'es',
  'Extensión de cuádriceps',
  'extension cuadriceps leg extension maquina piernas',
  '[
    "Ajustá el respaldo para que las rodillas queden alineadas con el eje de rotación.",
    "Colocá los tobillos detrás del rodillo acolchado.",
    "Agarrá las manijas laterales para estabilizarte.",
    "Extendé las rodillas levantando el peso hasta la extensión completa.",
    "Bajá de forma controlada sin soltar la tensión."
  ]',
  '[
    "Usar impulso balanceando el torso",
    "No extender completamente las rodillas",
    "Bajar el peso demasiado rápido",
    "Tener las rodillas mal alineadas con la máquina"
  ]'
);

-- 7. Zancadas con mancuernas
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000007',
  'es',
  'Zancadas con mancuernas',
  'zancadas mancuernas lunges dumbbell cuadriceps gluteos piernas',
  '[
    "Parate con una mancuerna en cada mano a los costados.",
    "Dá un paso largo hacia adelante con una pierna.",
    "Bajá hasta que ambas rodillas formen aproximadamente 90 grados.",
    "La rodilla trasera casi toca el suelo.",
    "Empujá con la pierna delantera para volver al inicio y repetí con la otra."
  ]',
  '[
    "Dar un paso muy corto estresando la rodilla",
    "Dejar que la rodilla delantera pase la punta del pie",
    "Inclinar el torso hacia adelante",
    "Perder el equilibrio por paso muy largo"
  ]'
);

-- 8. Zancadas con barra
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000008',
  'es',
  'Zancadas con barra',
  'zancadas barra lunges barbell cuadriceps gluteos piernas',
  '[
    "Colocá la barra sobre los trapecios como en una sentadilla.",
    "Dá un paso largo hacia adelante manteniendo el equilibrio.",
    "Bajá hasta que ambas rodillas formen 90 grados.",
    "Mantené el torso erguido y el core activado.",
    "Empujá con la pierna delantera para volver y repetí alternando."
  ]',
  '[
    "Perder el equilibrio con la barra",
    "Inclinarse hacia adelante excesivamente",
    "Dar pasos muy cortos",
    "No bajar suficiente profundidad"
  ]'
);

-- 9. Sentadilla búlgara
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000009',
  'es',
  'Sentadilla búlgara',
  'sentadilla bulgara bulgarian split squat cuadriceps gluteos piernas',
  '[
    "Colocá el empeine del pie trasero sobre un banco detrás de vos.",
    "El pie delantero está aproximadamente a un paso del banco.",
    "Sostené mancuernas a los costados o una barra en la espalda.",
    "Bajá flexionando la rodilla delantera hasta 90 grados.",
    "Empujá a través del talón delantero para subir."
  ]',
  '[
    "Colocar el pie delantero demasiado cerca del banco",
    "Dejar que la rodilla colapse hacia adentro",
    "Inclinar el torso excesivamente hacia adelante",
    "No bajar suficiente profundidad"
  ]'
);

-- ==================== HAMSTRINGS ====================

-- 10. Peso muerto rumano
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000010',
  'es',
  'Peso muerto rumano',
  'peso muerto rumano romanian deadlift rdl isquiotibiales piernas',
  '[
    "Parate con los pies al ancho de cadera, agarrando la barra frente a los muslos.",
    "Mantené las rodillas ligeramente flexionadas durante todo el movimiento.",
    "Empujá la cadera hacia atrás bajando la barra por las piernas.",
    "Bajá hasta sentir un estiramiento en los isquiotibiales, manteniendo la espalda recta.",
    "Contraé los glúteos y empujá la cadera hacia adelante para subir."
  ]',
  '[
    "Redondear la espalda durante la bajada",
    "Flexionar demasiado las rodillas (no es sentadilla)",
    "Bajar la barra alejándola de las piernas",
    "No sentir el estiramiento en los isquiotibiales"
  ]'
);

-- 11. Peso muerto rumano con mancuernas
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000011',
  'es',
  'Peso muerto rumano con mancuernas',
  'peso muerto rumano mancuernas dumbbell rdl isquiotibiales piernas',
  '[
    "Parate con los pies al ancho de cadera, mancuernas frente a los muslos.",
    "Mantené las rodillas ligeramente flexionadas.",
    "Empujá la cadera hacia atrás bajando las mancuernas por las piernas.",
    "Mantené la espalda recta y el core activado.",
    "Subí contrayendo glúteos y empujando la cadera adelante."
  ]',
  '[
    "Redondear la espalda baja",
    "Alejar las mancuernas del cuerpo",
    "No mantener las rodillas ligeramente flexionadas",
    "Subir usando la espalda baja en lugar de glúteos"
  ]'
);

-- 12. Peso muerto rumano a una pierna
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000012',
  'es',
  'Peso muerto rumano a una pierna',
  'peso muerto rumano una pierna single leg rdl isquiotibiales piernas unilateral',
  '[
    "Parate sobre una pierna sosteniendo una mancuerna en la mano opuesta.",
    "Mantené una ligera flexión en la rodilla de apoyo.",
    "Incliná el torso hacia adelante mientras la pierna libre va hacia atrás.",
    "Formá una línea recta desde la cabeza hasta el pie trasero.",
    "Volvé a la posición inicial contrayendo glúteos e isquiotibiales."
  ]',
  '[
    "Perder el equilibrio por falta de estabilidad",
    "Rotar la cadera en lugar de mantenerla cuadrada",
    "Redondear la espalda",
    "No bajar suficiente para estirar los isquiotibiales"
  ]'
);

-- 13. Curl femoral acostado
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000013',
  'es',
  'Curl femoral acostado',
  'curl femoral acostado lying leg curl isquiotibiales maquina piernas',
  '[
    "Acostate boca abajo en la máquina con los tobillos bajo el rodillo.",
    "Ajustá la máquina para que las rodillas queden justo al borde del banco.",
    "Agarrá las manijas para estabilizarte.",
    "Flexioná las rodillas llevando los talones hacia los glúteos.",
    "Bajá de forma controlada sin soltar la tensión."
  ]',
  '[
    "Levantar la cadera del banco para ayudar",
    "Usar impulso para subir el peso",
    "No controlar la fase de bajada",
    "Tener las rodillas mal posicionadas en el banco"
  ]'
);

-- 14. Curl femoral sentado
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000014',
  'es',
  'Curl femoral sentado',
  'curl femoral sentado seated leg curl isquiotibiales maquina piernas',
  '[
    "Sentate con la espalda contra el respaldo y las piernas extendidas.",
    "Colocá los tobillos sobre el rodillo superior y los muslos bajo el inferior.",
    "Flexioná las rodillas tirando los talones hacia abajo y atrás.",
    "Apretá los isquiotibiales en la contracción máxima.",
    "Extendé las piernas de forma controlada."
  ]',
  '[
    "Inclinarse hacia adelante para ayudar al movimiento",
    "No usar rango completo de movimiento",
    "Soltar el peso rápidamente en la extensión",
    "Usar demasiado peso con técnica pobre"
  ]'
);

-- 15. Buenos días
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000015',
  'es',
  'Buenos días',
  'buenos dias good mornings isquiotibiales gluteos espalda baja piernas',
  '[
    "Colocá la barra sobre los trapecios como en una sentadilla.",
    "Parate con los pies al ancho de hombros, rodillas ligeramente flexionadas.",
    "Mantené la espalda recta e incliná el torso hacia adelante desde la cadera.",
    "Bajá hasta sentir un estiramiento en los isquiotibiales.",
    "Volvé arriba contrayendo glúteos e isquiotibiales."
  ]',
  '[
    "Redondear la espalda baja",
    "Usar demasiado peso antes de dominar la técnica",
    "Bloquear las rodillas completamente",
    "Bajar demasiado perdiendo la posición neutral de la columna"
  ]'
);

-- ==================== GLUTES ====================

-- 16. Hip Thrust con barra
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000016',
  'es',
  'Hip Thrust con barra',
  'hip thrust barra gluteos piernas cadera',
  '[
    "Sentate en el suelo con la espalda alta contra un banco.",
    "Colocá la barra sobre la cadera con un pad para proteger el hueso.",
    "Los pies están apoyados en el suelo, rodillas flexionadas.",
    "Empujá la cadera hacia arriba hasta que el torso quede paralelo al suelo.",
    "Apretá los glúteos arriba y bajá de forma controlada."
  ]',
  '[
    "Hiperextender la espalda baja arriba",
    "No subir lo suficiente hasta la extensión completa de cadera",
    "Empujar con los pies en lugar de activar glúteos",
    "Colocar los pies demasiado cerca o lejos"
  ]'
);

-- 17. Hip Thrust en máquina
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000017',
  'es',
  'Hip Thrust en máquina',
  'hip thrust maquina gluteos piernas',
  '[
    "Ajustá la máquina y sentate con la espalda contra el respaldo.",
    "Colocá los pies en la plataforma al ancho de cadera.",
    "Empujá la cadera hacia arriba extendiendo completamente.",
    "Apretá los glúteos en la contracción máxima.",
    "Bajá de forma controlada sin soltar tensión."
  ]',
  '[
    "No extender completamente la cadera arriba",
    "Usar demasiado peso con rango limitado",
    "No apretar los glúteos en la contracción",
    "Colocar los pies mal en la plataforma"
  ]'
);

-- 18. Puente de glúteos
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000018',
  'es',
  'Puente de glúteos',
  'puente gluteos glute bridge suelo piernas',
  '[
    "Acostate boca arriba con las rodillas flexionadas y los pies apoyados.",
    "Los brazos descansan a los costados.",
    "Empujá la cadera hacia arriba apretando los glúteos.",
    "Formá una línea recta desde los hombros hasta las rodillas arriba.",
    "Bajá de forma controlada y repetí."
  ]',
  '[
    "Hiperextender la espalda baja arriba",
    "No apretar los glúteos en la contracción",
    "Empujar principalmente con los isquiotibiales",
    "Colocar los pies demasiado lejos del cuerpo"
  ]'
);

-- 19. Patada de glúteo en polea
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000019',
  'es',
  'Patada de glúteo en polea',
  'patada gluteo polea cable kickback gluteos piernas',
  '[
    "Colocá una tobillera conectada a una polea baja.",
    "Pararse frente a la máquina, agarrándote para equilibrio.",
    "Mantené la pierna de trabajo ligeramente flexionada.",
    "Extendé la cadera llevando la pierna hacia atrás.",
    "Apretá el glúteo arriba y volvé de forma controlada."
  ]',
  '[
    "Arquear la espalda baja para subir más la pierna",
    "Usar impulso en lugar de contracción muscular",
    "No controlar la fase de bajada",
    "Rotar la cadera en lugar de mantenerla cuadrada"
  ]'
);

-- 20. Patada de glúteo en máquina
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000020',
  'es',
  'Patada de glúteo en máquina',
  'patada gluteo maquina glute kickback machine gluteos piernas',
  '[
    "Ajustá la máquina y colocá el pie en la plataforma.",
    "Apoyá los antebrazos en los soportes.",
    "Empujá la plataforma hacia atrás extendiendo la cadera.",
    "Apretá el glúteo en la extensión máxima.",
    "Volvé de forma controlada sin soltar la tensión."
  ]',
  '[
    "Arquear la espalda baja excesivamente",
    "No extender completamente la cadera",
    "Usar demasiado peso perdiendo control",
    "Hacer el movimiento muy rápido"
  ]'
);

-- 21. Abducción de cadera
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000021',
  'es',
  'Abducción de cadera en máquina',
  'abduccion cadera maquina hip abduction gluteos piernas',
  '[
    "Sentate con la espalda contra el respaldo y las piernas juntas.",
    "Los muslos externos van contra las almohadillas.",
    "Abrí las piernas hacia afuera contra la resistencia.",
    "Apretá los glúteos en la máxima apertura.",
    "Volvé de forma controlada sin que las pesas choquen."
  ]',
  '[
    "Inclinarse hacia adelante para ayudar",
    "No usar rango completo de movimiento",
    "Dejar que las piernas vuelvan sin control",
    "Usar demasiado peso con técnica pobre"
  ]'
);

-- ==================== CALVES ====================

-- 22. Elevación de talones de pie
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000022',
  'es',
  'Elevación de talones de pie',
  'elevacion talones pie standing calf raise pantorrillas piernas',
  '[
    "Pararse en la máquina con los hombros bajo las almohadillas.",
    "Colocá las puntas de los pies en el borde de la plataforma.",
    "Los talones cuelgan por debajo del nivel de la plataforma.",
    "Elevá los talones subiendo sobre las puntas de los pies.",
    "Bajá de forma controlada estirando los gemelos."
  ]',
  '[
    "No bajar los talones lo suficiente para estirar",
    "Flexionar las rodillas para ayudar al movimiento",
    "Hacer el movimiento muy rápido sin control",
    "Usar demasiado peso con rango limitado"
  ]'
);

-- 23. Elevación de talones sentado
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000023',
  'es',
  'Elevación de talones sentado',
  'elevacion talones sentado seated calf raise pantorrillas piernas soleo',
  '[
    "Sentate en la máquina con las rodillas bajo las almohadillas.",
    "Colocá las puntas de los pies en el borde de la plataforma.",
    "Liberá el seguro y bajá los talones para estirar.",
    "Elevá los talones contrayendo los gemelos.",
    "Mantené la contracción arriba y bajá controladamente."
  ]',
  '[
    "No usar rango completo de movimiento",
    "Rebotar abajo en lugar de estirar controladamente",
    "Usar demasiado peso sacrificando técnica",
    "Hacer el movimiento muy rápido"
  ]'
);

-- 24. Elevación de talones en prensa
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000024',
  'es',
  'Elevación de talones en prensa',
  'elevacion talones prensa leg press calf raise pantorrillas piernas',
  '[
    "Sentate en la prensa con solo las puntas de los pies en la plataforma.",
    "Extendé las piernas casi completamente (sin bloquear rodillas).",
    "Empujá la plataforma con las puntas de los pies.",
    "Bajá los talones estirando los gemelos.",
    "Subí sobre las puntas contrayendo los gemelos."
  ]',
  '[
    "Flexionar las rodillas durante el movimiento",
    "No estirar completamente los gemelos abajo",
    "Usar demasiado peso con rango muy corto",
    "Bloquear las rodillas durante el ejercicio"
  ]'
);

-- 25. Elevación de talones con mancuerna
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000025',
  'es',
  'Elevación de talones con mancuerna',
  'elevacion talones mancuerna single leg calf raise pantorrillas piernas',
  '[
    "Pararse sobre una pierna en un escalón, sosteniendo una mancuerna.",
    "Usá la otra mano para equilibrarte contra una pared.",
    "Bajá el talón por debajo del nivel del escalón.",
    "Elevá el talón subiendo sobre la punta del pie.",
    "Completá las repeticiones y cambiá de pierna."
  ]',
  '[
    "No usar rango completo de movimiento",
    "Usar impulso en lugar de contracción muscular",
    "Flexionar la rodilla para ayudar",
    "Perder el equilibrio por falta de apoyo"
  ]'
);

-- 26. Elevación de talones en Smith
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000026',
  'es',
  'Elevación de talones en Smith',
  'elevacion talones smith machine calf raise pantorrillas piernas',
  '[
    "Colocá un step o discos bajo la barra Smith.",
    "Pararse con los hombros bajo la barra y las puntas en el step.",
    "Desenganchá la barra y bajá los talones.",
    "Elevá los talones subiendo sobre las puntas.",
    "Bajá de forma controlada estirando los gemelos."
  ]',
  '[
    "No usar suficiente rango de movimiento",
    "Flexionar las rodillas para ayudar",
    "Perder el equilibrio por mala posición",
    "Hacer el movimiento muy rápido"
  ]'
);

-- 27. Elevación de talones en burro
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000027',
  'es',
  'Elevación de talones en burro',
  'elevacion talones burro donkey calf raise pantorrillas piernas',
  '[
    "Inclinate hacia adelante y colocá los antebrazos en el soporte.",
    "Colocá la cadera bajo la almohadilla de la máquina.",
    "Las puntas de los pies en el borde de la plataforma.",
    "Bajá los talones estirando los gemelos.",
    "Elevá los talones contrayendo los gemelos al máximo."
  ]',
  '[
    "Redondear la espalda durante el movimiento",
    "No usar rango completo de movimiento",
    "Usar las piernas para generar impulso",
    "Hacer el movimiento muy rápido"
  ]'
);

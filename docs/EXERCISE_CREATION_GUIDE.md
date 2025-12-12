# Guía de Creación de Ejercicios - Estándar 10/10

Este documento define las reglas y estándares para crear ejercicios de máxima calidad en la base de datos de Supabase.

---

## Estructura de Datos

Cada ejercicio se compone de **2 partes**:

### 1. Tabla `exercises` (datos técnicos, sin idioma)

```sql
INSERT INTO exercises (
  id,                           -- UUID único (generado por la app)
  source,                       -- 'system' | 'user'
  created_by_user_id,           -- NULL para system
  main_muscle_group,            -- 1 músculo principal (NOT NULL)
  primary_equipment,            -- 1 equipo principal (NOT NULL)
  exercise_type,                -- 'compound' | 'isolation' (NOT NULL)
  secondary_muscle_groups,      -- JSONB array de músculos (NOT NULL)
  equipment,                    -- JSONB array de equipo (NOT NULL)
  similar_exercises,            -- JSONB array de UUIDs (NULL)
  default_measurement_template, -- template de medición (default 'weight_reps')
  primary_media_url,            -- URL de imagen/video principal (NULL)
  primary_media_type,           -- 'image' | 'video' | 'gif' (NULL)
  difficulty,                   -- 1-5 técnica (NULL, constraint 1-5)
  unilateral,                   -- true/false (default false)
  movement_pattern,             -- patrón de movimiento (NULL, constraint válido)
  adds_bodyweight               -- true/false (default false)
)
```

### 2. Tabla `exercise_translations` (nombre + instrucciones + errores por idioma)

```sql
INSERT INTO exercise_translations (
  exercise_id,      -- UUID del ejercicio (FK)
  language_code,    -- 'es' | 'en' (constraint)
  name,             -- Nombre completo (NOT NULL)
  name_search,      -- Términos de búsqueda (NOT NULL)
  instructions,     -- JSONB array de pasos (default '[]')
  common_mistakes   -- JSONB array de errores comunes (default '[]')
)
```

> **Nota**: `common_mistakes` está en `exercise_translations` porque los errores se describen en el idioma del usuario.

---

## Valores Válidos

### Músculos (`main_muscle_group`, `secondary_muscle_groups`) - 18 valores

| Valor             | Descripción                         |
| ----------------- | ----------------------------------- |
| `chest`           | Pecho                               |
| `upper_back`      | Espalda alta (trapecios, romboides) |
| `lats`            | Dorsales                            |
| `shoulders_front` | Deltoides anterior                  |
| `shoulders_side`  | Deltoides medio                     |
| `shoulders_rear`  | Deltoides posterior                 |
| `biceps`          | Bíceps                              |
| `triceps`         | Tríceps                             |
| `forearms`        | Antebrazos                          |
| `abs`             | Abdominales                         |
| `obliques`        | Oblicuos                            |
| `lower_back`      | Zona lumbar                         |
| `glutes`          | Glúteos                             |
| `quads`           | Cuádriceps                          |
| `hamstrings`      | Isquiotibiales                      |
| `calves`          | Gemelos                             |
| `hip_flexors`     | Flexores de cadera                  |
| `full_body`       | Cuerpo completo                     |

### Equipamiento (`primary_equipment`, `equipment`) - 18 valores

| Valor                | Descripción        |
| -------------------- | ------------------ |
| `bodyweight`         | Peso corporal      |
| `barbell`            | Barra olímpica     |
| `dumbbell`           | Mancuerna          |
| `kettlebell`         | Kettlebell         |
| `ez_bar`             | Barra EZ           |
| `plate`              | Disco              |
| `cable`              | Cable/Polea        |
| `machine`            | Máquina (genérico) |
| `smith_machine`      | Máquina Smith      |
| `bench`              | Banco              |
| `pull_up_bar`        | Barra de dominadas |
| `dip_bars`           | Barras de fondos   |
| `resistance_band`    | Banda elástica     |
| `trap_bar`           | Barra trampa       |
| `landmine`           | Landmine           |
| `suspension_trainer` | TRX                |
| `medicine_ball`      | Balón medicinal    |
| `cardio_machine`     | Máquina cardio     |

### Patrón de Movimiento (`movement_pattern`) - 8 valores

| Valor       | Descripción       | Ejemplos                              |
| ----------- | ----------------- | ------------------------------------- |
| `push`      | Empuje            | Press banca, flexiones, press militar |
| `pull`      | Tirón             | Dominadas, remos, curl bíceps         |
| `squat`     | Sentadilla        | Sentadilla, prensa, goblet squat      |
| `hinge`     | Bisagra de cadera | Peso muerto, hip thrust, good morning |
| `lunge`     | Zancada           | Lunges, step-ups, bulgarian split     |
| `carry`     | Acarreo           | Farmer walk, suitcase carry           |
| `rotation`  | Rotación          | Russian twist, woodchop               |
| `isometric` | Isométrico        | Plancha, L-sit, wall sit              |

### Dificultad (`difficulty`) - Escala 1-5

| Nivel | Descripción        | Ejemplos                                     |
| ----- | ------------------ | -------------------------------------------- |
| 1     | Principiante total | Flexiones de rodillas, plancha, curl máquina |
| 2     | Principiante       | Press banca, sentadilla goblet, remo máquina |
| 3     | Intermedio         | Peso muerto, dominadas, press militar        |
| 4     | Avanzado           | Clean & press, muscle-up, pistol squat       |
| 5     | Experto            | Snatch, planche, front lever                 |

### Template de Medición (`default_measurement_template`) - 7 valores

Define qué campos de medición se muestran al usuario para loguear el ejercicio.

| Valor               | Campos                          | Cuándo usar                                  | Ejemplos                                            |
| ------------------- | ------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| `weight_reps`       | Peso + Repeticiones             | **DEFAULT.** Mayoría de ejercicios de fuerza | Press banca, sentadilla, curl, dominadas, flexiones |
| `weight_reps_range` | Peso + Rango de reps (ej: 8-12) | Programas con rango objetivo de repeticiones | Cualquier ejercicio programado con rangos           |
| `time_only`         | Solo Tiempo                     | Isométricos sin peso añadido                 | Plancha, hollow hold, wall sit, dead hang           |
| `weight_time`       | Peso + Tiempo                   | Isométricos con peso o holds cargados        | Farmer hold, weighted plank, L-sit con lastre       |
| `distance_only`     | Solo Distancia                  | Ejercicios medidos solo por distancia        | Caminata, natación libre                            |
| `distance_time`     | Distancia + Tiempo              | Cardio y ejercicios de resistencia           | Correr, remar, ciclismo, nadar                      |
| `weight_distance`   | Peso + Distancia                | Ejercicios de acarreo con peso               | Farmer walk, sled push, sled pull, yoke carry       |

> **Nota**: Para ejercicios de peso corporal (flexiones, dominadas sin lastre), usar `weight_reps` con peso 0.

---

## Reglas para el NOMBRE

### ✅ Regla Principal

**Incluir equipamiento cuando diferencia el ejercicio**

```
✅ "Press de banca con barra"
✅ "Press de banca con mancuernas"
✅ "Curl de bíceps con barra EZ"
✅ "Sentadilla con barra"
```

### ❌ NO incluir cuando es obvio

```
✅ "Dominadas" (no "Dominadas en barra de dominadas")
✅ "Fondos en paralelas" (ya dice dónde)
✅ "Flexiones" (siempre es peso corporal)
✅ "Plancha" (siempre es peso corporal)
```

### Formato del nombre

```
[Ejercicio] + [variación importante] + [con/en] + [equipamiento]

Ejemplos:
- "Press inclinado con mancuernas"
- "Remo con barra agarre prono"
- "Curl de bíceps en polea baja"
- "Elevaciones laterales con mancuernas"
```

### Idioma

- **Español**: Nombre natural, sin anglicismos innecesarios
- **Excepciones aceptadas**: "Curl", "Press", "Crunch" (son términos universales)
- **Evitar**: "Bench press" → usar "Press de banca"

---

## Reglas para `name_search`

El campo `name_search` permite que el usuario encuentre el ejercicio buscando términos alternativos.

### ✅ Incluir en `name_search`:

1. **El nombre completo** (sin mayúsculas ni acentos)
2. **Sinónimos en español**
3. **Nombre en inglés**
4. **Músculo principal**
5. **Variantes de escritura**

### Ejemplo

```sql
-- Ejercicio: Press de banca con barra
name_search = 'press de banca con barra bench press pecho plano barbell'

-- Ejercicio: Dominadas
name_search = 'dominadas pull ups chin ups espalda dorsales'

-- Ejercicio: Peso muerto rumano
name_search = 'peso muerto rumano romanian deadlift rdl isquiotibiales'
```

---

## Reglas para INSTRUCCIONES

Las instrucciones deben permitir que alguien ejecute el ejercicio **perfectamente** solo leyéndolas.

### Estructura (5-7 pasos)

1. **Posición inicial** - Setup completo
2. **Agarre/Postura** - Cómo tomar el peso, posición de pies
3. **Fase excéntrica** - Movimiento de bajada/apertura
4. **Fase concéntrica** - Movimiento de subida/cierre
5. **Puntos clave** - Qué NO hacer, errores comunes
6. **Respiración** (opcional) - Cuándo inhalar/exhalar
7. **Repetir** (opcional) - Notas sobre el ritmo

### ✅ Buenas instrucciones

```json
[
  "Acostate en el banco plano con los pies firmes en el suelo y la espalda con arco natural.",
  "Tomá la barra con agarre prono, manos separadas un poco más que el ancho de hombros.",
  "Descolgá la barra y posicionala sobre el pecho con los brazos extendidos.",
  "Bajá la barra de forma controlada hasta tocar suavemente el pecho a la altura de los pezones.",
  "Empujá la barra hacia arriba extendiendo los brazos sin bloquear los codos.",
  "Mantené los omóplatos retraídos y el core activado durante todo el movimiento."
]
```

### ❌ Malas instrucciones

```json
[
  "Hacé press de banca.", // Demasiado vago
  "Bajá y subí la barra.", // Sin detalles
  "Repetí 10 veces." // No va en instrucciones
]
```

### Terminología técnica a usar

| Término              | Significado                            |
| -------------------- | -------------------------------------- |
| Agarre prono         | Palmas hacia abajo                     |
| Agarre supino        | Palmas hacia arriba                    |
| Agarre neutro        | Palmas enfrentadas                     |
| Retracción escapular | Juntar los omóplatos                   |
| Core activado        | Abdomen contraído                      |
| Fase excéntrica      | Parte negativa (bajar peso)            |
| Fase concéntrica     | Parte positiva (subir peso)            |
| Bloquear             | Extender completamente la articulación |

### Idioma

- **Español rioplatense**: "Acostate", "Tomá", "Mantené" (no "Acuéstate", "Toma", "Mantén")
- **Claro y directo**: Sin tecnicismos innecesarios
- **Segunda persona singular**: "Bajá la barra" (no "Se baja la barra")

---

## Reglas para `common_mistakes`

Array de 2-4 errores comunes que cometen los principiantes. **Este campo va en `exercise_translations`** porque los errores se describen en el idioma del usuario.

### Ejemplos (español)

```json
// Press de banca
["Rebotar la barra en el pecho", "Arquear excesivamente la espalda", "Levantar los glúteos del banco"]

// Sentadilla
["Rodillas hacia adentro", "Talones que se despegan", "Redondear la espalda baja"]

// Dominadas
["Usar impulso con las piernas", "No bajar completamente", "Encoger los hombros"]
```

### Ejemplos (inglés)

```json
// Bench Press
["Bouncing bar off chest", "Excessive back arch", "Lifting glutes off bench"]

// Squat
["Knees caving in", "Heels coming off floor", "Rounding lower back"]

// Pull-ups
["Using leg momentum", "Not going all the way down", "Shrugging shoulders"]
```

---

## Reglas para `adds_bodyweight`

Este campo indica si el peso corporal se SUMA al peso que loggea el usuario.

### `adds_bodyweight: true`

- **Dominadas con lastre**: Si el usuario pone 20kg, el peso real es 20kg + peso corporal
- **Fondos con lastre**: Igual
- **Hip thrust**: El peso corporal cuenta

### `adds_bodyweight: false`

- **Press de banca**: El peso es solo el de la barra
- **Curl de bíceps**: El peso es solo el de las mancuernas
- **Sentadilla**: El peso es solo el de la barra

---

## Reglas para `unilateral`

### `unilateral: true`

- Trabaja UN lado a la vez
- El usuario loggea el peso POR LADO
- Ejemplos: Curl concentrado, press con mancuerna un brazo, pistol squat

### `unilateral: false`

- Trabaja AMBOS lados simultáneamente
- Ejemplos: Press banca, sentadilla, dominadas

### ⚠️ Ejercicios con mancuernas

- **Press con mancuernas** (ambas a la vez) → `unilateral: false`
- **Press con mancuerna a un brazo** → `unilateral: true` (ejercicio SEPARADO)

---

## Cuándo SEPARAR vs UNIFICAR ejercicios

### ✅ SEPARAR (ejercicios distintos)

| Razón                            | Ejemplo                              |
| -------------------------------- | ------------------------------------ |
| Cambia músculo principal         | Press plano vs Press inclinado       |
| Cambia agarre significativamente | Dominadas prono vs supino (chin-ups) |
| Cambia patrón de movimiento      | Curl bíceps vs Curl martillo         |
| Técnica muy diferente            | Sentadilla vs Sentadilla frontal     |

### ❌ NO SEPARAR (usar campos)

| Razón                         | Solución                |
| ----------------------------- | ----------------------- |
| Unilateral vs bilateral       | Campo `unilateral`      |
| Diferentes pesos              | El usuario lo loggea    |
| Máquinas de diferentes marcas | Usar "machine" genérico |

---

## Ejemplo Completo

### Ejercicio: Press de banca con barra

```sql
-- 1. Datos técnicos (sin idioma)
INSERT INTO exercises (
  id, source, created_by_user_id, main_muscle_group, primary_equipment,
  exercise_type, secondary_muscle_groups, equipment, similar_exercises,
  default_measurement_template, primary_media_url, primary_media_type,
  difficulty, unilateral, movement_pattern, adds_bodyweight
) VALUES (
  '10000000-0001-0000-0000-000000000001',
  'built_in',
  NULL,
  'chest',
  'barbell',
  'compound',
  '["triceps", "shoulders_front"]',
  '["barbell", "bench"]',
  '["10000000-0001-0000-0000-000000000002"]',
  'weight_reps',
  NULL,
  NULL,
  2,
  false,
  'push',
  false
);

-- 2. Traducción español (con errores comunes en español)
INSERT INTO exercise_translations (
  exercise_id, language_code, name, name_search, instructions, common_mistakes
) VALUES (
  '10000000-0001-0000-0000-000000000001',
  'es',
  'Press de banca con barra',
  'press de banca con barra bench press pecho plano barbell',
  '[
    "Acostate en el banco plano con los pies firmes en el suelo y la espalda con arco natural.",
    "Tomá la barra con agarre prono, manos separadas un poco más que el ancho de hombros.",
    "Descolgá la barra y posicionala sobre el pecho con los brazos extendidos.",
    "Bajá la barra de forma controlada hasta tocar suavemente el pecho a la altura de los pezones.",
    "Empujá la barra hacia arriba extendiendo los brazos sin bloquear los codos.",
    "Mantené los omóplatos retraídos y el core activado durante todo el movimiento."
  ]',
  '["Rebotar la barra en el pecho", "Arquear excesivamente la espalda", "Levantar los glúteos del banco"]'
);

-- 3. Traducción inglés (con errores comunes en inglés)
INSERT INTO exercise_translations (
  exercise_id, language_code, name, name_search, instructions, common_mistakes
) VALUES (
  '10000000-0001-0000-0000-000000000001',
  'en',
  'Barbell Bench Press',
  'barbell bench press flat chest pecho',
  '[
    "Lie on flat bench with feet firmly on floor and natural arch in back.",
    "Grip bar with overhand grip, hands slightly wider than shoulder width.",
    "Unrack bar and position over chest with arms extended.",
    "Lower bar in controlled manner until it lightly touches chest at nipple level.",
    "Push bar up extending arms without locking elbows.",
    "Keep shoulder blades retracted and core engaged throughout movement."
  ]',
  '["Bouncing bar off chest", "Excessive back arch", "Lifting glutes off bench"]'
);
```

---

## Checklist de Calidad 10/10

Antes de dar por terminado un ejercicio, verificar:

**Tabla `exercises`:**

- [ ] `main_muscle_group` es el músculo PRINCIPAL (1 solo)
- [ ] `secondary_muscle_groups` incluye TODOS los músculos secundarios relevantes
- [ ] `primary_equipment` es el equipo PRINCIPAL (1 solo)
- [ ] `equipment` incluye TODO el equipo necesario (ej: barra + banco)
- [ ] `difficulty` refleja la dificultad TÉCNICA (no la intensidad), 1-5
- [ ] `unilateral` está correcto
- [ ] `movement_pattern` es uno de los 8 válidos
- [ ] `adds_bodyweight` está correcto para ejercicios con lastre
- [ ] `default_measurement_template` está correcto
- [ ] `similar_exercises` incluye UUIDs de ejercicios relacionados (opcional)

**Tabla `exercise_translations` (por cada idioma):**

- [ ] `name` incluye equipamiento cuando corresponde
- [ ] `name_search` incluye sinónimos y términos alternativos
- [ ] `instructions` tiene 5-7 pasos claros y específicos
- [ ] `instructions` usa español rioplatense para ES (vos, segunda persona)
- [ ] `instructions` incluye posición inicial, movimiento, y puntos clave
- [ ] `common_mistakes` tiene 2-4 errores reales en el idioma correspondiente

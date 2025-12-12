# Estructura de Ejercicios - FINAL

**Estado: IMPLEMENTADO** ✅

Este documento refleja la estructura final de exercises, muscles y equipment ya implementada en el código.

---

## EQUIPMENT (20 valores)

```
bodyweight          - Peso corporal
barbell             - Barra olímpica
dumbbell            - Mancuerna
kettlebell          - Kettlebell
ez_bar              - Barra EZ
plate               - Disco
cable               - Cable/Polea
machine             - Máquina (genérico)
smith_machine       - Máquina Smith
bench               - Banco (plano/inclinado/declinado)
pull_up_bar         - Barra de dominadas
dip_bars            - Barras de fondos
resistance_band     - Banda elástica
trap_bar            - Barra trampa/hexagonal
landmine            - Landmine
suspension_trainer  - TRX/Entrenador de suspensión
medicine_ball       - Balón medicinal
cardio_machine      - Máquina de cardio (bici, cinta, etc.)
rings               - Anillas de gimnasia
parallettes         - Paralelas bajas
```

---

## MUSCLES (18 valores)

```
chest               - Pecho (sin subdivisiones)
upper_back          - Espalda alta (trapecios, romboides)
lats                - Dorsales
shoulders_front     - Hombro frontal (deltoides anterior)
shoulders_side      - Hombro lateral (deltoides medio)
shoulders_rear      - Hombro posterior (deltoides posterior)
biceps              - Bíceps
triceps             - Tríceps
forearms            - Antebrazos
abs                 - Abdominales (recto abdominal + transverso)
obliques            - Oblicuos
lower_back          - Zona lumbar (erectores espinales)
glutes              - Glúteos
quads               - Cuádriceps
hamstrings          - Isquiotibiales
calves              - Gemelos
hip_flexors         - Flexores de cadera
full_body           - Cuerpo completo (para cardio/compuestos)
```

---

## EXERCISE FIELDS (todos los campos del ejercicio)

```
id                            - UUID único
name                          - Nombre del ejercicio
name_search                   - Nombre normalizado para búsqueda
source                        - "system" | "user"
created_by_user_id            - Si es user-created, el ID del usuario
main_muscle_group             - Músculo principal (1 valor de MUSCLES)
primary_equipment             - Equipo principal (1 valor de EQUIPMENT)
exercise_type                 - "compound" | "isolation"
secondary_muscle_groups       - Array de músculos secundarios (MUSCLES)
equipment                     - Array de todo el equipo necesario (EQUIPMENT)
similar_exercises             - Array de IDs de ejercicios similares
instructions                  - Array de strings con pasos
default_measurement_template  - Template de medición por defecto

-- CAMPOS NUEVOS --
difficulty                    - 1 a 5 (nivel de dificultad técnica)
unilateral                    - true | false (si trabaja un lado a la vez)
movement_pattern              - "push" | "pull" | "squat" | "hinge" | "lunge" | "carry" | "rotation" | "isometric"
adds_bodyweight               - true | false (si suma el peso corporal al peso, ej: dominadas con lastre)
common_mistakes               - Array de strings con errores comunes (opcional)

-- CAMPOS DE MEDIA --
primary_media_url             - URL del GIF/imagen
primary_media_type            - "gif" | "image"
```

---

## EXERCISE_TYPE

```
compound    - Multiarticular (press banca, sentadilla)
isolation   - Monoarticular (curl bíceps, extensión pierna)
```

---

## MOVEMENT_PATTERN (nuevo)

```
push        - Empuje (press, flexiones)
pull        - Tirón (dominadas, remos)
squat       - Sentadilla (squat, prensa)
hinge       - Bisagra de cadera (peso muerto, hip thrust)
lunge       - Zancada (lunges, step-ups)
carry       - Acarreo (farmer walks)
rotation    - Rotación (russian twist, cable woodchop)
isometric   - Isométrico (plancha, hold)
```

---

## MEASUREMENT_TEMPLATE (qué campos se muestran al loggear cada set)

```
weight_reps         - Peso + Reps (press, curl, etc.)
weight_reps_range   - Peso + Rep mínima/máxima
time_only           - Solo tiempo (plancha)
weight_time         - Peso + Tiempo (farmer hold)
distance_only       - Solo distancia (carrera)
distance_time       - Distancia + Tiempo (cardio)
weight_distance     - Peso + Distancia (farmer walk)
```

---

## SET_TYPE

```
normal      - Serie normal
warmup      - Serie de calentamiento
drop        - Drop set
failure     - Al fallo
cluster     - Cluster set
rest-pause  - Rest-pause
mechanical  - Mechanical drop set
eccentric   - Énfasis excéntrico
partial     - Parciales
isometric   - Isométrico
```

---

## Archivos actualizados

- `shared/types/workout.ts` - Tipos IExerciseMuscle, IExerciseEquipment, IMovementPattern, IDifficulty
- `shared/db/schema/routine.ts` - Schema con nuevos campos
- `shared/constants/exercise.ts` - Arrays y labels
- `shared/translations/exercise-labels.ts` - Traducciones ES/EN
- `shared/utils/muscle-categories.ts` - Agrupación de músculos para analytics
- `features/routine-templates/constants/index.ts` - Traducciones para templates

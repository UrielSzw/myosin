# Exercises V2

Nueva estructura de ejercicios con los 18 músculos y 18 equipamientos simplificados.
Incluye sistema de progresiones de calistenia basado en BWF Recommended Routine y Overcoming Gravity.

## Estructura

```
exercises-v2/
├── README.md                    # Este archivo
├── EXERCISE_LIST.md             # Listado maestro de todos los ejercicios
├── exercises/                   # SQLs de ejercicios (tabla exercises)
│   ├── 01-chest.sql
│   ├── 02-back.sql              # upper_back + lats
│   ├── 03-shoulders.sql         # front + side + rear
│   ├── 04-arms.sql              # biceps + triceps + forearms
│   ├── 05-legs.sql              # quads + hamstrings + glutes + calves
│   ├── 06-core.sql              # abs + obliques + lower_back
│   ├── 07-fullbody.sql          # full_body
│   └── 08-progressions.sql      # 63 calisthenics progressions
├── translations/                # SQLs de traducciones (incluye common_mistakes)
│   ├── 01-chest-es.sql
│   ├── 01-chest-en.sql
│   ├── ...
│   ├── 08-progressions-en.sql   # English: calisthenics exercises
│   └── 08-progressions-es.sql   # Spanish: calisthenics exercises
└── progressions/                # Sistema de progresiones
    ├── progression_paths.sql           # 13 skill trees definidos
    └── progression_path_exercises.sql  # 73 ejercicios vinculados con criterios de desbloqueo
```

## Schema

### Tabla `exercises` (datos técnicos, sin idioma)

| Campo                          | Tipo  | Descripción                                          |
| ------------------------------ | ----- | ---------------------------------------------------- |
| `id`                           | UUID  | ID único del ejercicio                               |
| `source`                       | TEXT  | 'system' \| 'user'                                   |
| `created_by_user_id`           | UUID  | NULL para system                                     |
| `main_muscle_group`            | TEXT  | Músculo principal (NOT NULL)                         |
| `primary_equipment`            | TEXT  | Equipo principal (NOT NULL)                          |
| `exercise_type`                | TEXT  | 'compound' \| 'isolation'                            |
| `secondary_muscle_groups`      | JSONB | Array de músculos secundarios                        |
| `equipment`                    | JSONB | Array de todo el equipo necesario                    |
| `similar_exercises`            | JSONB | Array de UUIDs relacionados                          |
| `default_measurement_template` | TEXT  | Template de medición                                 |
| `primary_media_url`            | TEXT  | URL de imagen/video                                  |
| `primary_media_type`           | TEXT  | 'image' \| 'video' \| 'gif'                          |
| `difficulty`                   | INT   | 1-5 (técnica)                                        |
| `unilateral`                   | BOOL  | true si trabaja un lado                              |
| `movement_pattern`             | TEXT  | push/pull/squat/hinge/lunge/carry/rotation/isometric |
| `adds_bodyweight`              | BOOL  | true si suma peso corporal                           |

### Tabla `exercise_translations` (contenido por idioma)

| Campo             | Tipo  | Descripción                             |
| ----------------- | ----- | --------------------------------------- |
| `exercise_id`     | UUID  | FK a exercises                          |
| `language_code`   | TEXT  | 'es' \| 'en'                            |
| `name`            | TEXT  | Nombre del ejercicio                    |
| `name_search`     | TEXT  | Términos de búsqueda                    |
| `instructions`    | JSONB | Array de pasos                          |
| `common_mistakes` | JSONB | Array de errores comunes (en el idioma) |

## Sistema de Progresiones

Basado en las mejores prácticas de calistenia:

- **BWF Recommended Routine** (r/bodyweightfitness)
- **Overcoming Gravity** de Steven Low (Tablas de Prilepin para isométricos)

### Categorías de Paths

| Tier         | Paths                                             |
| ------------ | ------------------------------------------------- |
| Foundational | Pull-up, Row, Dip, Push-up, Squat, Hinge (Nordic) |
| Intermediate | Muscle-up, HSPU, L-sit, Front Lever               |
| Advanced     | Planche, Back Lever, Dragon Flag                  |

### Criterios de Desbloqueo

- **Dinámicos**: 3×8 reps (standard BWF)
- **Isométricos**: 3×30 segundos (60-70% del máximo según Prilepin)

### Tabla `progression_paths`

| Campo             | Tipo | Descripción                            |
| ----------------- | ---- | -------------------------------------- |
| `id`              | UUID | ID único del path                      |
| `slug`            | TEXT | Identificador corto (pull_up, planche) |
| `name_en`         | TEXT | Nombre en inglés                       |
| `name_es`         | TEXT | Nombre en español                      |
| `description_*`   | TEXT | Descripción del path                   |
| `category`        | TEXT | pull, push, legs, core, skill          |
| `difficulty_tier` | TEXT | foundational, intermediate, advanced   |
| `icon`            | TEXT | Icono para UI                          |

### Tabla `progression_path_exercises`

| Campo                       | Tipo   | Descripción                              |
| --------------------------- | ------ | ---------------------------------------- |
| `id`                        | UUID   | ID único                                 |
| `path_id`                   | UUID   | FK a progression_paths                   |
| `exercise_id`               | UUID   | FK a exercises                           |
| `position`                  | INT    | Orden en el path (permite branches)      |
| `unlock_type`               | TEXT   | sets_reps, time, prerequisite            |
| `unlock_sets`               | INT    | Sets requeridos (ej: 3)                  |
| `unlock_reps`               | INT    | Reps requeridas (ej: 8)                  |
| `unlock_seconds`            | INT    | Segundos requeridos (ej: 30)             |
| `prerequisite_exercise_ids` | UUID[] | Ejercicios que deben estar desbloqueados |

## Referencia

- Ver `/docs/EXERCISE_CREATION_GUIDE.md` para reglas y estándares

# 📖 Myosin - Biblia de Producto

> Documento completo de referencia sobre todas las funcionalidades, conceptos y características de Myosin.

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura Local-First](#arquitectura-local-first)
4. [Flujo de Usuario](#flujo-de-usuario)
5. [Módulos Principales](#módulos-principales)
   - [Ejercicios](#ejercicios)
   - [Rutinas y Bloques](#rutinas-y-bloques)
   - [Workout Activo](#workout-activo)
   - [Personal Records (PRs)](#personal-records-prs)
   - [Tracker de Métricas](#tracker-de-métricas)
   - [Analytics](#analytics)
6. [Sistema de Mediciones](#sistema-de-mediciones)
7. [Tipos de Sets](#tipos-de-sets)
8. [Configuración de Usuario](#configuración-de-usuario)
9. [Sistema de Sincronización](#sistema-de-sincronización)
10. [Internacionalización](#internacionalización)

---

## Visión General

**Myosin** es una aplicación móvil de fitness diseñada para el seguimiento y gestión de entrenamientos de fuerza. La aplicación se distingue por:

- 🏠 **Local-First**: Funciona completamente offline, sincroniza cuando hay conexión
- 🎯 **Orientada al progreso**: Seguimiento automático de PRs y volumen
- 🔧 **Altamente configurable**: Métricas personalizables, múltiples templates de medición
- 📊 **Analytics integrado**: Dashboard con insights de entrenamiento y hábitos

---

## Stack Tecnológico

| Categoría           | Tecnología                              |
| ------------------- | --------------------------------------- |
| Framework           | React Native 0.81.4 + Expo 54           |
| Navegación          | Expo Router (file-based routing)        |
| Base de Datos Local | SQLite + Drizzle ORM                    |
| Base de Datos Cloud | Supabase (PostgreSQL)                   |
| Estado Global       | Zustand                                 |
| Data Fetching       | TanStack React Query                    |
| UI Components       | Custom components + Lucide React Native |
| Animaciones         | React Native Reanimated                 |
| Listas              | @shopify/flash-list                     |
| Gráficos            | react-native-gifted-charts              |

---

## Arquitectura Local-First

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │ ←→ │   SQLite Local   │ ←→ │  Supabase Cloud │
│   (UI Layer)    │    │   (Primary DB)   │    │  (Backup/Sync)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↑
                       ┌──────────────────┐
                       │   Sync Engine    │
                       │  (Fire & Forget) │
                       └──────────────────┘
```

### Principios Clave

1. **Escritura Local Primero**: Todos los cambios se guardan inmediatamente en SQLite
2. **UI Instantánea**: La interfaz se actualiza sin esperar respuesta del servidor
3. **Sync en Background**: La sincronización ocurre de forma asíncrona
4. **Funcionamiento Offline**: 100% de funcionalidad sin conexión

---

## Flujo de Usuario

### 1. Onboarding (Nuevo Usuario)

El onboarding recolecta información personal para personalizar la experiencia:

| Paso                   | Datos                    | Opciones                                  |
| ---------------------- | ------------------------ | ----------------------------------------- |
| 1. Bienvenida          | -                        | Introducción a la app                     |
| 2. Sexo Biológico      | `biological_sex`         | `male` \| `female`                        |
| 3. Fecha de Nacimiento | `birth_date`             | Selector de fecha                         |
| 4. Medidas             | `height_cm`, `weight_kg` | Altura y peso inicial                     |
| 5. Objetivo            | `fitness_goal`           | `lose_fat` \| `maintain` \| `gain_muscle` |
| 6. Nivel de Actividad  | `activity_level`         | Ver tabla abajo                           |
| 7. Completado          | -                        | Confirmación                              |

#### Niveles de Actividad

| Nivel         | Descripción                            | Multiplicador TDEE |
| ------------- | -------------------------------------- | ------------------ |
| `sedentary`   | Trabajo de escritorio, poco movimiento | 1.2x               |
| `light`       | Ejercicio ligero 1-3 días/semana       | 1.375x             |
| `moderate`    | Ejercicio moderado 3-5 días/semana     | 1.55x              |
| `active`      | Ejercicio intenso 6-7 días/semana      | 1.725x             |
| `very_active` | Atleta o trabajo físico muy demandante | 1.9x               |

---

## Módulos Principales

### Ejercicios

La app incluye ejercicios predefinidos organizados por grupos musculares.

#### Grupos Musculares (`IExerciseMuscle`) - 18 valores

**Upper Body - Push**

- `chest` - Pecho
- `shoulders_front` - Hombro frontal
- `shoulders_side` - Hombro lateral
- `shoulders_rear` - Hombro posterior
- `triceps` - Tríceps

**Upper Body - Pull**

- `upper_back` - Espalda alta (trapecios, romboides)
- `lats` - Dorsales
- `biceps` - Bíceps
- `forearms` - Antebrazos

**Core**

- `abs` - Abdominales
- `obliques` - Oblicuos
- `lower_back` - Zona lumbar

**Lower Body**

- `glutes` - Glúteos
- `quads` - Cuádriceps
- `hamstrings` - Isquiotibiales
- `calves` - Gemelos
- `hip_flexors` - Flexores de cadera

**Otros**

- `full_body` - Cuerpo completo

#### Equipamiento (`IExerciseEquipment`) - 20 valores

**Pesos Libres**

- `barbell` - Barra olímpica
- `dumbbell` - Mancuerna
- `kettlebell` - Kettlebell
- `ez_bar` - Barra EZ
- `plate` - Disco
- `trap_bar` - Barra trampa

**Máquinas**

- `cable` - Cable/Polea
- `machine` - Máquina (genérico)
- `smith_machine` - Máquina Smith
- `cardio_machine` - Máquina de cardio

**Peso Corporal**

- `bodyweight` - Peso corporal
- `pull_up_bar` - Barra de dominadas
- `dip_bars` - Barras de fondos

**Accesorios**

- `bench` - Banco
- `resistance_band` - Banda elástica
- `suspension_trainer` - TRX
- `medicine_ball` - Balón medicinal
- `landmine` - Landmine
- `rings` - Anillas de gimnasia
- `parallettes` - Paralelas bajas

#### Tipo de Ejercicio (`IExerciseType`)

| Tipo        | Descripción                                                        |
| ----------- | ------------------------------------------------------------------ |
| `compound`  | Ejercicios multiarticulares (Press banca, Sentadilla, Peso muerto) |
| `isolation` | Ejercicios de aislamiento (Curl bíceps, Extensión de tríceps)      |

#### Patrón de Movimiento (`IMovementPattern`)

| Patrón      | Descripción                        |
| ----------- | ---------------------------------- |
| `push`      | Empuje (press, flexiones)          |
| `pull`      | Tirón (dominadas, remos)           |
| `squat`     | Sentadilla (squat, prensa)         |
| `hinge`     | Bisagra de cadera (peso muerto)    |
| `lunge`     | Zancada (lunges, step-ups)         |
| `carry`     | Acarreo (farmer walks)             |
| `rotation`  | Rotación (russian twist, woodchop) |
| `isometric` | Isométrico (plancha, hold)         |

#### Origen del Ejercicio (`IExerciseSource`)

| Origen   | Descripción                       |
| -------- | --------------------------------- |
| `system` | Ejercicios predefinidos de la app |
| `user`   | Ejercicios creados por el usuario |

---

### Rutinas y Bloques

#### Estructura Jerárquica

```
📁 Carpeta (Folder)
└── 🏋️ Rutina (Routine)
    └── 📦 Bloque (Block)
        └── 💪 Ejercicio en Bloque (Exercise in Block)
            └── 🔢 Set (Routine Set)
```

#### Carpetas (Folders)

Permiten organizar rutinas por categorías personalizadas.

| Campo         | Descripción          |
| ------------- | -------------------- |
| `name`        | Nombre de la carpeta |
| `color`       | Color en hexadecimal |
| `icon`        | Ícono identificador  |
| `order_index` | Posición en la lista |

#### Rutinas (Routines)

| Campo              | Descripción                                               |
| ------------------ | --------------------------------------------------------- |
| `name`             | Nombre de la rutina                                       |
| `folder_id`        | Carpeta contenedora (opcional)                            |
| `training_days`    | Días de entrenamiento `["monday", "wednesday", "friday"]` |
| `show_rpe`         | Mostrar selector de RPE                                   |
| `show_tempo`       | Mostrar selector de tempo                                 |
| `is_quick_workout` | Si es una rutina temporal (Quick Workout)                 |
| `deleted_at`       | Soft delete timestamp (null = activa)                     |

#### Tipos de Bloque (`IBlockType`)

| Tipo         | Descripción     | Comportamiento                                          |
| ------------ | --------------- | ------------------------------------------------------- |
| `individual` | Ejercicio único | Un ejercicio a la vez                                   |
| `superset`   | Superserie      | 2+ ejercicios consecutivos sin descanso entre ellos     |
| `circuit`    | Circuito        | Múltiples ejercicios en secuencia con descanso al final |

#### Configuración de Bloques

| Campo                            | Descripción                                         |
| -------------------------------- | --------------------------------------------------- |
| `type`                           | Tipo de bloque                                      |
| `name`                           | Nombre del bloque                                   |
| `rest_time_seconds`              | Descanso entre series/rondas                        |
| `rest_between_exercises_seconds` | Descanso entre ejercicios (para supersets/circuits) |
| `order_index`                    | Posición en la rutina                               |

---

### Workout Activo

El módulo de workout activo permite ejecutar una rutina en tiempo real.

#### Características

- ⏱️ **Timer Global**: Cuenta el tiempo total de entrenamiento
- ⏳ **Timer de Descanso**: Cuenta regresiva entre series (configurable)
- ✅ **Tracking de Sets**: Marca sets como completados
- 📝 **Valores Planificados vs Ejecutados**: Compara lo planeado con lo realizado
- 🏆 **Detección de PRs**: Detecta automáticamente nuevos records
- 📊 **Previous Sets**: Muestra los valores de la última sesión
- 🔀 **Reordenar Bloques/Ejercicios**: Drag & drop durante el workout
- 📏 **Cambiar Measurement Template**: Modificar tipo de medición por ejercicio
- ⏲️ **Timer para Ejercicios de Tiempo**: Timer visual para sets basados en tiempo
- 🔄 **Circuit Timer Mode**: Modo especial para ejecutar circuitos con timer automático

#### Quick Workout

Permite iniciar un entrenamiento sin rutina previa:

1. Se crea una rutina temporal con `is_quick_workout = true`
2. El usuario agrega ejercicios sobre la marcha
3. Al finalizar, puede convertirla en rutina normal o descartarla
4. Las rutinas con `is_quick_workout = true` no aparecen en la lista de rutinas

#### Reordenamiento Durante Workout

El usuario puede reorganizar la estructura del workout en tiempo real:

| Acción               | Descripción                                     | Restricciones |
| -------------------- | ----------------------------------------------- | ------------- |
| Reordenar Bloques    | Cambiar orden de bloques via drag & drop        | Ninguna       |
| Reordenar Ejercicios | Cambiar orden de ejercicios dentro de un bloque | Ninguna       |

Los cambios de orden se detectan como modificaciones y al finalizar el workout se sugiere actualizar la rutina original.

#### Cambio de Measurement Template

Durante el workout activo, se puede cambiar el tipo de medición de un ejercicio:

| Condición            | Comportamiento                      |
| -------------------- | ----------------------------------- |
| Sin sets completados | ✅ Permite cambiar template         |
| Con sets completados | ❌ Bloqueado (datos ya registrados) |

**Al cambiar template:**

1. Se actualiza `measurement_template` en todos los sets del ejercicio
2. Se limpian `actual_primary_value` y `actual_secondary_value`
3. Se marca `was_modified_during_workout = true`
4. Al finalizar, se sugiere actualizar la rutina original

**Previous Sets (PREV):**

- Si el template anterior es compatible, muestra los valores formateados
- Si es incompatible, muestra "--" (no hay datos comparables)

#### Timer para Sets de Tiempo (SingleSetTimerSheet)

Para ejercicios con measurement template basado en tiempo (`time_only`, `weight_time`), se ofrece un timer visual interactivo:

**Características:**

- 🎯 **Círculo de progreso animado**: Visualización clara del tiempo transcurrido
- ▶️ **Control de Play/Pause**: Iniciar, pausar y reanudar el timer
- 🔄 **Reset**: Reiniciar el timer desde cero
- ✅ **Completar parcial**: Terminar antes con el tiempo actual registrado
- ✅ **Completar target**: Marcar como completado con la duración objetivo
- 🔔 **Haptic feedback**: Vibración en los últimos 3 segundos
- 🔊 **Audio de completado**: Sonido al finalizar el timer

**Estados del Timer:**

| Estado     | Descripción                    |
| ---------- | ------------------------------ |
| `idle`     | Timer listo para iniciar       |
| `running`  | Timer corriendo                |
| `paused`   | Timer pausado                  |
| `complete` | Timer completado (auto-cierre) |

**Acciones disponibles:**

| Acción           | Descripción                    | Resultado                         |
| ---------------- | ------------------------------ | --------------------------------- |
| Start            | Inicia el timer                | Comienza cuenta regresiva         |
| Pause            | Pausa el timer                 | Preserva tiempo transcurrido      |
| Resume           | Reanuda timer pausado          | Continúa desde donde quedó        |
| Reset            | Reinicia el timer              | Vuelve a duración objetivo        |
| Complete Partial | Completa con tiempo actual     | Registra tiempo real transcurrido |
| Complete Target  | Completa con duración objetivo | Registra duración planificada     |

#### Circuit Timer Mode (CircuitTimerModeV2)

Modo especial de ejecución para bloques de tipo `circuit`. Proporciona una experiencia guiada con timer automático que alterna entre ejercicios y descansos.

**Características:**

- 📋 **Vista previa del circuito**: Muestra todos los ejercicios, rondas y tiempos estimados antes de iniciar
- ⏱️ **Countdown inicial**: 5 segundos de preparación antes de comenzar
- 🔄 **Transiciones automáticas**: Pasa automáticamente entre ejercicio → descanso → siguiente ejercicio
- 🎨 **Colores por estado**: Diferentes colores para ejercicio (azul), descanso (verde), descanso entre rondas (ámbar)
- 📊 **Progreso visual**: Círculo animado con progreso y tiempo restante
- ⏭️ **Skip**: Saltar ejercicio o descanso actual
- ⏸️ **Pause/Resume**: Pausar y reanudar en cualquier momento
- 🏆 **Celebración de completado**: Animación al finalizar el circuito

**Estados del Circuit Timer:**

| Estado      | Color  | Descripción                          |
| ----------- | ------ | ------------------------------------ |
| `idle`      | -      | Vista previa, listo para iniciar     |
| `countdown` | Indigo | Cuenta regresiva de preparación (5s) |
| `exercise`  | Azul   | Ejecutando ejercicio actual          |
| `rest`      | Verde  | Descanso entre ejercicios            |
| `roundRest` | Ámbar  | Descanso entre rondas                |
| `paused`    | -      | Timer pausado                        |
| `complete`  | Verde  | Circuito completado                  |

**Flujo de ejecución:**

```
Countdown (5s) → Ejercicio 1 → Rest → Ejercicio 2 → Rest → ... → Round Rest → Ejercicio 1 (Round 2) → ... → Complete
```

**Auto-complete de sets:**

- Cuando el timer de un ejercicio termina, el set se marca automáticamente como completado
- Se registra la duración objetivo como `actual_primary_value`

#### Estados del Set en Workout

| Campo                         | Tipo      | Descripción                                  |
| ----------------------------- | --------- | -------------------------------------------- |
| `planned_primary_value`       | `number`  | Valor planeado (ej: peso)                    |
| `planned_secondary_value`     | `number`  | Valor planeado (ej: reps)                    |
| `actual_primary_value`        | `number`  | Valor ejecutado                              |
| `actual_secondary_value`      | `number`  | Valor ejecutado                              |
| `completed`                   | `boolean` | Si el set fue completado                     |
| `was_added_during_workout`    | `boolean` | Si fue agregado durante el workout           |
| `was_modified_during_workout` | `boolean` | Si fue modificado (template, set type, etc.) |

---

### Personal Records (PRs)

El sistema de PRs rastrea automáticamente los mejores rendimientos para **todos los measurement templates**.

#### Sistema de PR Score

Cada measurement template tiene su propia fórmula de cálculo de PR Score:

| Template            | Score Name  | Fórmula                        | Ejemplo                |
| ------------------- | ----------- | ------------------------------ | ---------------------- |
| `weight_reps`       | Est. 1RM    | `peso × (1 + reps/30)` (Epley) | 100kg × 8 reps = 126.7 |
| `weight_reps_range` | Est. 1RM    | `peso × (1 + reps/30)` (Epley) | Igual que weight_reps  |
| `time_only`         | Duración    | `segundos`                     | 120 seg plancha        |
| `weight_time`       | Volumen TUT | `peso × segundos`              | 20kg × 60s = 1200      |
| `distance_only`     | Distancia   | `metros`                       | 5000m corriendo        |
| `distance_time`     | Trabajo     | `metros × 60 / segundos`       | 1000m en 240s = 250    |
| `weight_distance`   | Trabajo     | `peso × metros`                | 40kg × 50m = 2000      |

#### Tablas de PRs

**`pr_current`** - PR actual por ejercicio (genérico para todos los templates)

| Campo                  | Tipo               | Descripción                                      |
| ---------------------- | ------------------ | ------------------------------------------------ |
| `exercise_id`          | UUID               | Ejercicio                                        |
| `measurement_template` | string             | Template de medición usado                       |
| `best_primary_value`   | number             | Mejor valor primario (peso, tiempo, distancia)   |
| `best_secondary_value` | number?            | Mejor valor secundario (reps, tiempo, distancia) |
| `pr_score`             | number             | Score calculado según template                   |
| `achieved_at`          | timestamp          | Fecha del PR                                     |
| `source`               | `auto` \| `manual` | Origen del PR                                    |

**`pr_history`** - Historial de PRs

| Campo                  | Tipo    | Descripción                    |
| ---------------------- | ------- | ------------------------------ |
| `exercise_id`          | UUID    | Ejercicio                      |
| `measurement_template` | string  | Template de medición           |
| `primary_value`        | number  | Valor primario del PR          |
| `secondary_value`      | number? | Valor secundario del PR        |
| `pr_score`             | number  | Score en ese momento           |
| `workout_session_id`   | UUID?   | Sesión donde se logró          |
| `workout_set_id`       | UUID?   | Set específico                 |
| `source`               | string  | `auto` \| `manual` \| `import` |

#### Detección de PRs

El sistema detecta PRs comparando el `pr_score` calculado:

```typescript
// Un PR es mejor si su score es mayor
isPRBetter(newScore, currentScore) => newScore > (currentScore ?? 0)
```

#### Validación Durante Workout

1. Al completar un set, se calcula el `pr_score` según el template
2. Se compara con el PR histórico del ejercicio
3. Si es mejor → Se marca como PR, haptic feedback de éxito 🎉
4. Si no hay PR histórico → El primer set válido es automáticamente un PR

#### Celebración de PR

Cuando se detecta un nuevo PR durante el workout:

1. Se muestra indicador visual de PR en el set ✨
2. Haptic feedback de éxito
3. Se guarda en `pr_history`
4. Si es mejor que el actual, se actualiza `pr_current`
5. En el workout summary se muestra el PR con formato específico del template

---

### Tracker de Métricas

Sistema de seguimiento de métricas personalizadas y hábitos.

#### Tipos de Input (`IMetricInputType`)

| Tipo                   | Descripción           | Ejemplo               | Comportamiento           |
| ---------------------- | --------------------- | --------------------- | ------------------------ |
| `numeric_accumulative` | Número que se acumula | Agua, Proteína, Pasos | Suma durante el día      |
| `numeric_single`       | Número único por día  | Peso, Horas de sueño  | Reemplaza valor anterior |
| `scale_discrete`       | Escala discreta       | Estado de ánimo (1-5) | Selector visual          |
| `boolean_toggle`       | Sí/No                 | ¿Tomé vitaminas?      | Toggle simple            |

#### Comportamiento (`IMetricBehavior`)

| Comportamiento | Descripción                                 |
| -------------- | ------------------------------------------- |
| `accumulate`   | Los valores se suman (agua, pasos)          |
| `replace`      | El nuevo valor reemplaza el anterior (peso) |

#### Métricas Predefinidas

| Slug                | Nombre                  | Input Type             | Unidad | Target Default |
| ------------------- | ----------------------- | ---------------------- | ------ | -------------- |
| `protein`           | Proteína                | `numeric_accumulative` | g      | 150g           |
| `water`             | Agua                    | `numeric_accumulative` | L      | 2500ml         |
| `calories`          | Calorías                | `numeric_accumulative` | kcal   | 2000           |
| `steps`             | Pasos                   | `numeric_accumulative` | pasos  | 10000          |
| `sleep`             | Sueño                   | `numeric_single`       | horas  | 8h             |
| `weight`            | Peso                    | `numeric_single`       | kg     | -              |
| `mood`              | Estado de ánimo         | `scale_discrete`       | nivel  | -              |
| `sleep_quality`     | Calidad del Sueño       | `scale_discrete`       | nivel  | -              |
| `stress_level`      | Nivel de Estrés         | `scale_discrete`       | nivel  | -              |
| `focus_time`        | Tiempo de Concentración | `numeric_accumulative` | min    | 120            |
| `meditation`        | Meditación              | `numeric_accumulative` | min    | 20             |
| `reading_time`      | Tiempo de Lectura       | `numeric_accumulative` | min    | 30             |
| `creatine`          | Creatina                | `numeric_accumulative` | g      | 5              |
| `vitamins`          | Vitaminas               | `boolean_toggle`       | -      | -              |
| `sunlight_exposure` | Exposición Solar        | `numeric_accumulative` | min    | 20             |

#### Quick Actions (Acciones Rápidas)

Botones predefinidos para registro rápido. Ejemplos:

**Proteína:**

- Pollo (150g) → 35g
- Huevos (2u) → 12g
- Shake de proteína → 25g
- Yogurt griego → 15g
- Atún (lata) → 28g
- Lentejas (1 taza) → 18g

**Agua:**

- Vaso chico (200ml) → 0.2L
- Vaso grande (300ml) → 0.3L
- Botella (500ml) → 0.5L
- Botella grande (1L) → 1L

**Calorías:**

- Desayuno típico → 400kcal
- Almuerzo completo → 600kcal
- Cena ligera → 350kcal
- Snack saludable → 150kcal

#### Agregados Diarios

El sistema pre-calcula agregados diarios para performance:

| Campo            | Descripción                   |
| ---------------- | ----------------------------- |
| `sum_normalized` | Suma total en unidad canónica |
| `count`          | Número de entradas            |
| `min_normalized` | Valor mínimo                  |
| `max_normalized` | Valor máximo                  |
| `avg_normalized` | Promedio                      |

---

### Analytics

Dashboard con métricas y visualizaciones del progreso.

#### Componentes del Dashboard

| Componente           | Descripción                                          |
| -------------------- | ---------------------------------------------------- |
| **Stats Overview**   | Métricas generales (workouts totales, volumen, etc.) |
| **Volume Chart**     | Gráfico de volumen por grupo muscular                |
| **Weekly Schedule**  | Calendario semanal de entrenamientos                 |
| **PR Highlights**    | PRs recientes destacados                             |
| **Recent Activity**  | Últimas sesiones de entrenamiento                    |
| **Tracker Insights** | Resumen de métricas del tracker                      |

#### Métricas Calculadas

- **Total Volume**: Suma de (peso × reps) por sesión
- **Average RPE**: Promedio de RPE en sets completados
- **Workout Frequency**: Entrenamientos por semana
- **Muscle Group Distribution**: % de volumen por músculo

---

## Sistema de Mediciones

### Templates de Medición (`MeasurementTemplateId`)

El sistema soporta diferentes combinaciones de métricas por ejercicio:

#### Templates de Métrica Única

| Template        | Descripción    | Campos   |
| --------------- | -------------- | -------- |
| `time_only`     | Solo tiempo    | Segundos |
| `distance_only` | Solo distancia | Metros   |

**Casos de uso:**

- `time_only`: Plancha, Wall Sit, Hang
- `distance_only`: Caminar/correr sin tiempo

#### Templates de Doble Métrica

| Template            | Descripción          | Campo Primario    | Campo Secundario |
| ------------------- | -------------------- | ----------------- | ---------------- |
| `weight_reps`       | Peso + Repeticiones  | Peso (kg/lbs)     | Reps             |
| `weight_reps_range` | Peso + Rango de Reps | Peso (kg/lbs)     | Rango (8-12)     |
| `distance_time`     | Distancia + Tiempo   | Distancia (km/mi) | Tiempo (min)     |
| `weight_distance`   | Peso + Distancia     | Peso (kg/lbs)     | Distancia (m/ft) |
| `weight_time`       | Peso + Tiempo        | Peso (kg/lbs)     | Tiempo (seg)     |

**Casos de uso:**

- `weight_reps`: Press banca, Sentadilla, Curl (DEFAULT)
- `weight_reps_range`: Ejercicios con rep target variable
- `distance_time`: Correr, Remar, Ciclismo
- `weight_distance`: Farmer's Walk, Sled Push
- `weight_time`: Isométricos con peso (Plank con disco)

### Tipos de Medición (`MeasurementType`)

| Tipo       | Descripción         | Unidades          |
| ---------- | ------------------- | ----------------- |
| `weight`   | Peso levantado      | kg, lbs           |
| `reps`     | Repeticiones        | número entero     |
| `range`    | Rango de reps       | min-max           |
| `distance` | Distancia recorrida | m, km, ft, mi     |
| `time`     | Tiempo de ejecución | segundos, minutos |

### Conversión de Unidades

El sistema soporta conversión automática basada en preferencias del usuario:

**Peso:**

- `kg` ↔ `lbs` (factor: 2.205)

**Distancia:**

- `metric`: metros (m), kilómetros (km)
- `imperial`: pies (ft), millas (mi)

---

## Tipos de Sets

### Set Types (`ISetType`)

| Tipo         | Descripción          | Uso Típico                   |
| ------------ | -------------------- | ---------------------------- |
| `normal`     | Set estándar         | La mayoría de ejercicios     |
| `warmup`     | Set de calentamiento | Primeros sets con poco peso  |
| `drop`       | Drop set             | Reducir peso sin descanso    |
| `failure`    | Set al fallo         | Llevar hasta fallo muscular  |
| `cluster`    | Cluster set          | Mini-descansos intra-set     |
| `rest-pause` | Rest-pause           | Descanso corto y continuar   |
| `mechanical` | Drop mecánico        | Cambiar posición para seguir |
| `eccentric`  | Énfasis excéntrico   | Negativas lentas             |
| `partial`    | Reps parciales       | Rango de movimiento reducido |
| `isometric`  | Isométrico           | Mantener posición estática   |

### Metadata de Sets

| Campo   | Tipo                   | Descripción                        |
| ------- | ---------------------- | ---------------------------------- |
| `rpe`   | 6-10 (incrementos 0.5) | Rate of Perceived Exertion         |
| `tempo` | "3-1-2-1"              | Excéntrico-Pausa-Concéntrico-Pausa |

#### RPE Scale

| RPE | Descripción               | Reps en Reserva |
| --- | ------------------------- | --------------- |
| 10  | Máximo esfuerzo           | 0 RIR           |
| 9.5 | Podría hacer 0.5 rep más  | ~0.5 RIR        |
| 9   | Podría hacer 1 rep más    | 1 RIR           |
| 8.5 | Podría hacer 1-2 reps más | 1-2 RIR         |
| 8   | Podría hacer 2 reps más   | 2 RIR           |
| 7.5 | Podría hacer 2-3 reps más | 2-3 RIR         |
| 7   | Podría hacer 3 reps más   | 3 RIR           |
| 6.5 | Podría hacer 3-4 reps más | 3-4 RIR         |
| 6   | Podría hacer 4+ reps más  | 4+ RIR          |

#### Formato de Tempo

`E-P1-C-P2` donde:

- **E** = Excéntrico (bajada)
- **P1** = Pausa en posición baja
- **C** = Concéntrico (subida)
- **P2** = Pausa en posición alta

Ejemplo: `3-1-2-1` = 3 seg bajando, 1 seg pausa abajo, 2 seg subiendo, 1 seg pausa arriba

---

## Configuración de Usuario

### Preferencias (`user_preferences`)

#### Preferencias de Display

| Campo           | Tipo                          | Default  | Descripción        |
| --------------- | ----------------------------- | -------- | ------------------ |
| `theme`         | `light` \| `dark` \| `system` | `system` | Tema visual        |
| `weight_unit`   | `kg` \| `lbs`                 | `kg`     | Unidad de peso     |
| `distance_unit` | `metric` \| `imperial`        | `metric` | Sistema de medidas |
| `language`      | `en` \| `es`                  | `en`     | Idioma de la app   |

#### Toggles de Features

| Campo                     | Tipo    | Default | Descripción                                 |
| ------------------------- | ------- | ------- | ------------------------------------------- |
| `show_rpe`                | boolean | `true`  | Mostrar RPE en ejercicios                   |
| `show_tempo`              | boolean | `true`  | Mostrar tempo en ejercicios                 |
| `keep_screen_awake`       | boolean | `true`  | Mantener pantalla encendida durante workout |
| `haptic_feedback_enabled` | boolean | `true`  | Vibración al completar sets                 |

#### Defaults de Workout

| Campo                       | Tipo   | Default | Descripción                    |
| --------------------------- | ------ | ------- | ------------------------------ |
| `default_rest_time_seconds` | number | `60`    | Tiempo de descanso por defecto |

#### Datos de Onboarding

| Campo                  | Tipo               | Descripción            |
| ---------------------- | ------------------ | ---------------------- |
| `biological_sex`       | `male` \| `female` | Sexo biológico         |
| `birth_date`           | ISO date           | Fecha de nacimiento    |
| `height_cm`            | number             | Altura en centímetros  |
| `initial_weight_kg`    | number             | Peso inicial en kg     |
| `fitness_goal`         | string             | Objetivo fitness       |
| `activity_level`       | string             | Nivel de actividad     |
| `onboarding_completed` | boolean            | Si completó onboarding |

---

## Sistema de Sincronización

### Arquitectura

El sync engine implementa:

- ✅ **Queue Persistente**: Mutations se guardan en SQLite si offline
- ✅ **Exponential Backoff**: Reintentos con delay creciente
- ✅ **Circuit Breaker**: Pausa si hay muchos fallos consecutivos
- ✅ **Scheduler Automático**: Procesa cada 30 segundos
- ✅ **Sync on Focus/Reconnect**: Procesa al volver a la app o reconectar

### Mutations Disponibles

#### Rutinas

- `ROUTINE_CREATE` - Crear rutina completa
- `ROUTINE_UPDATE` - Actualizar rutina
- `ROUTINE_DELETE` - Eliminar rutina (soft delete)
- `ROUTINE_CLEAR_TRAINING_DAYS` - Limpiar días de entrenamiento
- `ROUTINE_CREATE_QUICK_WORKOUT` - Crear rutina temporal para Quick Workout
- `ROUTINE_CONVERT_FROM_QUICK` - Convertir Quick Workout a rutina normal
- `ROUTINE_UPDATE_FOLDER` - Mover rutina a otra carpeta

#### Carpetas

- `FOLDER_CREATE` - Crear carpeta
- `FOLDER_UPDATE` - Actualizar carpeta
- `FOLDER_DELETE` - Eliminar carpeta
- `FOLDER_REORDER` - Reordenar carpetas

#### Workouts

- `WORKOUT_START` - Iniciar sesión de workout
- `WORKOUT_COMPLETE` - Guardar sesión completada
- `WORKOUT_UPDATE` - Actualizar sesión existente
- `FINISH_WORKOUT` - Finalizar workout (RPC completo)

#### PRs

- `PR_CREATE` - Crear nuevo PR actual
- `PR_UPDATE` - Agregar al historial de PRs

#### Usuario

- `USER_PREFERENCES_CREATE` - Crear preferencias
- `USER_PREFERENCES_UPDATE` - Actualizar preferencias

#### Tracker - Entries

- `TRACKER_ENTRY_CREATE` - Crear entrada de métrica
- `TRACKER_ENTRY_UPDATE` - Actualizar entrada
- `TRACKER_ENTRY_DELETE` - Eliminar entrada
- `TRACKER_ENTRY_FROM_QUICK_ACTION` - Crear desde acción rápida
- `TRACKER_ENTRY_WITH_AGGREGATE` - Crear con agregado atómico
- `TRACKER_REPLACE_ENTRY_WITH_AGGREGATE` - Reemplazar con agregado
- `TRACKER_DELETE_ENTRY_WITH_AGGREGATE` - Eliminar con agregado

#### Tracker - Metrics

- `TRACKER_METRIC_CREATE` - Crear métrica personalizada
- `TRACKER_METRIC_UPDATE` - Actualizar métrica
- `TRACKER_METRIC_DELETE` - Eliminar métrica (soft delete)
- `TRACKER_METRIC_RESTORE` - Restaurar métrica eliminada
- `TRACKER_METRIC_REORDER` - Reordenar métricas
- `TRACKER_METRIC_FROM_TEMPLATE` - Crear desde template

#### Tracker - Quick Actions

- `TRACKER_QUICK_ACTION_CREATE` - Crear acción rápida
- `TRACKER_QUICK_ACTION_DELETE` - Eliminar acción rápida

#### Macros

- `MACRO_TARGET_UPSERT` - Crear/actualizar objetivo de macros
- `MACRO_TARGET_UPDATE` - Actualizar objetivo
- `MACRO_ENTRY_CREATE` - Crear entrada de macro
- `MACRO_ENTRY_UPDATE` - Actualizar entrada
- `MACRO_ENTRY_DELETE` - Eliminar entrada
- `MACRO_QUICK_ACTIONS_INIT` - Inicializar acciones rápidas de macros
- `MACRO_QUICK_ACTION_CREATE` - Crear acción rápida de macro
- `MACRO_QUICK_ACTION_DELETE` - Eliminar acción rápida de macro

### Estados del Sync

| Estado        | Descripción                 |
| ------------- | --------------------------- |
| 🟢 Online     | Sync directo a Supabase     |
| 📴 Offline    | Se encola en SQLite local   |
| 🔄 Processing | Procesando queue pendiente  |
| ⏸️ Backoff    | Esperando después de fallos |

### Exponential Backoff

| Retry | Delay Base          |
| ----- | ------------------- |
| 1     | +1 segundo          |
| 2     | +2 segundos         |
| 3     | +4 segundos         |
| 4     | +8 segundos         |
| 5     | +16 segundos        |
| 6+    | Intervención manual |

---

## Internacionalización

### Idiomas Soportados

| Código | Idioma  | Bandera |
| ------ | ------- | ------- |
| `es`   | Español | 🇦🇷      |
| `en`   | English | 🇺🇸      |

### Archivos de Traducciones

Ubicados en `shared/translations/`:

- `active-workout.ts` - Workout activo
- `analytics.ts` - Analytics/Dashboard
- `auth.ts` - Autenticación
- `exercise-filters.ts` - Filtros de ejercicios
- `exercise-labels.ts` - Labels de ejercicios
- `exercise-selector.ts` - Selector de ejercicios
- `folder-form.ts` - Formulario de carpetas
- `measurement-templates.ts` - Templates de medición
- `metric-form.ts` - Formulario de métricas
- `personal-data.ts` - Datos personales
- `pr-detail.ts` - Detalle de PR
- `pr-list.ts` - Lista de PRs
- `profile.ts` - Perfil
- `routine-form.ts` - Formulario de rutinas
- `routine-settings.ts` - Configuración de rutinas
- `rpe-selector.ts` - Selector de RPE
- `set-type.ts` - Tipos de set
- `tempo-selector.ts` - Selector de tempo
- `tracker.ts` - Tracker
- `training-methods.ts` - Métodos de entrenamiento
- `workout-session-detail.ts` - Detalle de sesión
- `workout-session-list.ts` - Lista de sesiones
- `workout-summary.ts` - Resumen de workout
- `workouts.ts` - Workouts/Rutinas

---

## Apéndices

### A. Templates de Rutinas

El sistema soporta creación de rutinas desde templates predefinidos:

**Categorías:**

- `strength` - Fuerza
- `hypertrophy` - Hipertrofia
- `endurance` - Resistencia

**Dificultades:**

- `beginner` - Principiante
- `intermediate` - Intermedio
- `advanced` - Avanzado

**Distribuciones:**

- `full-body` - Cuerpo completo
- `upper-lower` - Superior/Inferior
- `push-pull-legs` - Push/Pull/Piernas
- `bro-split` - Split tradicional
- `powerlifting` - Powerlifting

### B. Estructura de Carpetas del Proyecto

```
myosin/
├── app/                      # Expo Router - Navegación
│   ├── (authenticated)/      # Rutas autenticadas
│   ├── auth/                 # Autenticación
│   └── onboarding/           # Onboarding
├── features/                 # Feature-based architecture
│   ├── active-workout-v2/    # Workout en progreso
│   ├── analytics-v2/         # Dashboard y estadísticas
│   ├── folder-form-v2/       # Gestión de carpetas
│   ├── onboarding/           # Flujo de onboarding
│   ├── pr-detail-v2/         # Detalle de PR
│   ├── pr-list-v2/           # Lista de PRs
│   ├── profile-v2/           # Perfil de usuario
│   ├── routine-form-v2/      # Creación/edición de rutinas
│   ├── routine-templates/    # Templates predefinidos
│   ├── tracker-v2/           # Métricas personalizadas
│   ├── workout-session-*/    # Historial de sesiones
│   └── workouts-v2/          # Lista de rutinas
├── shared/                   # Código compartido
│   ├── db/                   # Base de datos
│   │   ├── schema/           # Schemas Drizzle
│   │   └── repository/       # Data access layer
│   ├── sync/                 # Sistema de sincronización
│   ├── translations/         # Archivos i18n
│   ├── ui/                   # Componentes UI
│   ├── hooks/                # Custom hooks
│   └── providers/            # Context providers
├── exercises/                # SQLs de ejercicios
└── assets/                   # Recursos estáticos
```

---

> **Última actualización:** Diciembre 2025
>
> Este documento es una referencia viva y debe actualizarse con cada nueva feature o cambio significativo en el producto.

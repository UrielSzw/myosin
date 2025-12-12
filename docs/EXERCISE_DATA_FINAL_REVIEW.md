# 🔬 Análisis Final: Estructura de Exercises, Equipment y Muscles

> **Objetivo**: Definir la estructura definitiva antes de crear la data real y comprar assets
>
> **Fecha**: Diciembre 2024

---

## 📊 Estado Actual - Resumen

### Lo Que Tenemos ✅

| Componente            | Estado                 | Comentario                              |
| --------------------- | ---------------------- | --------------------------------------- |
| Schema de `exercises` | ✅ Sólido              | 14 campos bien pensados                 |
| `IExerciseMuscle`     | ✅ Completo            | 31 grupos musculares                    |
| `IExerciseEquipment`  | ⚠️ Casi completo       | Faltan algunos, sobran otros            |
| Measurement Templates | ✅ Excelente           | 7 templates cubren 99% casos            |
| Progressions System   | ✅ Único en el mercado | Skill trees completos                   |
| Set Types             | ✅ Superior            | 10 tipos (más que cualquier competidor) |

---

## 🔴 CAMBIOS RECOMENDADOS ANTES DE LA DATA REAL

### 1. Equipment - Ajustes Necesarios

#### ❌ REMOVER (no son equipamiento, son modificadores):

```typescript
// Estos NO deberían ser equipment porque:
// - "weight_plate" = es un disco, no una máquina/estación
// - Los discos se usan CON otros equipos (barbell, leg press)

"weight_plate"; // ❌ Remover - es complemento, no equipo principal
```

#### ➕ AGREGAR:

```typescript
// Equipamiento de gimnasio que falta:
"hack_squat"; // Máquina de hack squat
"pendulum_squat"; // Pendulum squat machine
"belt_squat"; // Belt squat machine
"glute_ham_developer"; // GHD
"reverse_hyper"; // Reverse hyperextension
"sissy_squat_bench"; // Sissy squat bench
"calf_raise_machine"; // Máquina de pantorrillas
"hip_thrust_bench"; // Banco de hip thrust

// Equipamiento de calistenia que falta:
"gymnastics_rings"; // Anillas
"weight_vest"; // Chaleco con peso
"weight_belt"; // Cinturón para cargar peso (pull-ups lastradas)
"parallettes"; // Parallettes para L-sit, planche

// Accesorios importantes:
"trap_bar"; // Barra trampa / hex bar
"safety_squat_bar"; // SSB
"landmine"; // Landmine attachment
"ankle_weights"; // Tobilleras con peso
"wrist_weights"; // Muñequeras con peso
"bosu_ball"; // BOSU
"jump_rope"; // Cuerda de saltar
"battle_ropes"; // Cuerdas de batalla
"sled"; // Trineo de empuje
"rowing_machine"; // Remo ergométrico
"assault_bike"; // Assault bike / air bike
"treadmill"; // Cinta de correr
"stair_climber"; // Escaladora
```

#### 📝 EQUIPMENT FINAL PROPUESTO:

```typescript
export type IExerciseEquipment =
  // ===== FREE WEIGHTS =====
  | "barbell" // Barra olímpica estándar
  | "ez_curl_bar" // Barra EZ
  | "trap_bar" // Barra trampa / hex bar
  | "safety_squat_bar" // SSB
  | "dumbbell" // Mancuernas
  | "kettlebell" // Pesas rusas

  // ===== MACHINES - UPPER =====
  | "cable_machine" // Poleas
  | "smith_machine" // Smith machine
  | "lat_pulldown" // Jalón al pecho
  | "seated_row_machine" // Remo sentado máquina
  | "chest_press_machine" // Press de pecho máquina
  | "shoulder_press_machine" // Press de hombros máquina
  | "pec_deck" // Aperturas en máquina (contractor)

  // ===== MACHINES - LOWER =====
  | "leg_press" // Prensa de piernas
  | "hack_squat" // Hack squat
  | "pendulum_squat" // Pendulum squat
  | "belt_squat" // Belt squat
  | "leg_curl_machine" // Curl femoral
  | "leg_extension_machine" // Extensión de cuádriceps
  | "hip_abductor_machine" // Abductor
  | "hip_adductor_machine" // Aductor
  | "calf_raise_machine" // Máquina de gemelos
  | "glute_ham_developer" // GHD
  | "reverse_hyper" // Reverse hyper

  // ===== BENCHES =====
  | "flat_bench" // Banco plano
  | "incline_bench" // Banco inclinado
  | "decline_bench" // Banco declinado
  | "adjustable_bench" // Banco ajustable
  | "preacher_bench" // Banco Scott
  | "hip_thrust_bench" // Banco para hip thrust
  | "sissy_squat_bench" // Sissy squat

  // ===== BODYWEIGHT / CALISTHENICS =====
  | "bodyweight" // Sin equipamiento
  | "pull_up_bar" // Barra de dominadas
  | "dip_station" // Estación de fondos
  | "parallel_bars" // Barras paralelas
  | "gymnastics_rings" // Anillas
  | "parallettes" // Parallettes

  // ===== ACCESSORIES - RESISTANCE =====
  | "resistance_band" // Bandas elásticas
  | "suspension_trainer" // TRX / similar
  | "cable_attachment" // Accesorios de polea (cuerda, barra, etc)

  // ===== ACCESSORIES - WEIGHTED =====
  | "weight_vest" // Chaleco con peso
  | "weight_belt" // Cinturón para carga
  | "ankle_weights" // Tobilleras

  // ===== ACCESSORIES - CORE/STABILITY =====
  | "medicine_ball" // Balón medicinal
  | "stability_ball" // Fitball
  | "bosu_ball" // BOSU
  | "ab_wheel" // Rueda abdominal
  | "foam_roller" // Foam roller

  // ===== ATTACHMENTS =====
  | "landmine" // Landmine

  // ===== CARDIO =====
  | "rowing_machine" // Remo ergométrico
  | "assault_bike" // Air bike
  | "treadmill" // Cinta
  | "jump_rope" // Cuerda
  | "battle_ropes" // Cuerdas de batalla
  | "sled" // Trineo
  | "stair_climber" // Escaladora

  // ===== OTHER =====
  | "other"; // Otro / personalizado
```

**Total: ~50 tipos de equipamiento** (vs 30 actuales)

---

### 2. Muscles - Revisión

El sistema actual de 31 músculos es **muy bueno** pero hay algunas consideraciones:

#### ⚠️ POSIBLES AJUSTES:

```typescript
// ACTUAL                  | SUGERENCIA
// ------------------------|---------------------------
"erector_spinae"; // OK - erectores espinales
"lower_back"; // ⚠️ ¿Redundante con erector_spinae?

// PROPUESTA: Unificar en uno solo
// lower_back = erector_spinae + cuadrado lumbar
// Simplifica sin perder precisión para el usuario promedio
```

#### ❌ NO AGREGAR (demasiado específico):

```typescript
// Estos son demasiado específicos para una app de fitness:
"brachialis"; // Parte del biceps para el usuario
"brachioradialis"; // Parte de forearms
"teres_major"; // Parte de lats
"infraspinatus"; // Parte de rotator_cuff
```

#### ✅ MANTENER COMO ESTÁ:

El nivel actual de detalle (31 grupos) es el **sweet spot**:

- Más detallado que Strong/Hevy (10-15 grupos)
- Menos que una app de anatomía médica
- Permite filtros útiles sin abrumar

---

### 3. Categorización de Ejercicios - Nueva Propuesta

Actualmente solo tenemos `exercise_type: compound | isolation`.

#### ➕ AGREGAR: Movement Pattern (Patrón de Movimiento)

```typescript
export type IMovementPattern =
  // PUSH
  | "horizontal_push" // Press banca, push-ups
  | "vertical_push" // Press militar, HSPU
  | "push_accessory" // Extensiones tríceps, aperturas

  // PULL
  | "horizontal_pull" // Remos
  | "vertical_pull" // Dominadas, jalones
  | "pull_accessory" // Curls, face pulls

  // LOWER
  | "squat" // Sentadillas, prensa
  | "hinge" // Peso muerto, RDL, hip thrust
  | "lunge" // Zancadas, Bulgarian split
  | "leg_accessory" // Extensiones, curls

  // CORE
  | "core_flexion" // Crunches, leg raises
  | "core_anti_rotation" // Pallof press, plancha
  | "core_rotation" // Russian twist, wood chops

  // CARRY
  | "loaded_carry" // Farmer's walk, suitcase carry

  // CARDIO
  | "steady_state" // Trote, bici constante
  | "intervals" // HIIT, sprints

  // SKILL
  | "skill_balance" // Handstand, pistol squat
  | "skill_power" // Muscle-up, plyo push-ups

  // OTHER
  | "mobility" // Stretches, movilidad
  | "other";
```

**¿Por qué agregar esto?**

1. Permite filtrar por "dame ejercicios de push"
2. Ayuda a balancear rutinas automáticamente
3. Mejora las sugerencias de ejercicios similares
4. Es el estándar en programación moderna (push/pull/legs)

---

### 4. Campos Adicionales Opcionales

#### ✅ AGREGAR AL SCHEMA:

```typescript
exercises: {
  // ... campos existentes ...

  // NUEVO: Patrón de movimiento
  movement_pattern: text("movement_pattern")
    .$type<IMovementPattern>()
    .notNull(),

  // NUEVO: Nivel de dificultad (1-5)
  difficulty_level: integer("difficulty_level")
    .default(3), // 1=principiante, 5=avanzado

  // NUEVO: Es ejercicio unilateral?
  is_unilateral: integer("is_unilateral", { mode: "boolean" })
    .default(false),

  // NUEVO: Requiere spotter?
  requires_spotter: integer("requires_spotter", { mode: "boolean" })
    .default(false),

  // NUEVO: Mecánica de la resistencia
  force_type: text("force_type")
    .$type<"push" | "pull" | "static" | "dynamic">(),
}
```

---

### 5. Sistema de Variantes

Actualmente `similar_exercises` es un array plano. Propuesta de mejora:

#### OPCIÓN A: Mantener simple (RECOMENDADO)

```typescript
// Dejar similar_exercises como está
// Usar el sistema de progressions para relaciones complejas
similar_exercises: ["uuid-1", "uuid-2"]; // Ejercicios intercambiables
```

#### OPCIÓN B: Enriquecer (más complejo)

```typescript
// Si quisiéramos más metadata:
exercise_variants: {
  exercise_id: string,
  variant_id: string,
  variant_type: "easier" | "harder" | "same_level" | "equipment_swap",
  notes?: string
}
```

**Recomendación**: Opción A. El sistema de progressions ya maneja las relaciones complejas.

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Ajustes de Schema (ANTES de data)

- [ ] Actualizar `IExerciseEquipment` type con nuevos equipos
- [ ] Agregar campo `movement_pattern` al schema
- [ ] Agregar campo `difficulty_level` al schema
- [ ] Agregar campo `is_unilateral` al schema
- [ ] Agregar `weight_belt` y `weight_vest` a equipment (para calistenia lastrada)

### Fase 2: Traducciones de Equipment

- [ ] Crear archivo de traducciones para todos los equipos
- [ ] Traducir al español e inglés

### Fase 3: Data de Ejercicios

- [ ] Definir lista final de ejercicios por músculo
- [ ] Crear SQLs de migración con todos los campos
- [ ] Crear traducciones ES/EN

### Fase 4: Assets

- [ ] Comprar/crear GIFs para cada ejercicio
- [ ] Formato consistente (tamaño, duración, loop)
- [ ] Naming convention: `{exercise-id}.gif`

---

## 🎯 RECOMENDACIÓN FINAL

### Prioridad ALTA (hacer ahora):

1. ✅ Agregar `movement_pattern` al schema
2. ✅ Expandir `IExerciseEquipment`
3. ✅ Agregar `difficulty_level`
4. ✅ Agregar `is_unilateral`

### Prioridad MEDIA (nice to have):

1. Agregar `requires_spotter`
2. Agregar `force_type`
3. Crear UI para ejercicios personalizados

### NO hacer ahora:

1. No cambiar muscles (está bien)
2. No complicar similar_exercises
3. No agregar video (GIF es suficiente por ahora)

---

## 📊 Comparativa con Competencia

| Feature               | Myosin (propuesto) | Strong | Hevy | JEFIT |
| --------------------- | ------------------ | ------ | ---- | ----- |
| Grupos musculares     | 31                 | ~15    | ~15  | ~20   |
| Equipamiento          | ~50                | ~20    | ~25  | ~30   |
| Movement patterns     | ✅ 18 tipos        | ❌     | ❌   | ❌    |
| Difficulty levels     | ✅ 1-5             | ❌     | ❌   | 🟡    |
| Measurement templates | 7                  | 2      | 2    | 3     |
| Set types             | 10                 | 4      | 5    | 4     |
| Progressions          | ✅ Skill trees     | ❌     | ❌   | ❌    |
| Unilateral flag       | ✅                 | ❌     | ❌   | ❌    |

**Myosin sería la app con el sistema de ejercicios más completo del mercado.**

---

## ❓ PREGUNTAS PARA DECIDIR

1. **¿Querés agregar `movement_pattern`?**

   - Pro: Mejor categorización, rutinas auto-balanceadas
   - Con: Un campo más que llenar por ejercicio

2. **¿Querés agregar `difficulty_level` (1-5)?**

   - Pro: Filtros por nivel, mejor onboarding
   - Con: Subjetivo (5 para uno es 3 para otro)

3. **¿Cuántos ejercicios vas a crear inicialmente?**

   - Recomiendo: ~200-300 ejercicios core bien hechos
   - Luego agregar más basado en demanda

4. **¿Formato de GIFs?**
   - Recomiendo: 400x400px, 2-3 segundos loop, <500KB cada uno

---

_¿Querés que implemente alguno de estos cambios al schema?_

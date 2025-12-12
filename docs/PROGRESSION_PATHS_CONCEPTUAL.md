# Progression Paths - Diseño Conceptual

## Resumen

Este documento mapea las progresiones estándar de calistenia (basadas en r/bodyweightfitness Recommended Routine) con los ejercicios existentes en nuestra base de datos. El objetivo es identificar qué paths podemos crear, qué ejercicios necesitamos agregar, y cómo estructurar el sistema.

---

## Estándares BWF de Progresión

### Criterios de Avance

- **Ejercicios dinámicos**: Avanzar cuando logres **3×8 reps** con buena forma
- **Isométricos**: Avanzar cuando logres **3×30 segundos**
- **Maestría completa**: 3×12 reps o 3×60 segundos

---

## 1. VERTICAL PULL PATH (Pull-ups)

### Progresión BWF Estándar

```
1. Scapular Pulls (retracción escapular colgando)
2. Arch Hangs (colgarse arqueando)
3. Negative Pull-ups (fase excéntrica lenta)
4. Pull-ups (dominadas estándar)
5. Weighted Pull-ups (con lastre)
```

### Variaciones Avanzadas (branches)

```
Pull-ups → L-sit Pull-ups → Archer Pull-ups → Typewriter Pull-ups → One Arm Pull-up
```

### Mapping con Ejercicios Existentes

| Paso BWF          | ¿Tenemos? | Ejercicio en DB               | UUID                                   |
| ----------------- | --------- | ----------------------------- | -------------------------------------- |
| Scapular Pulls    | ❌ NO     | -                             | -                                      |
| Arch Hangs        | ❌ NO     | -                             | -                                      |
| Negative Pull-ups | ❌ NO     | -                             | -                                      |
| Pull-ups          | ✅ SÍ     | Dominadas (Pull-ups)          | `40000000-0001-0000-0000-000000000001` |
| Assisted Pull-ups | ✅ SÍ     | Dominadas asistidas (máquina) | `40000000-0001-0000-0000-000000000002` |
| Lat Pulldown      | ✅ SÍ     | Jalón al pecho                | `40000000-0001-0000-0000-000000000003` |
| L-sit Pull-ups    | ❌ NO     | -                             | -                                      |
| Archer Pull-ups   | ❌ NO     | -                             | -                                      |
| Weighted Pull-ups | ❌ NO     | -                             | -                                      |

### Ejercicios a AGREGAR para este path

1. **Scapular Pulls** (dead hang + retracción) - beginner
2. **Arch Hangs** (dead hang arqueado) - beginner
3. **Negative Pull-ups** (solo bajada lenta) - beginner
4. **Weighted Pull-ups** (con cinturón/chaleco) - advanced
5. **L-sit Pull-ups** (mantener L mientras subes) - advanced
6. **Archer Pull-ups** (un brazo más que otro) - expert
7. **One Arm Pull-up** (meta final) - expert

---

## 2. HORIZONTAL PULL PATH (Rows)

### Progresión BWF Estándar

```
1. Vertical Rows (cuerpo casi vertical, muy fácil)
2. Incline Rows (cuerpo a ~45°)
3. Horizontal Rows (cuerpo paralelo al suelo)
4. Wide Rows (agarre ancho)
5. Weighted Rows (con chaleco)
```

### Variaciones Avanzadas (branch hacia Front Lever)

```
Horizontal Rows → Tuck Front Lever Rows → Advanced Tuck FL Rows → Straddle FL → Full Front Lever
```

### Mapping con Ejercicios Existentes

| Paso BWF     | ¿Tenemos? | Ejercicio en DB               | UUID                                   |
| ------------ | --------- | ----------------------------- | -------------------------------------- |
| Inverted Row | ✅ SÍ     | Remo invertido (Inverted Row) | `40000000-0001-0000-0000-000000000018` |
| Barbell Row  | ✅ SÍ     | Remo con barra                | `40000000-0001-0000-0000-000000000005` |
| Cable Row    | ✅ SÍ     | Remo en polea baja            | `40000000-0001-0000-0000-000000000008` |
| Incline Row  | ❌ NO     | -                             | -                                      |
| Wide Row     | ❌ NO     | -                             | -                                      |
| Tuck FL Row  | ❌ NO     | -                             | -                                      |
| Front Lever  | ❌ NO     | -                             | -                                      |

### Ejercicios a AGREGAR para este path

1. **Incline Inverted Row** (cuerpo inclinado) - beginner
2. **Wide Grip Inverted Row** - intermediate
3. **Archer Row** (un brazo) - intermediate
4. **Tuck Front Lever** (isométrico) - advanced
5. **Tuck Front Lever Rows** (dinámico) - advanced
6. **Advanced Tuck Front Lever** - advanced
7. **Straddle Front Lever** - expert
8. **Full Front Lever** - expert

---

## 3. VERTICAL PUSH PATH (Dips/Overhead)

### Progresión BWF Estándar - Dips

```
1. Parallel Bar Support Hold (sostener arriba)
2. Negative Dips (solo bajada lenta)
3. Parallel Bar Dips (fondos completos)
4. Weighted Dips (con lastre)
```

### Branch hacia HSPU

```
Pike Push-ups → Elevated Pike Push-ups → Wall Handstand → Negative HSPU → HSPU
```

### Mapping con Ejercicios Existentes

| Paso BWF                    | ¿Tenemos? | Ejercicio en DB                       | UUID                                   |
| --------------------------- | --------- | ------------------------------------- | -------------------------------------- |
| Support Hold                | ❌ NO     | -                                     | -                                      |
| Negative Dips               | ❌ NO     | -                                     | -                                      |
| Parallel Bar Dips (triceps) | ✅ SÍ     | Fondos en paralelas (Dips)            | `30000000-0001-0000-0000-000000000005` |
| Parallel Bar Dips (chest)   | ✅ SÍ     | Fondos en paralelas (Dips para pecho) | `10000000-0001-0000-0000-000000000015` |
| Assisted Dips               | ✅ SÍ     | Fondos en máquina asistida            | `30000000-0001-0000-0000-000000000006` |
| Pike Push-ups               | ❌ NO     | -                                     | -                                      |
| Wall Handstand              | ❌ NO     | -                                     | -                                      |
| HSPU                        | ❌ NO     | -                                     | -                                      |

### Ejercicios a AGREGAR para este path

1. **Parallel Bar Support Hold** (sostener arriba) - beginner
2. **Negative Dips** (bajada lenta 5s) - beginner
3. **Ring Dips** - intermediate
4. **Weighted Dips** - advanced
5. **Pike Push-ups** - beginner
6. **Elevated Pike Push-ups** - intermediate
7. **Wall Handstand** (isométrico) - intermediate
8. **Handstand Negative** - intermediate
9. **Wall HSPU** - advanced
10. **Freestanding HSPU** - expert

---

## 4. HORIZONTAL PUSH PATH (Push-ups)

### Progresión BWF Estándar

```
1. Wall Push-ups (contra pared)
2. Incline Push-ups (manos elevadas)
3. Push-ups (estándar)
4. Diamond Push-ups (manos juntas)
5. Pseudo Planche Push-ups (PPPU)
```

### Branch hacia Planche

```
PPPU → Tuck Planche → Advanced Tuck → Straddle Planche → Full Planche
```

### Mapping con Ejercicios Existentes

| Paso BWF         | ¿Tenemos? | Ejercicio en DB                       | UUID                                   |
| ---------------- | --------- | ------------------------------------- | -------------------------------------- |
| Wall Push-ups    | ❌ NO     | -                                     | -                                      |
| Incline Push-ups | ✅ SÍ     | Flexiones inclinadas (manos elevadas) | `10000000-0001-0000-0000-000000000013` |
| Push-ups         | ✅ SÍ     | Flexiones (Push-ups)                  | `10000000-0001-0000-0000-000000000012` |
| Decline Push-ups | ✅ SÍ     | Flexiones declinadas (pies elevados)  | `10000000-0001-0000-0000-000000000014` |
| Diamond Push-ups | ❌ NO     | -                                     | -                                      |
| PPPU             | ❌ NO     | -                                     | -                                      |
| Planche          | ❌ NO     | -                                     | -                                      |

### Ejercicios a AGREGAR para este path

1. **Wall Push-ups** - beginner
2. **Knee Push-ups** - beginner
3. **Diamond Push-ups** - intermediate
4. **Archer Push-ups** - intermediate
5. **Pseudo Planche Push-ups (PPPU)** - advanced
6. **Ring Push-ups** - intermediate
7. **RTO Push-ups** (rings turned out) - advanced
8. **Tuck Planche** (isométrico) - advanced
9. **Advanced Tuck Planche** - expert
10. **Straddle Planche** - expert
11. **Full Planche** - master

---

## 5. SQUAT PATH

### Progresión BWF Estándar

```
1. Assisted Squat (con soporte)
2. Squat (sentadilla profunda)
3. Split Squat (zancada estática)
4. Bulgarian Split Squat (pie trasero elevado)
5. Beginner Shrimp Squat (con soporte)
6. Intermediate Shrimp (sin soporte)
7. Advanced Shrimp (pie al glúteo)
```

### Branch alternativo - Pistol Squat

```
Box Pistol → Assisted Pistol → Pistol Squat → Weighted Pistol
```

### Mapping con Ejercicios Existentes

| Paso BWF              | ¿Tenemos? | Ejercicio en DB         | UUID                                   |
| --------------------- | --------- | ----------------------- | -------------------------------------- |
| Barbell Squat         | ✅ SÍ     | Sentadilla con barra    | `70000000-0001-0000-0000-000000000001` |
| Front Squat           | ✅ SÍ     | Sentadilla frontal      | `70000000-0001-0000-0000-000000000002` |
| Lunges (DB)           | ✅ SÍ     | Zancadas con mancuernas | `70000000-0001-0000-0000-000000000007` |
| Lunges (BB)           | ✅ SÍ     | Zancadas con barra      | `70000000-0001-0000-0000-000000000008` |
| Bulgarian Split Squat | ✅ SÍ     | Sentadilla búlgara      | `70000000-0001-0000-0000-000000000009` |
| Bodyweight Squat      | ❌ NO     | -                       | -                                      |
| Split Squat (static)  | ❌ NO     | -                       | -                                      |
| Shrimp Squat          | ❌ NO     | -                       | -                                      |
| Pistol Squat          | ❌ NO     | -                       | -                                      |

### Ejercicios a AGREGAR para este path

1. **Bodyweight Squat** (sin barra) - beginner
2. **Assisted Squat** (con TRX/soporte) - beginner
3. **Split Squat** (zancada estática) - beginner
4. **Box Pistol Squat** (sentarse a caja) - intermediate
5. **Assisted Pistol Squat** (con TRX) - intermediate
6. **Pistol Squat** - advanced
7. **Beginner Shrimp Squat** (mano al pie) - intermediate
8. **Intermediate Shrimp Squat** - advanced
9. **Advanced Shrimp Squat** (pie al glúteo) - advanced
10. **Weighted Pistol Squat** - expert

---

## 6. HINGE PATH

### Progresión BWF Estándar

```
1. Romanian Deadlift (peso muerto rumano)
2. Single Leg Romanian DL (a una pierna)
3. Banded Nordic Curl Negatives
4. Banded Nordic Curl (completo)
5. Nordic Curl (sin banda)
```

### Mapping con Ejercicios Existentes

| Paso BWF         | ¿Tenemos? | Ejercicio en DB                   | UUID                                   |
| ---------------- | --------- | --------------------------------- | -------------------------------------- |
| Romanian DL (BB) | ✅ SÍ     | Peso muerto rumano                | `70000000-0001-0000-0000-000000000010` |
| Romanian DL (DB) | ✅ SÍ     | Peso muerto rumano con mancuernas | `70000000-0001-0000-0000-000000000011` |
| Single Leg RDL   | ✅ SÍ     | Peso muerto rumano a una pierna   | `70000000-0001-0000-0000-000000000012` |
| Lying Leg Curl   | ✅ SÍ     | Curl femoral acostado             | `70000000-0001-0000-0000-000000000013` |
| Seated Leg Curl  | ✅ SÍ     | Curl femoral sentado              | `70000000-0001-0000-0000-000000000014` |
| Nordic Curl      | ❌ NO     | -                                 | -                                      |
| Glute Bridge     | ✅ SÍ     | Puente de glúteos                 | `70000000-0001-0000-0000-000000000018` |
| Hip Thrust       | ✅ SÍ     | Hip Thrust con barra              | `70000000-0001-0000-0000-000000000016` |

### Ejercicios a AGREGAR para este path

1. **Bodyweight Romanian DL** (sin peso) - beginner
2. **Banded Nordic Curl Negatives** - intermediate
3. **Banded Nordic Curl** - intermediate
4. **Nordic Curl** - advanced
5. **Harop Curl** (variación) - advanced

---

## 7. CORE PATHS

### 7a. Anti-Extension Path (Abs)

```
1. Plank → 2. Plank + Weight → 3. Ab Wheel (knees) → 4. Ab Wheel (standing) → 5. Dragon Flag
```

### Mapping Anti-Extension

| Paso              | ¿Tenemos? | Ejercicio en DB              | UUID                                   |
| ----------------- | --------- | ---------------------------- | -------------------------------------- |
| Plank             | ✅ SÍ     | Plancha frontal              | `60000000-0001-0000-0000-000000000007` |
| Weighted Plank    | ✅ SÍ     | Plancha con peso             | `60000000-0001-0000-0000-000000000008` |
| Ab Wheel          | ✅ SÍ     | Ab wheel rollout             | `60000000-0001-0000-0000-000000000009` |
| Hanging Leg Raise | ✅ SÍ     | Elevación de piernas colgado | `60000000-0001-0000-0000-000000000004` |
| Dragon Flag       | ❌ NO     | -                            | -                                      |

### 7b. Anti-Rotation Path

```
1. Pallof Press (isométrico) → 2. Pallof Press (dinámico) → 3. Copenhagen Plank
```

### Mapping Anti-Rotation

| Paso             | ¿Tenemos? | Ejercicio en DB | UUID                                   |
| ---------------- | --------- | --------------- | -------------------------------------- |
| Pallof Press     | ❌ NO     | -               | -                                      |
| Copenhagen Plank | ❌ NO     | -               | -                                      |
| Russian Twist    | ✅ SÍ     | Russian twist   | `60000000-0001-0000-0000-000000000012` |
| Side Plank       | ✅ SÍ     | Plancha lateral | `60000000-0001-0000-0000-000000000014` |

### 7c. Extension Path (Lower Back)

```
1. Reverse Hyperextension → 2. Arch Raises → 3. Arch Hold → 4. Back Extensions
```

### Mapping Extension

| Paso                     | ¿Tenemos? | Ejercicio en DB           | UUID                                   |
| ------------------------ | --------- | ------------------------- | -------------------------------------- |
| Hyperextensions          | ✅ SÍ     | Hiperextensiones          | `60000000-0001-0000-0000-000000000016` |
| Weighted Hyperextensions | ✅ SÍ     | Hiperextensiones con peso | `60000000-0001-0000-0000-000000000017` |
| Superman                 | ✅ SÍ     | Superman                  | `60000000-0001-0000-0000-000000000018` |
| Reverse Hyper            | ❌ NO     | -                         | -                                      |

### 7d. L-Sit Path (Skill)

```
1. Foot Supported L-sit → 2. One-Leg L-sit → 3. Tuck L-sit → 4. Advanced Tuck L-sit → 5. Full L-sit → 6. V-sit
```

### Ejercicios a AGREGAR para Core Paths

1. **Dragon Flag Progression** (tuck → full) - advanced
2. **Pallof Press** - beginner
3. **Copenhagen Plank** - intermediate
4. **Reverse Hyperextension** - beginner
5. **Arch Hold** - beginner
6. **Foot Supported L-sit** - beginner
7. **Tuck L-sit** - intermediate
8. **L-sit** - advanced
9. **V-sit** - expert

---

## 8. SKILL PATHS

### 8a. Muscle-up Path

```
Pull-up (3×10) + Dip (3×10) → High Pull-ups → Jumping Muscle-up → Negative Muscle-up → Muscle-up
```

### 8b. Back Lever Path

```
German Hang → Tuck Back Lever → Advanced Tuck BL → Straddle BL → Full Back Lever
```

### 8c. Human Flag Path

```
Vertical Flag Hold → Tuck Flag → Straddle Flag → Full Human Flag
```

### Ejercicios a AGREGAR para Skills

1. **High Pull-ups** - intermediate
2. **Jumping Muscle-up** - intermediate
3. **Muscle-up** - advanced
4. **German Hang** - beginner
5. **Tuck Back Lever** - intermediate
6. **Back Lever** - advanced
7. **Vertical Flag Hold** - intermediate
8. **Human Flag** - expert

---

## Ejercicios Existentes Relevantes para Progressions

### REFERENCIA RÁPIDA DE UUIDs

#### Vertical Pull

| Ejercicio                     | UUID                                   | Difficulty |
| ----------------------------- | -------------------------------------- | ---------- |
| Dominadas (Pull-ups)          | `40000000-0001-0000-0000-000000000001` | 3          |
| Dominadas asistidas (máquina) | `40000000-0001-0000-0000-000000000002` | 1          |
| Jalón al pecho (Lat Pulldown) | `40000000-0001-0000-0000-000000000003` | 2          |

#### Horizontal Pull

| Ejercicio                      | UUID                                   | Difficulty |
| ------------------------------ | -------------------------------------- | ---------- |
| Remo invertido (Inverted Row)  | `40000000-0001-0000-0000-000000000018` | 2          |
| Remo con barra                 | `40000000-0001-0000-0000-000000000005` | 3          |
| Remo en polea baja (Cable Row) | `40000000-0001-0000-0000-000000000008` | 2          |

#### Vertical Push (Dips/Overhead)

| Ejercicio                            | UUID                                   | Difficulty |
| ------------------------------------ | -------------------------------------- | ---------- |
| Fondos en paralelas (Dips - triceps) | `30000000-0001-0000-0000-000000000005` | 3          |
| Fondos en paralelas (Dips - chest)   | `10000000-0001-0000-0000-000000000015` | 3          |
| Fondos en máquina asistida           | `30000000-0001-0000-0000-000000000006` | 1          |

#### Horizontal Push (Push-ups)

| Ejercicio                             | UUID                                   | Difficulty |
| ------------------------------------- | -------------------------------------- | ---------- |
| Flexiones (Push-ups)                  | `10000000-0001-0000-0000-000000000012` | 2          |
| Flexiones inclinadas (manos elevadas) | `10000000-0001-0000-0000-000000000013` | 1          |
| Flexiones declinadas (pies elevados)  | `10000000-0001-0000-0000-000000000014` | 3          |

#### Squat

| Ejercicio               | UUID                                   | Difficulty |
| ----------------------- | -------------------------------------- | ---------- |
| Sentadilla con barra    | `70000000-0001-0000-0000-000000000001` | 3          |
| Sentadilla frontal      | `70000000-0001-0000-0000-000000000002` | 4          |
| Sentadilla búlgara      | `70000000-0001-0000-0000-000000000009` | 3          |
| Zancadas con mancuernas | `70000000-0001-0000-0000-000000000007` | 2          |

#### Hinge

| Ejercicio                         | UUID                                   | Difficulty |
| --------------------------------- | -------------------------------------- | ---------- |
| Peso muerto rumano                | `70000000-0001-0000-0000-000000000010` | 3          |
| Peso muerto rumano con mancuernas | `70000000-0001-0000-0000-000000000011` | 2          |
| Peso muerto rumano a una pierna   | `70000000-0001-0000-0000-000000000012` | 3          |
| Puente de glúteos                 | `70000000-0001-0000-0000-000000000018` | 1          |
| Hip Thrust con barra              | `70000000-0001-0000-0000-000000000016` | 2          |

#### Core

| Ejercicio                    | UUID                                   | Difficulty | Template    |
| ---------------------------- | -------------------------------------- | ---------- | ----------- |
| Plancha frontal              | `60000000-0001-0000-0000-000000000007` | 2          | time_only   |
| Plancha con peso             | `60000000-0001-0000-0000-000000000008` | 3          | weight_time |
| Ab wheel rollout             | `60000000-0001-0000-0000-000000000009` | 4          | weight_reps |
| Plancha lateral              | `60000000-0001-0000-0000-000000000014` | 2          | time_only   |
| Elevación de piernas colgado | `60000000-0001-0000-0000-000000000004` | 3          | weight_reps |
| Hiperextensiones             | `60000000-0001-0000-0000-000000000016` | 2          | weight_reps |
| Superman                     | `60000000-0001-0000-0000-000000000018` | 1          | weight_reps |

---

## Resumen de Ejercicios a Agregar

### Por Categoría

| Categoría         | Ejercicios Nuevos | Prioridad |
| ----------------- | ----------------- | --------- |
| Pull (Vertical)   | 7                 | ALTA      |
| Pull (Horizontal) | 8                 | ALTA      |
| Push (Vertical)   | 10                | ALTA      |
| Push (Horizontal) | 11                | ALTA      |
| Squat             | 10                | MEDIA     |
| Hinge             | 5                 | MEDIA     |
| Core              | 9                 | MEDIA     |
| Skills            | 8                 | BAJA      |

### Total: ~68 ejercicios nuevos

---

## Propuesta de Paths Finales

### Paths Principales (FASE 1)

1. **pull_up_path** - Beginner → Pull-up → Weighted
2. **row_path** - Incline Row → Horizontal Row → Weighted
3. **dip_path** - Support → Dips → Weighted
4. **push_up_path** - Incline → Standard → Diamond → PPPU
5. **squat_path** - BW Squat → Split → Bulgarian → Pistol
6. **hinge_path** - RDL → Single Leg → Nordic

### Paths Secundarios (FASE 2)

7. **core_anti_extension** - Plank → Ab Wheel → Dragon Flag
8. **core_anti_rotation** - Pallof → Copenhagen
9. **l_sit_path** - Supported → Tuck → Full → V-sit
10. **hspu_path** - Pike Push-ups → Wall HSPU → Freestanding

### Paths Avanzados (FASE 3)

11. **front_lever_path** - Tuck FL → Full FL
12. **planche_path** - Tuck Planche → Full Planche
13. **muscle_up_path** - Prerequisites → Muscle-up
14. **back_lever_path** - German Hang → BL
15. **human_flag_path** - Vertical → Full Flag

---

## Siguiente Paso

1. ✅ Conceptualización completa (este documento)
2. ⏳ Revisar y validar con ejercicios existentes
3. ⏳ Crear los ~68 ejercicios faltantes
4. ⏳ Crear SQL para progression_paths
5. ⏳ Crear SQL para progression_path_exercises
6. ⏳ Definir unlock_criteria específicos

---

## Notas de Implementación

### Unlock Criteria Típicos

```sql
-- Para ejercicios dinámicos (avanzar con 3x8)
unlock_criteria = '{"type": "sets_reps", "sets": 3, "reps": 8}'

-- Para isométricos (avanzar con 3x30s)
unlock_criteria = '{"type": "time", "sets": 3, "seconds": 30}'

-- Para prerequisitos múltiples
unlock_criteria = '{"type": "sets_reps", "sets": 3, "reps": 10, "prerequisites": ["uuid1", "uuid2"]}'
```

### Estructura de Path

```sql
INSERT INTO progression_paths (id, slug, name_key, description_key, category, difficulty, icon)
VALUES (
  'uuid',
  'pull_up_path',
  'progression.pull_up.name',
  'progression.pull_up.description',
  'vertical_pull',
  'beginner_to_advanced',
  'pullup'
);
```

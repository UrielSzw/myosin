# 🏋️ PROMPTS PARA GENERACIÓN DE EJERCICIOS

## 📋 ESTRATEGIA DE 2 FASES

**FASE 1**: Obtener lista completa y organizada de ejercicios por grupo muscular
**FASE 2**: Generar ejercicios detallados de a 20 por vez

---

## 🎯 PROMPT 1: PLANIFICACIÓN COMPLETA

```
# EJERCICIOS DE GIMNASIO - PLANIFICACIÓN COMPLETA

Necesito que me ayudes a crear una lista COMPLETA y ORGANIZADA de ejercicios de gimnasio para una app de fitness profesional.

## GRUPOS MUSCULARES DISPONIBLES:
- **Upper Body Push**: chest_upper, chest_middle, chest_lower, front_delts, side_delts, triceps
- **Upper Body Pull**: lats, rhomboids, mid_traps, lower_traps, upper_traps, rear_delts, biceps, forearms
- **Core**: rectus_abdominis, obliques, transverse_abdominis, erector_spinae, lower_back
- **Lower Body**: quads, hamstrings, glutes, calves, hip_flexors, hip_adductors, hip_abductors
- **Specialized**: serratus_anterior, rotator_cuff, full_body

## EQUIPAMIENTO DISPONIBLE:
**Free Weights**: barbell, ez_curl_bar, dumbbell, kettlebell, weight_plate
**Machines**: cable_machine, smith_machine, leg_press, lat_pulldown, chest_press_machine, leg_curl_machine, leg_extension_machine, seated_row_machine, shoulder_press_machine
**Bodyweight**: bodyweight, pull_up_bar, dip_station, parallel_bars
**Accessories**: resistance_band, suspension_trainer, medicine_ball, stability_ball, ab_wheel
**Benches**: flat_bench, incline_bench, decline_bench, preacher_bench

## EXERCISE_TYPE:
- **compound**: Ejercicios multi-articulares (squat, deadlift, bench press)
- **isolation**: Ejercicios de una articulación (bicep curl, leg extension)

## INSTRUCCIONES:

1. **Crea una lista de 15-20 ejercicios POR CADA grupo muscular**
2. **Incluye ejercicios de TODOS los niveles**: principiante, intermedio, avanzado
3. **Mezcla equipment**: bodyweight, free weights, machines, cables
4. **Incluye variaciones importantes**: incline/decline, different grips, unilateral, etc.
5. **Prioriza ejercicios REALES y POPULARES** usados en gimnasios

## FORMATO DE RESPUESTA:

### CHEST_UPPER (15-20 ejercicios)
1. Incline Barbell Press
2. Incline Dumbbell Press
3. Incline Dumbbell Flyes
4. [continúa...]

### CHEST_MIDDLE (15-20 ejercicios)
1. Barbell Bench Press
2. Dumbbell Bench Press
3. Push-ups
4. [continúa...]

[Continúa con TODOS los grupos musculares...]

## CRITERIOS DE CALIDAD:
- ✅ Ejercicios que realmente se hacen en gimnasios
- ✅ Nombres estándar reconocibles
- ✅ Balance entre compound e isolation
- ✅ Variedad de equipment para cada músculo
- ✅ Incluir progresiones (push-ups → decline push-ups)

**OBJETIVO**: Lista completa, organizada y profesional para competir con las mejores apps de fitness.
```

---

## 🎯 PROMPT 2: GENERACIÓN DETALLADA (Usar después del Prompt 1)

````
# GENERACIÓN DETALLADA DE EJERCICIOS - LOTE [X]

Basándote en la lista que creamos anteriormente, necesito que generes la estructura detallada para los siguientes ejercicios:

## EJERCICIOS A PROCESAR:
[Aquí pegarás 15-20 ejercicios específicos de la lista anterior]

## MODELO DE DATOS:

```typescript
// Estructura exacta requerida:
{
  id: string,                    // UUID único hardcodeado
  name: string,                  // Nombre del ejercicio
  source: "system",              // SIEMPRE "system"
  created_by_user_id: null,      // SIEMPRE null
  main_muscle_group: IExerciseMuscle,        // Músculo principal
  secondary_muscle_groups: IExerciseMuscle[], // Músculos secundarios
  primary_equipment: IExerciseEquipment,     // Equipment principal
  equipment: IExerciseEquipment[],           // Todo equipment necesario
  exercise_type: "compound" | "isolation",   // Tipo de ejercicio
  instructions: string[],        // 3-7 pasos SÚPER claros
  similar_exercises: string[],   // IDs de ejercicios similares (déjalo vacío por ahora)
  images: string[],              // SIEMPRE array vacío []
  default_measurement_template: "time_only" | "distance_only" | "weight_reps" | "weight_reps_range" | "distance_time" | "weight_distance" | "weight_time"  // Template de medición
}
````

## TYPES DISPONIBLES:

### IExerciseMuscle (USA EXACTAMENTE ESTOS VALORES - core no existe):

chest_upper, chest_middle, chest_lower, front_delts, side_delts, rear_delts, triceps, lats, rhomboids, mid_traps, lower_traps, upper_traps, biceps, forearms, rectus_abdominis, obliques, transverse_abdominis, erector_spinae, lower_back, quads, hamstrings, glutes, calves, hip_flexors, hip_adductors, hip_abductors, serratus_anterior, rotator_cuff, full_body

### IExerciseEquipment (USA EXACTAMENTE ESTOS VALORES):

barbell, ez_curl_bar, dumbbell, kettlebell, weight_plate, cable_machine, smith_machine, leg_press, lat_pulldown, chest_press_machine, leg_curl_machine, leg_extension_machine, seated_row_machine, shoulder_press_machine, bodyweight, pull_up_bar, dip_station, parallel_bars, resistance_band, suspension_trainer, medicine_ball, stability_ball, foam_roller, ab_wheel, flat_bench, incline_bench, decline_bench, preacher_bench

### default_measurement_template (USA EXACTAMENTE ESTOS VALORES):

- **"time_only"**: Para ejercicios isométricos como plancha, wall sit (solo tiempo)
- **"distance_only"**: Para ejercicios de distancia sin tiempo
- **"weight_reps"**: Para ejercicios con peso y repeticiones (bench press, squats, etc.)
- **"weight_reps_range"**: Para peso fijo con rango de repeticiones (ej: 8-12 reps)
- **"distance_time"**: Para cardio - correr, remar, ciclismo (distancia + tiempo)
- **"weight_distance"**: Para farmer's walk, sled push/pull (peso + distancia)
- **"weight_time"**: Para ejercicios isométricos con peso (peso + tiempo)

## EJEMPLO COMPLETO:

```typescript
{
  id: "uuid-bench-press-001",
  name: "Barbell Bench Press",
  source: "system",
  created_by_user_id: null,
  main_muscle_group: "chest_middle",
  secondary_muscle_groups: ["triceps", "front_delts"],
  primary_equipment: "barbell",
  equipment: ["barbell", "flat_bench"],
  exercise_type: "compound",
  instructions: [
    "Acuéstate boca arriba en el banco plano con los pies firmemente apoyados en el suelo",
    "Agarra la barra con las manos separadas un poco más que el ancho de los hombros, con agarre pronado",
    "Desuelga la barra del rack y posiciónala directamente sobre tu pecho con los brazos extendidos",
    "Baja la barra de forma controlada hasta que toque ligeramente tu pecho a la altura de los pezones",
    "Presiona la barra hacia arriba de forma explosiva hasta volver a la posición inicial con los brazos completamente extendidos",
    "Mantén la espalda arqueada naturalmente y los omóplatos retraídos durante todo el movimiento"
  ],
  similar_exercises: [],
  images: [],
  default_measurement_template: "weight_reps"
}
```

## CRITERIOS CRÍTICOS PARA INSTRUCTIONS:

1. **SÚPER ESPECÍFICAS**: Una persona debe poder hacer el ejercicio perfectamente solo leyendo
2. **3-9 pasos máximo**: No más, no menos
3. **Incluir posición inicial**: Setup completo
4. **Describir el movimiento**: Fase excéntrica y concéntrica
5. **Puntos de forma críticos**: Lo que NO hacer, posición corporal
6. **Términos precisos**: "agarre pronado", "retracción escapular", etc.
7. **EN ESPAÑOL**: Todo en español rioplatense

## FORMATO DE RESPUESTA:

```typescript
export const exercisesLote[X] = [
  {
    id: "uuid-ejercicio-001",
    name: "Nombre del Ejercicio",
    // ... resto de campos
  },
  {
    id: "uuid-ejercicio-002",
    name: "Otro Ejercicio",
    // ... resto de campos
  }
  // ... continúa con todos los ejercicios del lote
];
```

**OBJETIVO**: Ejercicios con calidad profesional, instrucciones cristalinas y datos perfectamente estructurados.

```

---

## 💡 MI RECOMENDACIÓN DE FLUJO:

### PASO 1: Usar Prompt 1
- Obtienes lista completa organizada por músculo
- Puedes revisar y ajustar la lista antes de continuar
- Te aseguras de tener buena cobertura

### PASO 2: Usar Prompt 2 iterativamente
- Tomas 15-20 ejercicios de la lista del Paso 1
- Los procesas con el Prompt 2
- Repites hasta completar todos

### PASO 3: Post-procesamiento
- Una vez que tengas todos los ejercicios, puedes hacer un tercer prompt para llenar los `similar_exercises` basándose en todos los IDs generados

## 🎯 VENTAJAS DE ESTA ESTRATEGIA:

1. **Calidad**: La IA se enfoca en una tarea específica por vez
2. **Control**: Puedes revisar la lista antes de generar detalles
3. **Consistencia**: Cada lote sigue el mismo formato exacto
4. **Escalabilidad**: Puedes procesar tantos lotes como necesites
5. **Iteración**: Si un lote no sale bien, solo regeneras ese lote

¿Te parece buena esta estrategia? ¿Algún ajuste que quieras hacer a los prompts?
```

# 🏋️ Análisis de Mercado: Calistenia y Myosin

> Investigación de mercado sobre apps de calistenia, capacidades actuales de Myosin, y oportunidades de mejora.

---

## 📊 Resumen Ejecutivo

Myosin **ya tiene una base sólida** para usuarios de calistenia, pero está diseñada como una app de **tracking generalista** de fuerza. Las apps especializadas en calistenia ofrecen un **enfoque diferente**: progresiones de skills, tutoriales guiados, y gamificación.

### Conclusión Principal

Myosin puede capturar usuarios de calistenia **sin pivotear** su producto, pero podría considerar **features complementarias** para diferenciarse de competidores generalistas.

---

## 📱 Apps de Calistenia Analizadas

### 1. **THENX** (Chris Heria)

- **Usuarios**: 2M+ activos
- **Modelo**: Freemium ($19.99/mes o $119.99/año premium)
- **Rating**: 4.1 (Android) / 4.8 (iOS)

**Features Clave:**
| Feature | Descripción |
|---------|-------------|
| 🎯 Skill Progressions | Tutoriales paso a paso: Muscle-up, Planche, Handstand, Front Lever |
| 📹 Video Tutorials | 1000+ ejercicios con videos de demostración |
| 📊 Muscle Analytics | Visualización de activación muscular |
| 🗓️ Daily Workouts | Rutinas personalizadas diarias |
| 📈 Progress Tracking | Log de reps, sets, PRs |
| 🔥 Skill Challenges | Retos específicos por skill |
| 🌍 Community | Heatmap global, leaderboards |

**Fortalezas:**

- Contenido de alta calidad (producción profesional)
- Sistema de progresiones para skills avanzados
- Fuerte branding (influencer-led)

**Debilidades:**

- Tracking de progreso básico vs apps especializadas
- No hay personalización profunda de rutinas
- Enfocado en seguir planes, no crear propios

---

### 2. **Madbarz**

- **Usuarios**: 2M+
- **Modelo**: Freemium
- **Rating**: 4.7 (Android)

**Features Clave:**
| Feature | Descripción |
|---------|-------------|
| 🏠 Home Workouts | Diseñado para sin equipamiento |
| 📊 Muscle Group Tracking | Visualización de músculos activados |
| 🍎 Nutrition Tips | 65+ recetas, guías de nutrición |
| 📹 Video Tutorials | Videos HD por ejercicio |
| 📅 Workout Plans | Programas Fat Loss / Muscle Gain |
| 📈 Calorie Tracking | Calorías quemadas por workout |
| ⏱️ Short Workouts | Entrenamientos cortos (~20 min) |

**Fortalezas:**

- Simplicidad y facilidad de uso
- Buenos programas estructurados
- Nutrición integrada

**Debilidades:**

- Menos profundidad en tracking
- Sin skills avanzados (planche, levers)
- Menos personalizable

---

### 3. **Freeletics**

- **Usuarios**: 59M+
- **Modelo**: Freemium (Coach subscription)
- **Rating**: 4.2 (Android)

**Features Clave:**
| Feature | Descripción |
|---------|-------------|
| 🤖 AI Coach | Personalización por IA |
| 🎯 Training Journeys | 20+ programas con diferentes objetivos |
| 📹 350+ Exercises | Videos y explicaciones |
| 🏃 HIIT Focus | Énfasis en alta intensidad |
| 🧘 Mindfulness | Componente mental integrado |
| 📊 Adaptive Workouts | Ajuste según feedback |

**Fortalezas:**

- AI Coach muy desarrollado
- Enfoque holístico (mente + cuerpo)
- Escala masiva, mucho contenido

**Debilidades:**

- No es específico de calistenia
- Tracking de PRs/progreso limitado
- Menos control del usuario sobre rutinas

---

### 4. **Otras Apps Mencionadas**

- **Calisteniapp**: Español, skill progressions
- **Calistree**: Bodyweight fitness focus
- **Heria Pro**: Del mismo creador que THENX

---

## 💪 Capacidades Actuales de Myosin para Calistenia

### ✅ Fortalezas Existentes

#### 1. **Equipment Types para Calistenia**

```
✓ bodyweight
✓ pull_up_bar
✓ dip_station
✓ parallel_bars
✓ resistance_band
✓ suspension_trainer (TRX)
```

#### 2. **Measurement Templates**

| Template            | Uso en Calistenia                  |
| ------------------- | ---------------------------------- |
| `weight_reps`       | Pull-ups, Push-ups (con reps)      |
| `time_only`         | Plancha, Hollow Hold, Hang         |
| `weight_time`       | Weighted Plank, Dead Hang con peso |
| `weight_reps_range` | Programación flexible (8-12 reps)  |

#### 3. **Set Types**

| Tipo        | Aplicación                  |
| ----------- | --------------------------- |
| `isometric` | Plancha, L-sit, Hollow hold |
| `warmup`    | Movilidad pre-workout       |
| `drop`      | Variaciones de dificultad   |
| `failure`   | AMRAP en bodyweight         |

#### 4. **Block Types**

| Tipo       | Uso                               |
| ---------- | --------------------------------- |
| `circuit`  | Rondas estilo crossfit/calistenia |
| `superset` | Antagonistas (push/pull)          |

#### 5. **Ejercicios Bodyweight en BD** (Muestra)

- **Pecho**: Push-ups, Flexiones declinadas, Dips
- **Espalda**: Dominadas (pull-up bar), Inverted Rows
- **Core**: Plancha frontal, Plancha lateral, Hollow Hold, Superman Hold, Elevaciones colgado
- **Piernas**: Sentadillas bodyweight, Lunges, Bulgarian Split Squat

#### 6. **Timer Integrado**

- `SingleSetTimerSheet`: Timer visual para ejercicios `time_only`
- `CircuitTimerModeV2`: Modo guiado para circuitos

#### 7. **Instructions por Ejercicio**

- Cada ejercicio tiene instrucciones paso a paso
- Soporte para imágenes/GIFs demostrativos

---

### ⚠️ Gaps Identificados vs Apps Especializadas

| Gap                                 | THENX/Madbarz Tienen                              | Myosin Tiene               |
| ----------------------------------- | ------------------------------------------------- | -------------------------- |
| **Skill Progressions**              | Árbol de progresiones (Muscle-up → prerequisites) | ❌ No                      |
| **Video Tutorials**                 | Videos HD por ejercicio                           | 🟡 Solo GIFs/imágenes      |
| **Pre-built Calisthenics Programs** | 20+ programas específicos                         | 🟡 Templates genéricos     |
| **Muscle Heatmap**                  | Visualización de activación                       | 🟡 Por grupo muscular solo |
| **Community/Leaderboards**          | Rankings, challenges                              | ❌ No                      |
| **AI Recommendations**              | Sugerencias de siguiente ejercicio                | ❌ No                      |
| **Gamification**                    | Badges, streaks visibles, unlocks                 | ❌ No                      |
| **Calorie Tracking**                | Estimación por workout                            | ❌ No                      |

---

## 🎯 Oportunidades de Mejora

### Tier 1: Quick Wins (Bajo esfuerzo, alto impacto)

#### 1. **Pre-built Calisthenics Routines**

Agregar templates de rutinas específicas:

- "Beginner Bodyweight" (Push-ups, Squats, Planks)
- "Pull-up Progression" (Dead hang → Negative → Full)
- "Core Strength" (Circuit de 4-5 ejercicios isométricos)

**Esfuerzo**: Bajo (solo data en `routine_templates`)

#### 2. **Más Ejercicios Isométricos**

Agregar ejercicios que faltan:

- L-sit (suelo y barras)
- Dead Hang
- Wall Sit
- Frog Stand
- Tuck Planche Hold

**Esfuerzo**: Bajo (SQL migrations)

#### 3. **Filtro "Solo Bodyweight" en Exercise Selector**

Ya existe `hasEquipmentFilter` en routine-templates. Exponer más prominentemente.

**Esfuerzo**: Bajo

---

### Tier 2: Mejoras Medianas

#### 4. **Similar Exercises con Progresión**

Usar el campo `similar_exercises` para sugerir:

- "¿No puedes hacer Pull-up? Prueba Inverted Row"
- "¿Dominaste Push-ups? Prueba Archer Push-up"

**Esfuerzo**: Medio (lógica de recomendación + UI)

#### 5. **PR Tracking para Time-based**

Actualmente PRs son `weight × reps`. Agregar:

- Longest Hold (segundos)
- Longest Hang Time

**Esfuerzo**: Medio (extender lógica de PRs)

#### 6. **Workout Tags/Categories**

Permitir etiquetar rutinas:

- `#calisthenics`
- `#mobility`
- `#strength`

**Esfuerzo**: Medio

---

### Tier 3: Features Grandes (Diferenciación)

#### 7. **Skill Progression Trees** 🌟

Sistema visual de progresiones:

```
                    [Muscle-Up]
                        ↑
            [High Pull-up] + [Deep Dip]
                  ↑              ↑
            [Pull-up]       [Dip]
                ↑
        [Inverted Row]
```

- Unlock visual cuando se logra PR en ejercicio
- Suggestions: "Para desbloquear Muscle-Up, necesitas: 10 Pull-ups consecutivos"

**Esfuerzo**: Alto (nuevo módulo)

#### 8. **Video/GIF Library Expandida**

Integrar videos para ejercicios, especialmente:

- Progresiones técnicas (muscle-up technique)
- Form cues

**Esfuerzo**: Alto (storage, CDN)

#### 9. **Community Challenges**

- Weekly challenges ("100 Push-ups daily challenge")
- Leaderboards opcionales

**Esfuerzo**: Alto (backend, social features)

---

## 📈 Análisis de Posicionamiento

### Myosin vs Competidores

| Aspecto             | THENX               | Madbarz                  | Freeletics      | **Myosin**      |
| ------------------- | ------------------- | ------------------------ | --------------- | --------------- |
| **Target**          | Calistenia avanzada | Principiantes bodyweight | General fitness | Gym rats + Home |
| **Personalización** | Baja                | Baja                     | Media (AI)      | **Alta**        |
| **Tracking Depth**  | Básico              | Básico                   | Medio           | **Alto**        |
| **Offline**         | Parcial             | Parcial                  | Parcial         | **100%**        |
| **PR System**       | Básico              | No                       | No              | **Avanzado**    |
| **Precio**          | $120/año            | Freemium                 | $90+/año        | **Gratis**      |

### Propuesta de Valor Diferenciada

Myosin puede posicionarse como:

> "La app de tracking seria para quien hace calistenia Y pesas, con control total sobre sus rutinas y datos"

**vs THENX**: "Si quieres seguir planes de Chris Heria, usa THENX. Si quieres trackear TU progreso con TUS rutinas, usa Myosin."

**vs Freeletics**: "Si quieres que una AI te diga qué hacer, usa Freeletics. Si quieres control total y funcionar offline, usa Myosin."

---

## 🚀 Recomendaciones Finales

### Corto Plazo (1-2 sprints)

1. ✅ Agregar 5-10 ejercicios isométricos/calistenia que faltan
2. ✅ Crear 3 routine templates de calistenia
3. ✅ Mejorar filtrado por equipment en selector

### Mediano Plazo (1-3 meses)

4. 🔄 PR tracking para ejercicios time-based
5. 🔄 Sistema de "ejercicios relacionados" con sugerencias de progresión
6. 🔄 Tags/categorías para rutinas

### Largo Plazo (6+ meses, si se valida demanda)

7. 💡 Skill progression trees (feature diferenciadora)
8. 💡 Expanded media library
9. 💡 Community challenges (si hay base de usuarios suficiente)

---

## 📚 Referencias

- [THENX App](https://thenx.com/app) - 2M+ usuarios
- [Madbarz](https://www.madbarz.com/) - 2M+ usuarios
- [Freeletics](https://www.freeletics.com/) - 59M+ usuarios
- Google Play / App Store reviews analizados

---

_Documento creado: Enero 2025_
_Próxima revisión: Después de implementar Tier 1_

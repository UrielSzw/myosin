# 🔍 Auditoría de Producto: Tracker V2

## Resumen Ejecutivo

El Tracker V2 de Myosin es una feature **sólida técnicamente** pero con **oportunidades significativas de mejora a nivel producto**. La arquitectura es flexible y el código está bien organizado, pero hay decisiones de diseño que podrían repensarse antes del lanzamiento.

**Veredicto general**: 7/10 - Buena base técnica, necesita refinamiento de producto.

---

## 📊 Lo Que Está Bien

### 1. **Modelo de Datos Flexible**

El sistema de `input_type` + `behavior` es elegante:

```typescript
input_type: "numeric_accumulative" |
  "numeric_single" |
  "scale_discrete" |
  "boolean_toggle";
behavior: "accumulate" | "replace";
```

Esto permite soportar muchos tipos de métricas sin cambiar el schema.

### 2. **Quick Actions**

Excelente UX para métricas numéricas. Los shortcuts como "Vaso grande (300ml)" o "Pollo (150g)" reducen fricción significativamente.

### 3. **Agregados Diarios Pre-calculados**

La tabla `tracker_daily_aggregates` evita recalcular sumas en cada render. Smart.

### 4. **Soft Delete en Métricas**

Permite restaurar métricas eliminadas. Los usuarios cometen errores.

### 5. **Separación Tracker vs Macros**

Buena decisión mantenerlos separados - son conceptualmente diferentes.

---

## ⚠️ Problemas de Producto Identificados

### 1. 🔴 **No Hay Streaks (Rachas)**

**Problema**: No existe el concepto de "streak" - días consecutivos cumpliendo un objetivo.

**Por qué importa**: Los streaks son el **mecanismo de retención #1** en apps de hábitos. Duolingo, Headspace, y prácticamente toda app exitosa de hábitos los tiene.

**Evidencia**: No hay campo `streak` en el schema, ni lógica de cálculo.

**Recomendación**:

```typescript
// Agregar a tracker_daily_aggregates o nueva tabla
{
  current_streak: number,        // Días consecutivos actuales
  longest_streak: number,        // Récord personal
  streak_started_at: string,     // Cuándo empezó el streak actual
  last_completed_day: string,    // Último día que se cumplió el objetivo
}
```

**Impacto en código**: Bajo. Se puede calcular desde `daily_aggregates` existentes.

---

### 2. 🔴 **WeekStrip Limitado a 7 Días**

**Problema**: El `WeekStripV2` solo muestra 7 días (6 pasados + hoy). No hay forma de:

- Ver más atrás en el tiempo
- Navegar a fechas específicas
- Ver un mes completo

**Código actual**:

```typescript
// WeekStripV2.tsx
for (let i = -6; i <= 0; i++) {
  // Solo 7 días
  // ...
}
```

**Por qué importa**:

- Usuarios quieren ver patrones semanales/mensuales
- Imposible editar datos de hace 2+ semanas
- Competidores (Habitica, Streaks, etc.) tienen vistas de calendario

**Recomendación**:

1. Agregar botón "Ver más" que abra un calendario mensual
2. O hacer el WeekStrip scrollable infinitamente hacia atrás
3. Agregar vista de "Mes" con grid de días coloreados por progreso

---

### 3. 🟡 **Sin Visualizaciones de Progreso**

**Problema**: No hay gráficas, charts, ni visualizaciones del progreso histórico.

**Lo que existe**:

- `getMetricProgress()` calcula datos pero no hay UI que los muestre
- `getMetricHistory()` trae agregados pero no se visualizan

**Por qué importa**:

- Ver progreso motiva (psychology of completion)
- Sin visualización, los datos son "invisibles"
- Apps como MyFitnessPal, Lifesum muestran gráficas prominentemente

**Recomendación**:

- Agregar mini-gráfica de 7 días en cada `MetricCard`
- Vista de detalle con gráfica semanal/mensual
- Comparativas "Esta semana vs semana pasada"

---

### 4. 🟡 **Targets Sin Contexto Temporal**

**Problema**: Los `default_target` son estáticos. No hay:

- Targets diferentes por día de la semana
- Progresión de targets (empezar con 5000 pasos → subir a 10000)
- Targets semanales vs diarios

**Código actual**:

```typescript
// tracker_metrics
default_target: real("default_target"); // Un solo número
```

**Por qué importa**:

- Los domingos quizás el target de proteína es diferente
- Usuarios principiantes necesitan targets más fáciles
- La progresión es clave para no abrumar

**Recomendación**:

```typescript
// Nueva estructura de targets
{
  daily_targets: {
    monday: number,
    tuesday: number,
    // ...
  },
  weekly_target?: number,
  progression_enabled: boolean,
  progression_increment: number, // +500 pasos cada semana
}
```

---

### 5. 🟡 **Métricas Predefinidas Solo en Español**

**Problema**: Los templates están hardcodeados en español:

```typescript
// templates.ts
{
  slug: "protein",
  name: "Proteína", // 🔴 Hardcoded español
  // ...
}
```

**Por qué importa**:

- La app soporta `lang: "es" | "en"` pero los nombres de métricas no
- Usuarios en inglés verán "Proteína" en vez de "Protein"

**Recomendación**:

- Mover nombres a archivo de traducciones
- Usar `slug` como key de traducción

**Nota**: Veo que existe `getMetricName()` en traducciones, pero los templates iniciales siguen en español.

---

### 6. 🟡 **Sin Notificaciones/Recordatorios**

**Problema**: No hay sistema de recordatorios para trackear.

**Por qué importa**:

- Principal causa de abandono: olvidar usar la app
- Apps exitosas envían push notifications estratégicos
- "No has registrado agua hoy" a las 2pm tiene alto engagement

**Recomendación** (post-lanzamiento):

- Agregar campo `reminder_time` por métrica
- Integrar con Expo Notifications
- Notificación inteligente si no hay entries al mediodía

---

### 7. 🟢 **Macros Separados pero Duplicados**

**Observación**: Macros (proteína, carbs, grasas) y Tracker (proteína individual) son features separadas.

**Potencial confusión**: Un usuario podría trackear "Proteína" en el tracker Y en macros, duplicando esfuerzo.

**Recomendación**:

- Opción 1: Si usuario tiene macro targets, ocultar "Proteína" del tracker
- Opción 2: Sincronizar automáticamente entradas de proteína entre ambos
- Opción 3: Clarificar UX que macros es para nutrición detallada, tracker para hábitos generales

---

### 8. 🟢 **UX del Modal de Métrica**

**Observación**: El `MetricModalV2` tiene ~1200 líneas. Es funcional pero:

- Mucha lógica en un solo archivo
- Sub-componentes internos podrían ser archivos separados
- El flujo de Quick Actions → Confirmar podría simplificarse

**Recomendación**:

- Extraer `QuickActionsSection`, `ScaleInputSection`, `BooleanInputSection` a archivos
- Considerar "tap to add" directo sin confirmación para Quick Actions frecuentes

---

## 🎯 Priorización de Mejoras

### Antes del Lanzamiento (High Impact, Low Effort)

| Mejora                           | Esfuerzo | Impacto  | Prioridad  |
| -------------------------------- | -------- | -------- | ---------- |
| Agregar streaks básicos          | Medio    | Muy Alto | ⭐⭐⭐⭐⭐ |
| Traducir templates               | Bajo     | Alto     | ⭐⭐⭐⭐   |
| Mini-gráfica en MetricCard       | Medio    | Alto     | ⭐⭐⭐⭐   |
| WeekStrip scrollable o "ver más" | Medio    | Medio    | ⭐⭐⭐     |

### Post-Lanzamiento

| Mejora                          | Esfuerzo | Impacto  | Prioridad |
| ------------------------------- | -------- | -------- | --------- |
| Vista de calendario mensual     | Alto     | Alto     | ⭐⭐⭐⭐  |
| Notificaciones/recordatorios    | Alto     | Muy Alto | ⭐⭐⭐⭐  |
| Targets por día de semana       | Medio    | Medio    | ⭐⭐⭐    |
| Sincronización Tracker ↔ Macros | Alto     | Medio    | ⭐⭐      |

---

## 💡 Features Que Faltarían Para Competir

Comparando con apps líderes (Habitify, Streaks, Loop Habit Tracker):

| Feature                  | Myosin Tracker | Habitify | Streaks |
| ------------------------ | -------------- | -------- | ------- |
| Streaks                  | ❌             | ✅       | ✅      |
| Gráficas de progreso     | ❌             | ✅       | ✅      |
| Calendario mensual       | ❌             | ✅       | ✅      |
| Recordatorios            | ❌             | ✅       | ✅      |
| Quick Actions            | ✅             | ⚠️       | ❌      |
| Múltiples tipos de input | ✅             | ✅       | ⚠️      |
| Targets dinámicos        | ❌             | ⚠️       | ❌      |
| Widgets                  | ❌             | ✅       | ✅      |
| Apple Watch              | ❌             | ✅       | ✅      |

**Ventaja competitiva de Myosin**: Integración con workout tracker. Ningún competidor puro de hábitos tiene esto.

---

## 🔧 Refactors Técnicos Recomendados

### 1. Extraer Sub-componentes del Modal

```
components/
├── MetricModalV2.tsx (orquestador)
├── metric-modal/
│   ├── QuickActionsSection.tsx
│   ├── ManualInputSection.tsx
│   ├── ScaleInputSection.tsx
│   ├── BooleanInputSection.tsx
│   ├── HistorySection.tsx
│   └── SettingsSection.tsx
```

### 2. Centralizar Colores de Métricas

```typescript
// constants/metric-colors.ts
export const METRIC_COLORS = {
  protein: "#EF4444",
  water: "#3B82F6",
  // ... definidos una sola vez
} as const;
```

Actualmente están dispersos en varios archivos.

### 3. Agregar Schema para Streaks

```typescript
// Nueva tabla o extensión de daily_aggregates
export const tracker_streaks = sqliteTable("tracker_streaks", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  metric_id: text("metric_id").references(() => tracker_metrics.id),
  current_streak: integer("current_streak").default(0),
  longest_streak: integer("longest_streak").default(0),
  streak_started_at: text("streak_started_at"),
  last_completed_at: text("last_completed_at"),
  ...timestamps,
});
```

### 4. Hook para Streaks

```typescript
// hooks/use-streak.ts
export const useStreak = (metricId: string, userId: string) => {
  // Calcular desde daily_aggregates
  // Cache agresivo ya que solo cambia 1x/día
};
```

---

## 🎨 Sugerencias de UX/UI

### 1. **Celebración de Streak**

Cuando el usuario completa un día y mantiene/aumenta su streak, mostrar animación de confetti o similar.

### 2. **Estado Vacío Más Motivador**

El `EmptyMetricsV2` actual es funcional pero podría ser más inspirador:

- "¿Qué hábito quieres construir hoy?"
- Sugerencias contextuales basadas en hora del día

### 3. **Feedback Táctil Mejorado**

El `haptic.success()` está bien, pero considerar:

- Haptic diferente cuando se rompe un streak
- Haptic especial cuando se alcanza el target

### 4. **Progress Ring en Header**

En vez de solo mostrar el número, un ring animado mostraría progreso hacia el target de forma más visual.

---

## 📝 Conclusión

El Tracker V2 tiene una **excelente base técnica**. El modelo de datos es flexible, el código está bien organizado, y las features básicas funcionan.

**Sin embargo**, para ser competitivo en el mercado de habit trackers, necesita:

1. **Streaks** - No negociable. Es EL feature de retención.
2. **Visualizaciones** - Los datos existen, solo falta mostrarlos.
3. **Navegación temporal expandida** - Ver más que 7 días.

La buena noticia: ninguno de estos cambios requiere reestructurar el modelo de datos. Son **adiciones incrementales** que pueden hacerse ahora que no hay datos reales.

**Mi recomendación**: Implementar streaks antes del lanzamiento. El resto puede venir después, pero sin streaks la retención será baja.

---

_Auditoría realizada: Diciembre 2024_
_Archivos analizados: 15+ componentes, hooks, services, y schemas del Tracker V2_

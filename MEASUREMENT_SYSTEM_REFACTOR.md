# 🔄 Measurement System Refactor - Implementation Plan

## 📋 Overview

Refactor del sistema de medición actual (peso fijo + 1 columna dinámica) a un sistema flexible que soporte hasta 2 métricas por ejercicio.

### Templates Soportados:

- **Single metrics:** `time_only`, `distance_only`
- **Dual metrics:** `weight_reps` (actual), `distance_time`, `weight_distance`, `weight_time`

---

## 🎯 Phase 1: Foundation & Constants

### Step 1.1: Crear Constantes y Types Nuevos

**Files:** `shared/types/measurement.ts` (nuevo)

- [x] Crear `MeasurementTemplateId` type
- [x] Crear `MeasurementTemplate` interface
- [x] Crear `MeasurementField` interface
- [x] Definir `MEASUREMENT_TEMPLATES` constants

### Step 1.2: Actualizar Types Existentes

**Files:** `shared/types/workout.ts`

- [x] **ELIMINAR** `IRepsType` completamente
- [x] Agregar imports de nuevos measurement types

---

## 🗃️ Phase 2: Database Schema & Repository

### Step 2.1: Actualizar Schema de routine_sets

**Files:** `shared/db/schema/routine.ts`

- [x] **REEMPLAZAR** estructura actual completamente
- [x] Agregar `measurement_template` field
- [x] Agregar `primary_value` y `secondary_value` fields
- [x] Agregar `primary_range` y `secondary_range` fields
- [x] **ELIMINAR** campos obsoletos (`reps`, `weight`, `reps_type`, `reps_range`)

### Step 2.2: Actualizar Schema de workout_sets

**Files:** `shared/db/schema/workout-session.ts`

- [x] **REEMPLAZAR** estructura actual completamente
- [x] Mismos cambios que routine_sets
- [x] **ELIMINAR** campos obsoletos

### Step 2.3: Actualizar Schema de exercises

**Files:** `shared/db/schema/routine.ts`

- [x] Agregar `default_measurement_template` field al exercises table
- [x] Seed ejercicios existentes con templates apropiados

### Step 2.4: Actualizar Repositories

**Files:** `shared/db/repository/routines.ts`, `shared/db/repository/workout-sessions.ts`

- [x] **REESCRIBIR** queries para nueva estructura
- [x] **ELIMINAR** toda lógica legacy
- [x] Simplificar código sin backward compatibility

---

## 🎨 Phase 3: Core UI Components

### Step 3.1: Crear MeasurementInput Component

**Files:** `shared/ui/measurement-input/` (nuevo)

- [x] Component base que maneja diferentes tipos (time, distance, weight, reps)
- [x] Soporte para ranges en cualquier tipo
- [x] Validation y formatting apropiado para cada tipo

### Step 3.2: Refactorizar SetsTable

**Files:** `features/routine-form/elements/sets-table/index.tsx`

- [x] Header dinámico basado en template (máximo 2 columnas)
- [x] Template selector button (reemplaza actual reps type selector)
- [x] Mantener funcionalidad de RPE y Tempo

### Step 3.3: Refactorizar SetsItem

**Files:** `features/routine-form/elements/sets-table/sets-item/index.tsx`

- [x] Renderizado dinámico de inputs basado en template
- [x] Usar nuevo MeasurementInput component
- [x] Mantener lógica de set types existente

---

## ⚙️ Phase 4: Template Configuration

### Step 4.1: Crear Template Selector Sheet

**Files:** `features/routine-form/elements/measurement-template-selector/` (nuevo)

- [x] Bottom sheet con opciones de templates
- [x] Secciones: "Una Métrica" y "Dos Métricas"
- [x] Preview de cómo se vería cada template

### Step 4.2: Integrar Template Selector

**Files:** `features/routine-form/hooks/use-form-routine-sheets.ts`

- [x] Agregar "measurementTemplate" sheet type
- [x] Conectar con SetsTable

---

## 🏪 Phase 5: Store & State Management

### Step 5.1: Actualizar Routine Form Store

**Files:** `features/routine-form/hooks/use-routine-form-store.ts`

- [x] **REESCRIBIR** para nueva estructura
- [x] Agregar measurement template state
- [x] Actions para cambiar template de ejercicio
- [x] **ELIMINAR** toda lógica de IRepsType
- [x] Validation para nuevos measurement types

### Step 5.2: Actualizar Block Styles Hook

**Files:** `shared/hooks/use-block-styles.tsx`

- [x] **ELIMINAR** `getRepsColumnTitle` y funciones relacionadas con IRepsType
- [x] Agregar helpers para formatear measurement types
- [x] **ELIMINAR** `formatRepsValue` legacy
- [x] Agregar `formatMeasurementValue` nuevo

---

## 🏃‍♂️ Phase 6: Active Workout Integration

### Step 6.1: Adaptar Active Sets Table

**Files:** `features/active-workout/elements/active-sets-table/`

- [x] Usar mismo sistema que routine form
- [x] **NO permitir cambio de template durante workout** (simplificación)
- [x] Respetar template configurado en routine
- [x] Headers dinámicos basados en measurement template
- [x] Renderizado condicional de secondary field
- [x] Integración completa con MeasurementInput component

### Step 6.2: Actualizar Active Workout Store

**Files:** `features/active-workout/hooks/use-active-workout-store.ts`

- [x] **REESCRIBIR** para nueva estructura de measurements
- [x] **ELIMINAR** toda referencia a IRepsType/reps legacy
- [x] Store state completamente migrado a primary/secondary values
- [x] PR detection integrado con weight_reps template
- [x] Set completion logic actualizado

### Step 6.3: Migrar Save/Update Hooks (PENDIENTE)

**Files:** `features/active-workout/hooks/use-save-workout-session.ts`, `use-update-routine.ts`

- [ ] **MIGRAR** use-save-workout-session.ts de actual_weight/reps a primary/secondary
- [ ] **MIGRAR** use-update-routine.ts de weight/reps legacy a measurement system
- [ ] **ACTUALIZAR** volume calculation para usar weight_reps template
- [ ] **REVISAR** store-helpers.ts hardcoded measurement_template values

---

## 📊 Phase 7: Calculations & Analytics

### Step 7.1: Adaptar PR Logic

**Files:** `features/active-workout/hooks/use-pr-logic.ts`

- [ ] **Option A:** Adaptar PRs para distance/time (más complejo)
- [ ] **Option B:** Solo calcular PRs para weight_reps template (más simple)
- [ ] Decidir approach basado en complejidad

### Step 7.2: Actualizar Volume Calculator

**Files:** `shared/utils/volume-calculator.ts`

- [ ] **Incluir en volumen:** Solo templates que tengan weight (weight_reps, weight_distance, weight_time)
- [ ] **Excluir:** time_only, distance_only, distance_time
- [ ] Adaptar cálculos para nueva estructura

---

## 🧹 Phase 8: Cleanup & Seeding

### Step 8.1: Update Exercise Seeding

**Files:** `shared/db/seed/`

- [ ] Asignar templates apropiados a ejercicios seedeados
- [ ] weight_reps para la mayoría
- [ ] time_only para planks, wall sits, etc.
- [ ] distance_time para cardio

### Step 8.2: Final Testing & Validation

**Files:** Various

- [ ] Validar que no queden referencias a IRepsType
- [ ] Testing completo de todos los templates
- [ ] Performance testing con nueva estructura

---

## 🎯 Implementation Order Suggestion

### Week 1: Foundation

```
Phase 1 → Phase 2.1-2.2 → Phase 3.1
```

### Week 2: Core UI

```
Phase 3.2-3.3 → Phase 4 → Phase 5.1
```

### Week 3: Integration

```
Phase 5.2 → Phase 6 → Phase 2.3-2.4
```

### Week 4: Polish & Analytics

```
Phase 7 → Phase 8 → Testing & refinement
```

---

## 📝 Technical Decisions Made

✅ **Max 2 metrics:** Keeps UI simple and covers 95% of use cases  
✅ **No required fields:** User flexibility, simpler validation  
✅ **Clean slate approach:** Complete replacement, no legacy support  
✅ **Template inheritance:** Exercises have default, can override per set  
✅ **Active workout simplification:** No template changes during workout

---

## 🚨 Key Considerations

### Data Structure

- `primary_value` and `secondary_value` instead of named fields
- Ranges supported on both primary and secondary
- Template ID determines interpretation of values
- **Complete replacement** of old reps/weight structure

### UI Constraints

- Maximum 2 dynamic columns in sets table
- Template selector replaces current reps type selector
- Existing RPE/Tempo functionality unchanged

### Development Approach

- **No backward compatibility** - clean slate implementation
- **No migrations** - fresh schema and logic
- **Delete legacy code** - IRepsType and related functions removed

---

## 🧪 Testing Strategy

### Unit Tests

- [ ] Measurement input components
- [ ] Template validation logic
- [ ] Store state transitions

### Integration Tests

- [ ] Sets table with different templates
- [ ] Template switching workflow
- [ ] Active workout with various templates

### E2E Tests

- [ ] Complete routine creation with new measurements
- [ ] Workout execution with different measurement types
- [ ] Volume/PR calculations accuracy

---

**Ready to start implementation? 🚀**

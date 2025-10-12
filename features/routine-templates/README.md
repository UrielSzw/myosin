# 🏋️‍♂️ Routine Templates Feature

Esta feature maneja la creación de rutinas y programas desde templates predefinidos.

## 📁 Estructura

```
features/routine-templates/
├── types/              # Tipos TypeScript
├── constants/          # Templates y constantes
├── services/           # Lógica de conversión y creación
├── ai-prompts/         # Prompts para generar rutinas con IA
```

## 🎯 Flujo Principal

### 1. Crear Templates con IA

1. Abre `ai-prompts/create-routine-prompt.md`
2. Ajusta la configuración al inicio (difficulty, days, etc.)
3. Pega la lista de ejercicios completa
4. Usa el prompt con ChatGPT/Claude
5. Copia el JSON resultado

### 2. Agregar Templates al Sistema

1. Agrega los `RoutineTemplate` a `constants/index.ts` en `ROUTINE_TEMPLATES`
2. Agrega las `RoutineTemplateData` a `ROUTINE_TEMPLATES_DATA`
3. Si es un programa, agrega el `ProgramTemplate` a `PROGRAM_TEMPLATES`

### 3. Crear Rutinas desde Templates

```typescript
import {
  createRoutineFromTemplate,
  createRoutinesFromProgram,
} from "@/features/routine-templates";

// Crear rutina individual
const routineId = await createRoutineFromTemplate("push-day-intermediate", {
  name: "Mi Push Day Custom",
  folder_id: "my-folder-id",
  training_days: ["monday", "thursday"],
});

// Crear programa completo
const routineIds = await createRoutinesFromProgram("ppl-6day-intermediate", {
  folder_id: "my-folder-id",
});
```

## 🔧 Tipos Principales

### RoutineTemplate

- Info ligera para mostrar en UI
- Nombre, descripción, dificultad, etc.

### RoutineTemplateData

- Data completa para crear en DB
- Bloques, ejercicios, sets con toda la info

### ProgramTemplate

- Programa con múltiples rutinas
- Referencias a RoutineTemplates por ID

## 📋 Checklist para Nuevos Templates

- [ ] Crear `RoutineTemplate` en `ROUTINE_TEMPLATES`
- [ ] Crear `RoutineTemplateData` en `ROUTINE_TEMPLATES_DATA`
- [ ] Verificar que `exercise_id` existan en la DB
- [ ] Testear creación con `createRoutineFromTemplate`
- [ ] Si es programa, crear `ProgramTemplate`

## 🤖 Trabajar con IA

El prompt está diseñado para ser muy específico y generar JSON válido.

**Pasos recomendados:**

1. Empieza con configuraciones simples (beginner, 3 días)
2. Valida que el JSON es correcto
3. Prueba crear la rutina en tu app
4. Ajusta si es necesario
5. Escala a configuraciones más complejas

**Tips:**

- Siempre pega la lista completa de ejercicios
- Revisa que los `exercise_id` coincidan exactamente
- Valida que los rangos de sets/reps sean realistas
- Prueba diferentes configuraciones para tener variedad

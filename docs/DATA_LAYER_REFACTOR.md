# Data Layer Refactor - Plan de Implementación

## Objetivo

Abstraer SQLite + Supabase sync en una única capa de datos con sync automático.

**ANTES:**

```typescript
await routinesService.deleteRoutine(id);
sync("ROUTINE_DELETE", { id }); // Manual, fácil de olvidar
```

**DESPUÉS:**

```typescript
await data.routines.delete(id); // Sync automático
```

---

## Decisiones de Arquitectura

- **Capas:** `DataService` → `SyncedRepository` → `SQLiteRepository` (2 capas útiles)
- **Validaciones:** En el `SyncedRepository` wrapper
- **Sync:** Automático, fire-and-forget con queue offline

---

## Fases

### Fase 1: Infraestructura Base

- [x] `shared/data/types/repository.types.ts` - Interfaces base
- [x] `shared/data/core/sync-adapter.ts` - Adaptador para sync engine
- [x] `shared/data/core/synced-repository.ts` - Wrapper genérico
- [x] `shared/data/data-service.ts` - Facade principal
- [x] `shared/data/use-data-service.ts` - Hook para componentes
- [x] ~~Eliminar `example-implementation.ts`~~ (ya descartado)

### Fase 2: Migración por Dominio

| #   | Dominio          | Mutations     | Estado        |
| --- | ---------------- | ------------- | ------------- |
| 1   | Folders          | 4             | ✅ Completado |
| 2   | Exercises        | 0 (read-only) | ✅ Completado |
| 3   | User Preferences | 2             | ✅ Completado |
| 4   | PRs              | 2             | ✅ Completado |
| 5   | Routines         | 6             | ✅ Completado |
| 6   | Workouts         | 1             | ✅ Completado |
| 7   | Macros           | 9             | ✅ Completado |
| 8   | Tracker          | 13            | ✅ Completado |

### Fase 3: Migración de Consumidores

- [x] Actualizar hooks para usar `dataService`
- [x] Eliminar imports directos de repositorios en features
- [x] Eliminar llamadas manuales a `sync()`

### Fase 4: Limpieza (Próximamente)

- [ ] Eliminar `syncHelper` duplicados (en `macros.ts` y `tracker.ts` services)
- [ ] Eliminar services intermedios innecesarios
- [ ] Eliminar repos Supabase individuales (ahora en sync-dictionary)

---

## Estructura de Archivos Final

```
shared/data/
├── types/
│   └── repository.types.ts
├── core/
│   ├── sync-adapter.ts
│   └── synced-repository.ts
├── repositories/
│   ├── folders.repository.ts
│   ├── exercises.repository.ts
│   ├── user.repository.ts
│   ├── pr.repository.ts
│   ├── routines.repository.ts
│   ├── workouts.repository.ts
│   ├── macros.repository.ts
│   └── tracker.repository.ts
├── data-service.ts
└── use-data-service.ts
```

---

## Progreso

**Inicio:** 2024-12-06
**Fase 2 Completada:** 2024-12-06
**Estado actual:** Fase 2 COMPLETADA ✅ - Todos los dominios migrados

### Resumen de Repositorios Creados

| Repositorio     | Mutations     | Consumidores Migrados |
| --------------- | ------------- | --------------------- |
| folders         | 4             | 3                     |
| exercises       | 0 (read-only) | 1                     |
| userPreferences | 2             | 6                     |
| prs             | 2             | 1                     |
| routines        | 6             | 4                     |
| workouts        | 1             | 1                     |
| macros          | 9             | 1                     |
| tracker         | 13            | 2                     |
| **Total**       | **37**        | **19**                |

/**
 * Data Service - Punto único de acceso a todos los datos
 *
 * Esta es la facade principal que los componentes usan para acceder a datos.
 * Encapsula todos los repositorios con sync automático.
 *
 * USO:
 * ```typescript
 * import { dataService } from "@/shared/data/data-service";
 *
 * // En cualquier parte de la app:
 * await dataService.folders.create({ name: "Mi folder", ... });
 * await dataService.folders.delete(folderId);
 * // El sync a Supabase es AUTOMÁTICO
 * ```
 */

import { exercisesRepository } from "./repositories/exercises.repository";
import { createFoldersRepository } from "./repositories/folders.repository";
import { createMacrosRepository } from "./repositories/macros.repository";
import { createPRRepository } from "./repositories/pr.repository";
import { createRoutinesRepository } from "./repositories/routines.repository";
import { createTrackerRepository } from "./repositories/tracker.repository";
import { createUserPreferencesRepository } from "./repositories/user-preferences.repository";
import { workoutsRepository } from "./repositories/workouts.repository";

// Tipos para el servicio
export interface DataService {
  folders: ReturnType<typeof createFoldersRepository>;
  exercises: typeof exercisesRepository;
  userPreferences: ReturnType<typeof createUserPreferencesRepository>;
  prs: ReturnType<typeof createPRRepository>;
  routines: ReturnType<typeof createRoutinesRepository>;
  workouts: typeof workoutsRepository;
  macros: ReturnType<typeof createMacrosRepository>;
  tracker: ReturnType<typeof createTrackerRepository>;
}

// Singleton instance
let dataServiceInstance: DataService | null = null;

/**
 * Obtiene la instancia del DataService (singleton lazy)
 */
export const getDataService = (): DataService => {
  if (!dataServiceInstance) {
    dataServiceInstance = {
      folders: createFoldersRepository(),
      exercises: exercisesRepository,
      userPreferences: createUserPreferencesRepository(),
      prs: createPRRepository(),
      routines: createRoutinesRepository(),
      workouts: workoutsRepository,
      macros: createMacrosRepository(),
      tracker: createTrackerRepository(),
    };
  }
  return dataServiceInstance;
};

/**
 * Acceso directo al data service (para imports más limpios)
 */
export const dataService = {
  get folders() {
    return getDataService().folders;
  },
  get exercises() {
    return getDataService().exercises;
  },
  get userPreferences() {
    return getDataService().userPreferences;
  },
  get prs() {
    return getDataService().prs;
  },
  get routines() {
    return getDataService().routines;
  },
  get workouts() {
    return getDataService().workouts;
  },
  get macros() {
    return getDataService().macros;
  },
  get tracker() {
    return getDataService().tracker;
  },
};

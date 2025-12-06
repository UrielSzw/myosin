/**
 * useDataService Hook - Acceso al DataService en componentes React
 *
 * Este hook es la forma recomendada de acceder a datos desde componentes.
 *
 * USO:
 * ```typescript
 * function MyComponent() {
 *   const data = useDataService();
 *
 *   const handleCreateFolder = async () => {
 *     await data.folders.create({
 *       name: "Nueva carpeta",
 *       color: "#FF5733",
 *       // ...
 *     });
 *     // Sync automático incluido!
 *   };
 * }
 * ```
 */

import { useMemo } from "react";
import { getDataService, type DataService } from "./data-service";

/**
 * Hook para acceder al DataService en componentes.
 * Retorna siempre la misma instancia (singleton).
 */
export const useDataService = (): DataService => {
  return useMemo(() => getDataService(), []);
};

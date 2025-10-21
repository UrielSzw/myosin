import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_SESSION_LIST_FILTERS,
  SessionListFilters,
  SessionListItem,
} from "../types/session-list";

export const useSessionFilters = (allSessions: SessionListItem[]) => {
  const [filters, setFilters] = useState<SessionListFilters>(
    DEFAULT_SESSION_LIST_FILTERS
  );

  // Función para actualizar filtros individuales
  const updateFilter = <K extends keyof SessionListFilters>(
    key: K,
    value: SessionListFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_SESSION_LIST_FILTERS);
  }, []);

  // Sesiones filtradas con ordenamiento por fecha por defecto
  const filteredSessions = useMemo(() => {
    let result = [...allSessions];

    // Filtro de búsqueda por routine name
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((session) =>
        session.routine_name.toLowerCase().includes(query)
      );
    }

    // Filtro por sesiones recientes
    if (filters.showRecent) {
      result = result.filter((session) => session.is_recent);
    }

    // Ordenamiento por defecto: fecha descendente (más nuevos primero)
    result.sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );

    return result;
  }, [allSessions, filters]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.showRecent) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredSessions,
    activeFiltersCount,
    updateFilter,
    clearAllFilters,
  };
};

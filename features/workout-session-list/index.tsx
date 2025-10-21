import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, View } from "react-native";
import { SessionItem } from "../analytics/elements/recent-sessions-list/session-item";
import { EmptyState } from "../pr-list/elements/empty-state";
import { SessionListHeader } from "./elements/session-list-header";
import { SessionListSearch } from "./elements/session-list-search";
import { useSessionFilters } from "./hooks/use-session-filters";
import { useSessionList } from "./hooks/use-session-list";

export const WorkoutSessionListFeature: React.FC = () => {
  const { colors } = useColorScheme();

  const { data: allSessions, isLoading, error, stats } = useSessionList();

  const filtersHook = useSessionFilters(allSessions);
  const { filteredSessions, filters, updateFilter, clearAllFilters } =
    filtersHook;

  if (error) {
    console.error("[WorkoutSessionListFeature] Error loading data:", error);
  }

  return (
    <ScreenWrapper fullscreen>
      <SessionListHeader
        totalSessions={stats.totalSessions}
        recentSessions={stats.recentSessions}
        avgCompletionRate={stats.avgCompletionRate}
        totalDurationHours={stats.totalDurationHours}
      />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        <SessionListSearch
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter("searchQuery", query)}
          loading={isLoading}
        />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isLoading ? (
            <View style={{ paddingVertical: 40 }}>
              <Typography variant="body2" color="textMuted" align="center">
                Cargando sesiones...
              </Typography>
            </View>
          ) : filteredSessions.length === 0 && allSessions.length === 0 ? (
            <EmptyState
              title="Sin Sesiones"
              description="Completa tu primer entrenamiento para ver el historial"
              icon="trophy"
            />
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              title="Sin resultados"
              description="No se encontraron sesiones con los filtros aplicados"
              icon="search"
              actionLabel="Limpiar filtros"
              onAction={clearAllFilters}
            />
          ) : (
            <View style={{ gap: 12 }}>
              {filteredSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default WorkoutSessionListFeature;

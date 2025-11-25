import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutSessionListTranslations } from "@/shared/translations/workout-session-list";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutSessionListTranslations;

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
        lang={lang}
      />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        <SessionListSearch
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter("searchQuery", query)}
          loading={isLoading}
          lang={lang}
        />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isLoading ? (
            <View style={{ paddingVertical: 40 }}>
              <Typography variant="body2" color="textMuted" align="center">
                {t.loadingSessions[lang]}
              </Typography>
            </View>
          ) : filteredSessions.length === 0 && allSessions.length === 0 ? (
            <EmptyState
              title={t.noSessionsTitle[lang]}
              description={t.noSessionsDescription[lang]}
              icon="trophy"
              lang={lang}
            />
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              title={t.noResultsTitle[lang]}
              description={t.noResultsDescription[lang]}
              icon="search"
              actionLabel={t.clearFilters[lang]}
              onAction={clearAllFilters}
              lang={lang}
            />
          ) : (
            <View style={{ gap: 0 }}>
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

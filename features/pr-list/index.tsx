import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { prListTranslations } from "@/shared/translations/pr-list";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { EmptyState } from "./elements/empty-state";
import { PRItemDetailed } from "./elements/pr-item-detailed";
import { PRListFilters as PRListFiltersComponent } from "./elements/pr-list-filters";
import { PRListHeader } from "./elements/pr-list-header";
import { PRListSearch } from "./elements/pr-list-search";
import { usePRFilters } from "./hooks/use-pr-filters";
import { usePRList } from "./hooks/use-pr-list";

export const PRListFeature: React.FC = () => {
  const router = useRouter();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = prListTranslations;

  const { data: allPRs, isLoading, error, stats } = usePRList();

  const filtersHook = usePRFilters(allPRs);
  const { filteredPRs, filters, updateFilter, clearAllFilters } = filtersHook;

  const handlePRPress = (exerciseId: string) => {
    router.push(`/pr-detail/${exerciseId}` as any);
  };

  if (error) {
    console.error("[PRListFeature] Error loading data:", error);
  }

  return (
    <ScreenWrapper fullscreen>
      <PRListHeader
        totalPRs={stats.totalPRs}
        recentPRsCount={stats.recentPRs}
        lang={lang}
      />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        <PRListSearch
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter("searchQuery", query)}
          loading={isLoading}
          lang={lang}
        />

        <PRListFiltersComponent
          selectedMuscleGroups={filters.muscleGroups}
          onMuscleGroupToggle={filtersHook.toggleMuscleGroup}
          showRecent={filters.showRecent}
          onShowRecentToggle={() =>
            updateFilter("showRecent", !filters.showRecent)
          }
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
                {t.loadingPRs[lang]}
              </Typography>
            </View>
          ) : filteredPRs.length === 0 && allPRs.length === 0 ? (
            <EmptyState
              title={t.noPRsTitle[lang]}
              description={t.noPRsDescription[lang]}
              icon="trophy"
              lang={lang}
            />
          ) : filteredPRs.length === 0 ? (
            <EmptyState
              title={t.noResultsTitle[lang]}
              description={t.noResultsDescription[lang]}
              icon="search"
              actionLabel={t.clearFilters[lang]}
              onAction={clearAllFilters}
              lang={lang}
            />
          ) : (
            <View style={{ gap: 12 }}>
              {filteredPRs.map((pr) => (
                <PRItemDetailed
                  key={pr.id}
                  pr={pr}
                  onPress={() => handlePRPress(pr.exercise_id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default PRListFeature;

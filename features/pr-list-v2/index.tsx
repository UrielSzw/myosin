import { usePRFilters } from "@/features/pr-list-v2/hooks/use-pr-filters";
import { usePRList } from "@/features/pr-list-v2/hooks/use-pr-list";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { prListTranslations as t } from "@/shared/translations/pr-list";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { AlertCircle, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { EmptyStateV2 } from "./components/EmptyStateV2";
import { PRCardV2 } from "./components/PRCardV2";
import { PRFiltersV2 } from "./components/PRFiltersV2";
import { PRListHeaderV2 } from "./components/PRListHeaderV2";
import { PRSearchBarV2 } from "./components/PRSearchBarV2";

export const PRListFeatureV2: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const { data: allPRs, isLoading, error, stats } = usePRList(user?.id);

  const filtersHook = usePRFilters(allPRs);
  const {
    filteredPRs,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
  } = filtersHook;

  const handlePRPress = (exerciseId: string) => {
    router.push(`/pr-detail/${exerciseId}` as any);
  };

  // Calculate header height (with or without subtitle)
  const hasRecentPRs = stats.recentPRs > 0;
  const headerHeight = insets.top + 8 + 52 + (hasRecentPRs ? 32 : 0) + 16;

  // Authentication check
  if (!user) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <View style={styles.centerContent}>
          <View
            style={[
              styles.errorIconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <AlertCircle size={32} color={colors.primary[500]} />
          </View>
          <Typography variant="h6" weight="semibold" align="center">
            {t.signInRequired[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {lang === "es"
              ? "Necesitas iniciar sesión para ver tus récords"
              : "You need to sign in to view your records"}
          </Typography>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <PRListHeaderV2 totalPRs={0} recentPRsCount={0} lang={lang} />
        <View style={styles.centerContent}>
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.loadingCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 20 : 40}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Trophy size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
            <Typography
              variant="body1"
              weight="medium"
              style={{ color: colors.text }}
            >
              {t.loadingPRs[lang]}
            </Typography>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <PRListHeaderV2 totalPRs={0} recentPRsCount={0} lang={lang} />
        <View style={styles.centerContent}>
          <View
            style={[
              styles.errorIconContainer,
              { backgroundColor: `${colors.error[500]}15` },
            ]}
          >
            <AlertCircle size={32} color={colors.error[500]} />
          </View>
          <Typography variant="h6" weight="semibold" align="center">
            {t.errorLoading[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {error?.message ||
              (lang === "es"
                ? "No se pudieron cargar los récords"
                : "Failed to load records")}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <PRListHeaderV2
        totalPRs={stats.totalPRs}
        recentPRsCount={stats.recentPRs}
        lang={lang}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <PRSearchBarV2
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter("searchQuery", query)}
          lang={lang}
        />

        {/* Filters */}
        <PRFiltersV2
          selectedMuscleGroups={filters.muscleGroups}
          onMuscleGroupToggle={filtersHook.toggleMuscleGroup}
          showRecent={filters.showRecent}
          onShowRecentToggle={() =>
            updateFilter("showRecent", !filters.showRecent)
          }
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
          lang={lang}
        />

        {/* Results Count */}
        {filteredPRs.length > 0 && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Typography
              variant="caption"
              color="textMuted"
              style={styles.resultsCount}
            >
              {filteredPRs.length}{" "}
              {lang === "es"
                ? filteredPRs.length === 1
                  ? "récord encontrado"
                  : "récords encontrados"
                : filteredPRs.length === 1
                ? "record found"
                : "records found"}
            </Typography>
          </Animated.View>
        )}

        {/* PR List or Empty State */}
        {allPRs.length === 0 ? (
          <EmptyStateV2 variant="no-prs" lang={lang} />
        ) : filteredPRs.length === 0 ? (
          <EmptyStateV2
            variant="no-results"
            onClearFilters={clearAllFilters}
            lang={lang}
          />
        ) : (
          <View style={styles.prList}>
            {filteredPRs.map((pr, index) => (
              <PRCardV2
                key={pr.id}
                pr={pr}
                index={index}
                onPress={() => handlePRPress(pr.exercise_id)}
                lang={lang}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingCard: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  resultsCount: {
    marginBottom: 12,
  },
  prList: {
    gap: 12,
  },
});

export default PRListFeatureV2;

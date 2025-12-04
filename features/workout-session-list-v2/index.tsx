import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { workoutSessionListTranslations as t } from "@/shared/translations/workout-session-list";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Re-use hooks from v1
import { useSessionFilters } from "./hooks/use-session-filters";
import { useSessionList } from "./hooks/use-session-list";

// V2 Components
import { SessionCardV2 } from "./components/SessionCardV2";
import { SessionEmptyStateV2 } from "./components/SessionEmptyStateV2";
import { SessionFiltersV2 } from "./components/SessionFiltersV2";
import { SessionListHeaderV2 } from "./components/SessionListHeaderV2";
import { SessionSearchBarV2 } from "./components/SessionSearchBarV2";

export const WorkoutSessionListV2: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Fetch sessions data
  const { data: sessions, isLoading, isError, stats } = useSessionList();

  // Apply filters
  const {
    filters,
    filteredSessions,
    activeFiltersCount,
    updateFilter,
    clearAllFilters,
  } = useSessionFilters(sessions);

  // Calculate header height for scroll padding
  const headerHeight = useMemo(() => {
    const baseHeight = insets.top + 8 + 64; // top inset + padding + header content
    const hasRecentBadge = stats.recentSessions > 0;
    return hasRecentBadge ? baseHeight + 32 : baseHeight;
  }, [insets.top, stats.recentSessions]);

  // Handlers
  const handleSearchChange = (query: string) => {
    updateFilter("searchQuery", query);
  };

  const handleShowRecentToggle = () => {
    updateFilter("showRecent", !filters.showRecent);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SessionListHeaderV2
          totalSessions={0}
          recentSessionsCount={0}
          lang={lang}
        />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 12 }}
          >
            {t.loadingSessions[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SessionListHeaderV2
          totalSessions={0}
          recentSessionsCount={0}
          lang={lang}
        />
        <View style={[styles.errorContainer, { paddingTop: headerHeight }]}>
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.85)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 15 : 30}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Typography variant="body1" color="textMuted" align="center">
              {sharedUiTranslations.errorLoadingSessions[lang]}
            </Typography>
          </View>
        </View>
      </View>
    );
  }

  // Empty state (no sessions at all)
  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SessionListHeaderV2
          totalSessions={0}
          recentSessionsCount={0}
          lang={lang}
        />
        <View
          style={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
        >
          <SessionEmptyStateV2 variant="no-sessions" lang={lang} />
        </View>
      </View>
    );
  }

  // Main content with sessions
  return (
    <View style={styles.container}>
      <AuroraBackground />

      {/* Fixed Header */}
      <SessionListHeaderV2
        totalSessions={stats.totalSessions}
        recentSessionsCount={stats.recentSessions}
        lang={lang}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SessionSearchBarV2
          searchQuery={filters.searchQuery}
          onSearchChange={handleSearchChange}
          lang={lang}
        />

        {/* Filters */}
        <SessionFiltersV2
          showRecent={filters.showRecent}
          onShowRecentToggle={handleShowRecentToggle}
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
          lang={lang}
        />

        {/* Results count */}
        <Animated.View entering={FadeIn.duration(300).delay(200)}>
          <Typography
            variant="caption"
            color="textMuted"
            style={styles.resultsCount}
          >
            {filteredSessions.length}{" "}
            {filteredSessions.length === 1
              ? sharedUiTranslations.sessionFound[lang]
              : sharedUiTranslations.sessionsFound[lang]}
          </Typography>
        </Animated.View>

        {/* Sessions List or Empty Results */}
        {filteredSessions.length > 0 ? (
          <View style={styles.sessionsList}>
            {filteredSessions.map((session, index) => (
              <SessionCardV2
                key={session.id}
                session={session}
                index={index}
                lang={lang}
              />
            ))}
          </View>
        ) : (
          <SessionEmptyStateV2
            variant="no-results"
            onClearFilters={clearAllFilters}
            lang={lang}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    overflow: "hidden",
  },
  resultsCount: {
    marginBottom: 12,
  },
  sessionsList: {
    gap: 12,
  },
});

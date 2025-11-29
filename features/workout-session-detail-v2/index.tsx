import { useSessionDetail } from "@/features/workout-session-detail/hooks/use-session-detail";
import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Layers } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionBlockCardV2 } from "./components/SessionBlockCardV2";
import { SessionDetailHeaderV2 } from "./components/SessionDetailHeaderV2";
import { SessionHeroCardV2 } from "./components/SessionHeroCardV2";
import { SessionInsightsV2 } from "./components/SessionInsightsV2";
import { SessionMuscleDistributionV2 } from "./components/SessionMuscleDistributionV2";
import { SessionQuickStatsV2 } from "./components/SessionQuickStatsV2";

type Props = {
  sessionId: string;
};

export const WorkoutSessionDetailV2: React.FC<Props> = ({ sessionId }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  const {
    data: sessionData,
    analytics,
    isLoading,
    error,
  } = useSessionDetail(sessionId);

  // Calculate header height for scroll padding
  const headerHeight = useMemo(() => {
    return insets.top + 8 + 64;
  }, [insets.top]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SessionDetailHeaderV2
          routineName={lang === "es" ? "Cargando..." : "Loading..."}
          date={new Date().toISOString()}
          lang={lang}
        />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 12 }}
          >
            {lang === "es" ? "Cargando sesión..." : "Loading session..."}
          </Typography>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !sessionData) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SessionDetailHeaderV2
          routineName={lang === "es" ? "Error" : "Error"}
          date={new Date().toISOString()}
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
            <Typography variant="h6" weight="semibold" align="center">
              {lang === "es"
                ? "Error al cargar sesión"
                : "Error loading session"}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={{ marginTop: 8 }}
            >
              {lang === "es"
                ? "No se pudo cargar la información de esta sesión"
                : "Could not load this session information"}
            </Typography>
          </View>
        </View>
      </View>
    );
  }

  // Calculate completion rate
  const completionRate = Math.round(
    (sessionData.total_sets_completed / sessionData.total_sets_planned) * 100
  );
  const isCompleted = completionRate === 100;

  // Check if any exercise has RPE
  const showRpe = sessionData.average_rpe !== null;

  return (
    <View style={styles.container}>
      <AuroraBackground />

      {/* Fixed Header */}
      <SessionDetailHeaderV2
        routineName={sessionData.routine.name}
        date={sessionData.started_at}
        lang={lang}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card with Progress Ring */}
        <SessionHeroCardV2
          completionRate={completionRate}
          completedSets={sessionData.total_sets_completed}
          totalSets={sessionData.total_sets_planned}
          duration={formatDuration(sessionData.total_duration_seconds)}
          isCompleted={isCompleted}
          lang={lang}
        />

        {/* Quick Stats */}
        <SessionQuickStatsV2
          duration={formatDuration(sessionData.total_duration_seconds)}
          totalSets={sessionData.total_sets_completed}
          totalVolume={analytics?.totalVolume || 0}
          lang={lang}
        />

        {/* Insights (RPE, Best Set, PRs) */}
        {analytics && <SessionInsightsV2 analytics={analytics} lang={lang} />}

        {/* Muscle Distribution */}
        {analytics && analytics.muscleGroupVolume.length > 0 && (
          <SessionMuscleDistributionV2
            muscleGroups={analytics.muscleGroupVolume}
            lang={lang}
          />
        )}

        {/* Section Title for Exercises */}
        <View style={styles.sectionTitle}>
          <Layers size={16} color={colors.primary[500]} />
          <Typography
            variant="body1"
            weight="semibold"
            style={{ color: colors.text, marginLeft: 8 }}
          >
            {lang === "es" ? "Ejercicios" : "Exercises"}
          </Typography>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginLeft: "auto" }}
          >
            {sessionData.blocks.length}{" "}
            {sessionData.blocks.length === 1
              ? lang === "es"
                ? "bloque"
                : "block"
              : lang === "es"
              ? "bloques"
              : "blocks"}
          </Typography>
        </View>

        {/* Exercise Blocks */}
        {sessionData.blocks.map((block, index) => (
          <SessionBlockCardV2
            key={block.id}
            block={block}
            index={index}
            showRpe={showRpe}
            lang={lang}
          />
        ))}
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
    padding: 32,
    overflow: "hidden",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
});

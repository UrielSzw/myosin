import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { AlertCircle, RefreshCw } from "lucide-react-native";
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
import {
  CategoryHeader,
  EmptyState,
  PathCard,
  ProgressionPathsHeader,
} from "./components";
import { useProgressionPaths } from "./hooks";
import type { ProgressionPath } from "./types";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  signInRequired: {
    es: "Inicia sesión para ver tus progresiones",
    en: "Sign in to see your progressions",
  },
  loading: {
    es: "Cargando progresiones...",
    en: "Loading progressions...",
  },
  error: {
    es: "Error al cargar progresiones",
    en: "Error loading progressions",
  },
  tapToRetry: {
    es: "Toca para reintentar",
    en: "Tap to retry",
  },
};

// ============================================================================
// Component
// ============================================================================

export const ProgressionPathsFeatureV2: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  const { paths, isLoading, error, refresh } = useProgressionPaths();

  // Group paths by category
  const groupedPaths = useMemo(() => {
    const groups: { category: string; paths: ProgressionPath[] }[] = [];
    let currentCategory = "";

    paths.forEach((path) => {
      if (path.category !== currentCategory) {
        currentCategory = path.category;
        groups.push({ category: currentCategory, paths: [] });
      }
      const lastGroup = groups[groups.length - 1];
      if (lastGroup) {
        lastGroup.paths.push(path);
      }
    });

    return groups;
  }, [paths]);

  // Stats
  const completedPaths = paths.filter(
    (p) => p.currentLevel === p.maxLevel
  ).length;

  // Handlers
  const handleBack = () => {
    router.back();
  };

  const handlePathPress = (path: ProgressionPath) => {
    router.push({
      pathname: "/progression-paths/[pathId]",
      params: {
        pathId: path.pathId,
        pathData: JSON.stringify(path),
      },
    } as never);
  };

  // ============================================================================
  // Render: Auth Check
  // ============================================================================
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
            {sharedUiTranslations.needToSignIn[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // ============================================================================
  // Render: Loading
  // ============================================================================
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <ProgressionPathsHeader
          onBack={handleBack}
          pathsCount={0}
          completedPaths={0}
        />
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
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginTop: 12 }}
            >
              {t.loading[lang]}
            </Typography>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ============================================================================
  // Render: Error
  // ============================================================================
  if (error) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <ProgressionPathsHeader
          onBack={handleBack}
          pathsCount={0}
          completedPaths={0}
        />
        <View style={styles.centerContent}>
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.errorCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
              },
            ]}
          >
            <View
              style={[
                styles.errorIconContainer,
                { backgroundColor: `${colors.error[500]}15` },
              ]}
            >
              <RefreshCw size={28} color={colors.error[500]} />
            </View>
            <Typography
              variant="body1"
              weight="semibold"
              align="center"
              style={{ marginTop: 16 }}
            >
              {t.error[lang]}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={{ marginTop: 8 }}
              onPress={refresh}
            >
              {t.tapToRetry[lang]}
            </Typography>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ============================================================================
  // Render: Empty
  // ============================================================================
  if (paths.length === 0) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <ProgressionPathsHeader
          onBack={handleBack}
          pathsCount={0}
          completedPaths={0}
        />
        <EmptyState />
      </View>
    );
  }

  // ============================================================================
  // Render: Main Content
  // ============================================================================
  return (
    <View style={styles.container}>
      <AuroraBackground />

      <ProgressionPathsHeader
        onBack={handleBack}
        pathsCount={paths.length}
        completedPaths={completedPaths}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {groupedPaths.map((group, groupIndex) => (
          <View key={group.category}>
            <CategoryHeader category={group.category} />
            {group.paths.map((path, pathIndex) => (
              <View key={path.pathId} style={styles.cardContainer}>
                <PathCard
                  path={path}
                  index={groupIndex * 10 + pathIndex}
                  onPress={handlePathPress}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 20,
    overflow: "hidden",
  },
  errorCard: {
    alignItems: "center",
    padding: 32,
    borderRadius: 20,
  },
  errorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    paddingHorizontal: 0,
  },
});

export default ProgressionPathsFeatureV2;

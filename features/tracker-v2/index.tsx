import { toSupportedLanguage } from "@/shared/types/language";
import { MainMetric } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { trackerTranslations } from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { BlurView } from "expo-blur";
import { AlertCircle, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { EmptyMetricsV2 } from "./components/EmptyMetricsV2";
import { MacroCardV2 } from "./components/MacroCardV2";
import { MetricCardV2 } from "./components/MetricCardV2";
import { MetricModalV2 } from "./components/MetricModalV2";
import { MetricSelectorModalV2 } from "./components/MetricSelectorModalV2";
import { TrackerHeaderV2 } from "./components/TrackerHeaderV2";
import { WeekStripV2 } from "./components/WeekStripV2";
import { useDayData } from "./hooks/use-tracker-data";

export const TrackerFeatureV2 = () => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = trackerTranslations;

  // UI State
  const [metricSelectorVisible, setMetricSelectorVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => getDayKey());
  const [selectedMetric, setSelectedMetric] = useState<MainMetric | null>(null);

  // Data fetching
  const {
    data: dayData,
    isLoading: dayDataLoading,
    error: dayDataError,
  } = useDayData(selectedDate, user?.id || "");

  const handleAddMetric = () => {
    setMetricSelectorVisible(true);
  };

  // Authentication check
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            {t.authRequired[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {t.authDescription[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Loading state
  if (dayDataLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AuroraBackground />
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
            <Typography
              variant="body1"
              weight="medium"
              style={{ color: colors.text }}
            >
              {t.loading[lang]}
            </Typography>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Error state
  if (dayDataError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            {t.errorLoading[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {dayDataError?.message || t.unexpectedError[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Calculate header height
  const headerHeight = insets.top + 8 + 60 + 20;

  return (
    <View style={styles.container}>
      <AuroraBackground />

      {/* Header */}
      <TrackerHeaderV2 selectedDate={selectedDate} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Strip */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <WeekStripV2
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            userId={user.id}
            lang={lang}
          />
        </Animated.View>

        {/* Macros Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <MacroCardV2 selectedDate={selectedDate} lang={lang} />
        </Animated.View>

        {/* Metrics Section */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={styles.metricsSection}
        >
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {t.dailyMetrics[lang]}
            </Typography>

            <Pressable
              onPress={handleAddMetric}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Plus size={18} color={colors.primary[500]} />
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: colors.primary[500] }}
              >
                {t.add[lang]}
              </Typography>
            </Pressable>
          </View>

          {/* Metrics Grid */}
          {dayData && dayData.metrics.length > 0 ? (
            <View style={styles.metricsGrid}>
              {dayData.metrics.map((metric, index) => (
                <Animated.View
                  key={metric.id}
                  entering={FadeInDown.duration(300).delay(400 + index * 50)}
                  style={styles.metricCardWrapper}
                >
                  <MetricCardV2
                    metric={metric}
                    date={selectedDate}
                    onPress={() => setSelectedMetric(metric)}
                    lang={lang}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <EmptyMetricsV2 onAddMetric={handleAddMetric} lang={lang} />
          )}
        </Animated.View>
      </ScrollView>

      {/* Modals */}
      <MetricModalV2
        selectedDate={selectedDate}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        lang={lang}
      />

      <MetricSelectorModalV2
        visible={metricSelectorVisible}
        onClose={() => setMetricSelectorVisible(false)}
        lang={lang}
      />
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
    gap: 16,
  },
  errorIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  loadingCard: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  metricsSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCardWrapper: {
    width: "48%",
  },
});

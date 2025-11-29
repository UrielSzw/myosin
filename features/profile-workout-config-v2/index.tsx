import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations as t } from "@/shared/translations/profile";
import { Typography } from "@/shared/ui/typography";
import {
  Activity,
  Clock,
  Smartphone,
  Timer,
  Vibrate,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { RestTimeSheetV2 } from "./components/RestTimeSheetV2";
import { SegmentedControlCard } from "./components/SegmentedControlCard";
import { ToggleSettingCard } from "./components/ToggleSettingCard";
import { WorkoutConfigHeader } from "./components/WorkoutConfigHeader";

export const ProfileWorkoutConfigFeatureV2 = () => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const {
    setUnit,
    setDistanceUnit,
    setShowRpe,
    setShowTempo,
    setKeepScreenAwake,
    setHapticFeedback,
    setDefaultRestTime,
  } = useUserPreferencesActions();

  const unit = prefs?.weight_unit ?? "kg";
  const distUnit = prefs?.distance_unit ?? "metric";
  const rpeEnabled = prefs?.show_rpe ?? false;
  const tempoEnabled = prefs?.show_tempo ?? false;
  const keepScreenAwake = prefs?.keep_screen_awake ?? true;
  const hapticEnabled = prefs?.haptic_feedback_enabled ?? true;
  const defaultRestTime = prefs?.default_rest_time_seconds ?? 60;

  const [showRestTimeSheet, setShowRestTimeSheet] = useState(false);

  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate header height for padding
  const headerHeight = insets.top + 8 + 24;

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <WorkoutConfigHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + 16,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Units Section */}
        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
          <Typography
            variant="caption"
            weight="semibold"
            style={{
              color: colors.textMuted,
              marginBottom: 12,
              marginLeft: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t.unitsSection[lang]}
          </Typography>
        </Animated.View>

        <SegmentedControlCard
          title={t.weightUnitTitle[lang]}
          subtitle={t.weightUnitSubtitle[lang]}
          options={[
            { value: "kg", label: "kg" },
            { value: "lbs", label: "lbs" },
          ]}
          selectedValue={unit}
          onSelect={(value) => {
            if (user?.id) setUnit(user.id, value as "kg" | "lbs");
          }}
          delay={150}
        />

        <SegmentedControlCard
          title={t.distanceUnitTitle[lang]}
          subtitle={t.distanceUnitSubtitle[lang]}
          options={[
            { value: "metric", label: t.metricLabel[lang] },
            { value: "imperial", label: "Imperial" },
          ]}
          selectedValue={distUnit}
          onSelect={(value) => {
            if (user?.id)
              setDistanceUnit(user.id, value as "metric" | "imperial");
          }}
          delay={200}
        />

        {/* Workout Preferences Section */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(250)}
          style={{ marginTop: 28 }}
        >
          <Typography
            variant="caption"
            weight="semibold"
            style={{
              color: colors.textMuted,
              marginBottom: 12,
              marginLeft: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t.workoutPreferencesSection[lang]}
          </Typography>
        </Animated.View>

        <ToggleSettingCard
          icon={Activity}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.15)"
          title={t.rpeTitle[lang]}
          subtitle={t.rpeSubtitle[lang]}
          value={rpeEnabled}
          onValueChange={(v) => {
            if (user?.id) setShowRpe(user.id, v);
          }}
          delay={300}
        />

        <ToggleSettingCard
          icon={Timer}
          iconColor="#8b5cf6"
          iconBgColor="rgba(139, 92, 246, 0.15)"
          title={t.tempoTitle[lang]}
          subtitle={t.tempoSubtitle[lang]}
          value={tempoEnabled}
          onValueChange={(v) => {
            if (user?.id) setShowTempo(user.id, v);
          }}
          delay={350}
        />

        <ToggleSettingCard
          icon={Clock}
          iconColor="#f59e0b"
          iconBgColor="rgba(245, 158, 11, 0.15)"
          title={t.defaultRestTimeTitle[lang]}
          subtitle={t.defaultRestTimeSubtitle[lang]}
          onPress={() => setShowRestTimeSheet(true)}
          rightLabel={formatRestTime(defaultRestTime)}
          delay={400}
        />

        {/* Device Settings Section */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(450)}
          style={{ marginTop: 28 }}
        >
          <Typography
            variant="caption"
            weight="semibold"
            style={{
              color: colors.textMuted,
              marginBottom: 12,
              marginLeft: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t.deviceSection[lang]}
          </Typography>
        </Animated.View>

        <ToggleSettingCard
          icon={Smartphone}
          iconColor="#0ea5e9"
          iconBgColor="rgba(14, 165, 233, 0.15)"
          title={t.keepScreenAwakeTitle[lang]}
          subtitle={t.keepScreenAwakeSubtitle[lang]}
          value={keepScreenAwake}
          onValueChange={(v) => {
            if (user?.id) setKeepScreenAwake(user.id, v);
          }}
          delay={500}
        />

        <ToggleSettingCard
          icon={Vibrate}
          iconColor="#ec4899"
          iconBgColor="rgba(236, 72, 153, 0.15)"
          title={t.hapticFeedbackTitle[lang]}
          subtitle={t.hapticFeedbackSubtitle[lang]}
          value={hapticEnabled}
          onValueChange={(v) => {
            if (user?.id) setHapticFeedback(user.id, v);
          }}
          delay={550}
        />
      </ScrollView>

      {/* Rest Time Sheet */}
      <RestTimeSheetV2
        visible={showRestTimeSheet}
        currentValue={defaultRestTime}
        onSelect={(seconds) => {
          if (user?.id) setDefaultRestTime(user.id, seconds);
        }}
        onClose={() => setShowRestTimeSheet(false)}
      />
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
  content: {
    paddingHorizontal: 20,
  },
});

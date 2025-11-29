import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { personalDataTranslations as t } from "@/shared/translations/personal-data";
import { Typography } from "@/shared/ui/typography";
import { Activity, Ruler, Target, Weight } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { ActivityLevelSheet } from "./components/ActivityLevelSheet";
import { FitnessGoalSheet } from "./components/FitnessGoalSheet";
import { HeightSheet } from "./components/HeightSheet";
import { PersonalDataHeader } from "./components/PersonalDataHeader";
import { SettingCard } from "./components/SettingCard";
import { WeightSheet } from "./components/WeightSheet";

const ProfilePersonalDataFeatureV2 = () => {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const [showWeightSheet, setShowWeightSheet] = useState(false);
  const [showHeightSheet, setShowHeightSheet] = useState(false);
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [showActivitySheet, setShowActivitySheet] = useState(false);

  // Get current values
  const currentWeight = prefs?.initial_weight_kg;
  const currentHeight = prefs?.height_cm;
  const currentGoal = prefs?.fitness_goal;
  const currentActivity = prefs?.activity_level;
  const unit = prefs?.weight_unit ?? "kg";

  // Format weight display
  const formatWeight = (kg: number | null | undefined) => {
    if (!kg) return t.notSet[lang];
    if (unit === "lbs") {
      return `${Math.round(kg * 2.205)} lbs`;
    }
    return `${kg} kg`;
  };

  // Format height display
  const formatHeight = (cm: number | null | undefined) => {
    if (!cm) return t.notSet[lang];
    const distUnit = prefs?.distance_unit ?? "metric";
    if (distUnit === "imperial") {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${cm} cm`;
  };

  // Get goal label
  const getGoalLabel = (goal: string | null | undefined) => {
    if (!goal) return t.notSet[lang];
    const goalKey = goal as keyof typeof t.goals;
    return t.goals[goalKey]?.title[lang] ?? goal;
  };

  // Get activity label
  const getActivityLabel = (level: string | null | undefined) => {
    if (!level) return t.notSet[lang];
    const levelKey = level as keyof typeof t.activityLevels;
    return t.activityLevels[levelKey]?.title[lang] ?? level;
  };

  // Calculate header height
  const headerHeight = insets.top + 8 + 60 + 20;

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <PersonalDataHeader />

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
        {/* Body Measurements Section */}
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
            {t.bodyMeasurementsSection[lang]}
          </Typography>
        </Animated.View>

        <SettingCard
          icon={Weight}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.15)"
          title={t.weightTitle[lang]}
          subtitle={t.weightSubtitle[lang]}
          value={formatWeight(currentWeight)}
          onPress={() => setShowWeightSheet(true)}
          delay={150}
        />

        <SettingCard
          icon={Ruler}
          iconColor="#8b5cf6"
          iconBgColor="rgba(139, 92, 246, 0.15)"
          title={t.heightTitle[lang]}
          subtitle={t.heightSubtitle[lang]}
          value={formatHeight(currentHeight)}
          onPress={() => setShowHeightSheet(true)}
          delay={200}
        />

        {/* Goals Section */}
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
            {t.goalsActivitySection[lang]}
          </Typography>
        </Animated.View>

        <SettingCard
          icon={Target}
          iconColor="#f59e0b"
          iconBgColor="rgba(245, 158, 11, 0.15)"
          title={t.fitnessGoalTitle[lang]}
          subtitle={t.fitnessGoalSubtitle[lang]}
          value={getGoalLabel(currentGoal)}
          onPress={() => setShowGoalSheet(true)}
          delay={300}
        />

        <SettingCard
          icon={Activity}
          iconColor="#0ea5e9"
          iconBgColor="rgba(14, 165, 233, 0.15)"
          title={t.activityLevelTitle[lang]}
          subtitle={t.activityLevelSubtitle[lang]}
          value={getActivityLabel(currentActivity)}
          onPress={() => setShowActivitySheet(true)}
          delay={350}
        />
      </ScrollView>

      {/* Sheets */}
      <WeightSheet
        visible={showWeightSheet}
        currentValue={currentWeight}
        onClose={() => setShowWeightSheet(false)}
      />

      <HeightSheet
        visible={showHeightSheet}
        currentValue={currentHeight}
        onClose={() => setShowHeightSheet(false)}
      />

      <FitnessGoalSheet
        visible={showGoalSheet}
        currentValue={currentGoal}
        onClose={() => setShowGoalSheet(false)}
      />

      <ActivityLevelSheet
        visible={showActivitySheet}
        currentValue={currentActivity}
        onClose={() => setShowActivitySheet(false)}
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

export default ProfilePersonalDataFeatureV2;

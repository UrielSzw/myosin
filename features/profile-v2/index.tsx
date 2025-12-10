import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations as t } from "@/shared/translations/profile";
import { toSupportedLanguage } from "@/shared/types/language";
import { router } from "expo-router";
import {
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  RefreshCw,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { LanguageSelectorSheetV2 } from "./components/LanguageSelectorSheetV2";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileHeroCard } from "./components/ProfileHeroCard";
import { SettingItemV2, SettingSectionV2 } from "./components/SettingItemV2";

export const ProfileFeatureV2 = () => {
  const { colors, isDarkMode, setColorScheme } = useColorScheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const handleModeChange = (value: boolean) => {
    if (user?.id) {
      setColorScheme(user.id, value ? "dark" : "light");
    }
  };

  const handleLogout = () => {
    Alert.alert(t.logoutAlertTitle[lang], t.logoutAlertMessage[lang], [
      {
        text: t.logoutAlertCancel[lang],
        style: "cancel",
      },
      {
        text: t.logoutAlertConfirm[lang],
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const handleNavigateWorkoutConfig = () => {
    router.push("/profile/workout-config");
  };

  const handleNavigatePersonalData = () => {
    router.push("/profile/personal-data" as never);
  };

  const handleNavigateSyncStatus = () => {
    router.push("/profile/sync-status" as never);
  };

  const handleNavigateProgressionPaths = () => {
    router.push("/progression-paths" as never);
  };

  // Calculate header height for padding
  const headerHeight = insets.top + 8 + 40 + 24; // top inset + padding + button + padding

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <ProfileHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <ProfileHeroCard />

        {/* Settings Sections */}
        <View style={styles.sectionsContainer}>
          {/* Preferences */}
          <SettingSectionV2 title={t.preferencesSection[lang]} delay={600}>
            <SettingItemV2
              icon={Globe}
              iconColor="#8b5cf6"
              iconBgColor="rgba(139, 92, 246, 0.15)"
              title={t.language[lang]}
              subtitle={t.currentLanguageName[lang]}
              onPress={() => setShowLanguageSheet(true)}
              delay={650}
            />
            <SettingItemV2
              icon={isDarkMode ? Moon : Sun}
              iconColor="#f59e0b"
              iconBgColor="rgba(245, 158, 11, 0.15)"
              title={t.darkMode[lang]}
              subtitle={t.darkModeSubtitle[lang]}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={handleModeChange}
                  trackColor={{
                    false: colors.gray[300],
                    true: colors.primary[500],
                  }}
                  thumbColor="#ffffff"
                />
              }
              delay={700}
            />
          </SettingSectionV2>

          {/* Training */}
          <SettingSectionV2 title={t.trainingSection[lang]} delay={750}>
            <SettingItemV2
              icon={Settings}
              iconColor="#10b981"
              iconBgColor="rgba(16, 185, 129, 0.15)"
              title={t.workoutConfig[lang]}
              subtitle={t.workoutConfigSubtitle[lang]}
              onPress={handleNavigateWorkoutConfig}
              delay={800}
            />
            <SettingItemV2
              icon={User}
              iconColor="#0ea5e9"
              iconBgColor="rgba(14, 165, 233, 0.15)"
              title={t.personalData[lang]}
              subtitle={t.personalDataSubtitle[lang]}
              onPress={handleNavigatePersonalData}
              delay={850}
            />
            <SettingItemV2
              icon={TrendingUp}
              iconColor="#8b5cf6"
              iconBgColor="rgba(139, 92, 246, 0.15)"
              title={t.progressionPaths[lang]}
              subtitle={t.progressionPathsSubtitle[lang]}
              onPress={handleNavigateProgressionPaths}
              delay={875}
            />
          </SettingSectionV2>

          {/* Support */}
          <SettingSectionV2 title={t.supportSection[lang]} delay={900}>
            <SettingItemV2
              icon={RefreshCw}
              iconColor="#10b981"
              iconBgColor="rgba(16, 185, 129, 0.15)"
              title={t.syncStatus[lang]}
              subtitle={t.syncStatusSubtitle[lang]}
              onPress={handleNavigateSyncStatus}
              delay={950}
            />
            <SettingItemV2
              icon={HelpCircle}
              iconColor="#6366f1"
              iconBgColor="rgba(99, 102, 241, 0.15)"
              title={t.helpFaq[lang]}
              subtitle={t.helpFaqSubtitle[lang]}
              onPress={() => {}}
              delay={1000}
            />
            <SettingItemV2
              icon={Shield}
              iconColor="#ec4899"
              iconBgColor="rgba(236, 72, 153, 0.15)"
              title={t.privacy[lang]}
              subtitle={t.privacySubtitle[lang]}
              onPress={() => {}}
              delay={1050}
            />
          </SettingSectionV2>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <SettingItemV2
              icon={LogOut}
              iconColor={colors.error[500]}
              iconBgColor={`${colors.error[500]}15`}
              title={t.logout[lang]}
              onPress={handleLogout}
              isDestructive
              delay={1100}
            />
          </View>
        </View>
      </ScrollView>

      {/* Language Sheet */}
      <LanguageSelectorSheetV2
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
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
    paddingHorizontal: 0,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  logoutSection: {
    marginTop: 8,
  },
});

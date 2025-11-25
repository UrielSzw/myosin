import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useUserProfile } from "@/shared/hooks/use-user-profile";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations } from "@/shared/translations/profile";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { LanguageSelectorItem } from "@/shared/ui/language-selector-sheet";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  HelpCircle,
  LogOut,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { Alert, ScrollView, Switch, View } from "react-native";
import { ProfileSection } from "../../shared/ui/profile-section";
import { SettingItem } from "../../shared/ui/setting-item";
import { LanguageSelectorSheet } from "./elements/language-selector-sheet";

export const ProfileFeature = () => {
  const { user, signOut } = useAuth();
  const { setColorScheme, colors, isDarkMode } = useColorScheme();
  const { profile } = useUserProfile(user);

  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = profileTranslations;

  const languageSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenLanguageSheet = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

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

  const handleModeChange = (value: boolean) => {
    if (user?.id) {
      setColorScheme(user.id, value ? "dark" : "light");
    }
  };

  const handleNavigateWorkoutConfig = () => {
    router.push("/profile/workout-config");
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const getMemberSince = () => {
    if (!user?.created_at) return `${t.memberSince[lang]} 2025`;
    const date = new Date(user.created_at);
    const monthNames = t.monthNames[lang];
    return `${t.memberSince[lang]} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  return (
    <ScreenWrapper withGradient fullscreen>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 32 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
            {t.title[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {t.subtitle[lang]}
          </Typography>
        </View>

        <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
          <View style={{ alignItems: "center" }}>
            {/* Avatar with subtle glow */}
            <View
              style={{
                shadowColor: profile.avatarColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 8,
                marginBottom: 12,
              }}
            >
              <Avatar
                name={profile.displayName ?? undefined}
                email={user?.email}
                color={profile.avatarColor}
                size={120}
              />
            </View>

            {/* Name - larger and closer */}
            <Typography
              variant="h3"
              weight="bold"
              style={{ marginBottom: 6, letterSpacing: 0.5 }}
            >
              {profile.displayName ||
                user?.email?.split("@")[0] ||
                t.defaultUserName[lang]}
            </Typography>

            {/* Email - smaller and more subtle */}
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 12, opacity: 0.7 }}
            >
              {user?.email || t.defaultEmail[lang]}
            </Typography>

            {/* Member since badge */}
            <View
              style={{
                backgroundColor: colors.primary[500] + "20",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Typography
                variant="caption"
                style={{ color: colors.primary[400], fontSize: 11 }}
              >
                {getMemberSince()}
              </Typography>
            </View>

            {/* Subtle edit button */}
            <Button variant="ghost" size="sm" onPress={handleEditProfile}>
              {t.editProfile[lang]}
            </Button>
          </View>
        </Card>

        <ProfileSection title={t.preferencesSection[lang]}>
          <LanguageSelectorItem onPress={handleOpenLanguageSheet} />

          <SettingItem
            icon={
              isDarkMode ? (
                <Moon size={20} color={colors.textMuted} />
              ) : (
                <Sun size={20} color={colors.textMuted} />
              )
            }
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
          />
        </ProfileSection>

        {/* Training */}
        <ProfileSection title={t.trainingSection[lang]}>
          <SettingItem
            icon={<Settings size={20} color={colors.textMuted} />}
            title={t.workoutConfig[lang]}
            subtitle={t.workoutConfigSubtitle[lang]}
            onPress={handleNavigateWorkoutConfig}
          />

          <SettingItem
            icon={<User size={20} color={colors.textMuted} />}
            title={t.personalData[lang]}
            subtitle={t.personalDataSubtitle[lang]}
            onPress={() => {}}
          />
        </ProfileSection>

        <ProfileSection title={t.supportSection[lang]}>
          <SettingItem
            icon={<HelpCircle size={20} color={colors.textMuted} />}
            title={t.helpFaq[lang]}
            subtitle={t.helpFaqSubtitle[lang]}
            onPress={() => {}}
          />

          <SettingItem
            icon={<Shield size={20} color={colors.textMuted} />}
            title={t.privacy[lang]}
            subtitle={t.privacySubtitle[lang]}
            onPress={() => {}}
          />
        </ProfileSection>

        <View style={{ marginBottom: 32 }}>
          <SettingItem
            icon={<LogOut size={20} color={colors.error[500]} />}
            title={t.logout[lang]}
            onPress={handleLogout}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <LanguageSelectorSheet ref={languageSheetRef} />
    </ScreenWrapper>
  );
};

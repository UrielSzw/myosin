import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { router } from "expo-router";
import {
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Settings,
  Shield,
  Sun,
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
  const lang = prefs?.language ?? "es";

  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const handleModeChange = (value: boolean) => {
    if (user?.id) {
      setColorScheme(user.id, value ? "dark" : "light");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      lang === "es" ? "Cerrar Sesión" : "Sign Out",
      lang === "es"
        ? "¿Estás seguro que quieres cerrar sesión?"
        : "Are you sure you want to sign out?",
      [
        {
          text: lang === "es" ? "Cancelar" : "Cancel",
          style: "cancel",
        },
        {
          text: lang === "es" ? "Cerrar Sesión" : "Sign Out",
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
  };

  const handleNavigateWorkoutConfig = () => {
    router.push("/profile/workout-config");
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
          <SettingSectionV2
            title={lang === "es" ? "Preferencias" : "Preferences"}
            delay={600}
          >
            <SettingItemV2
              icon={Globe}
              iconColor="#8b5cf6"
              iconBgColor="rgba(139, 92, 246, 0.15)"
              title={lang === "es" ? "Idioma" : "Language"}
              subtitle={lang === "es" ? "Español" : "English"}
              onPress={() => setShowLanguageSheet(true)}
              delay={650}
            />
            <SettingItemV2
              icon={isDarkMode ? Moon : Sun}
              iconColor="#f59e0b"
              iconBgColor="rgba(245, 158, 11, 0.15)"
              title={lang === "es" ? "Modo Oscuro" : "Dark Mode"}
              subtitle={
                lang === "es"
                  ? "Cambia el tema de la aplicación"
                  : "Change the app theme"
              }
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
          <SettingSectionV2
            title={lang === "es" ? "Entrenamiento" : "Training"}
            delay={750}
          >
            <SettingItemV2
              icon={Settings}
              iconColor="#10b981"
              iconBgColor="rgba(16, 185, 129, 0.15)"
              title={
                lang === "es"
                  ? "Configuración de Entrenamiento"
                  : "Workout Configuration"
              }
              subtitle={
                lang === "es" ? "Unidades, RPE, Tempo" : "Units, RPE, Tempo"
              }
              onPress={handleNavigateWorkoutConfig}
              delay={800}
            />
            <SettingItemV2
              icon={User}
              iconColor="#0ea5e9"
              iconBgColor="rgba(14, 165, 233, 0.15)"
              title={lang === "es" ? "Datos Personales" : "Personal Data"}
              subtitle={
                lang === "es"
                  ? "Peso, altura, nivel de experiencia"
                  : "Weight, height, experience level"
              }
              onPress={() => {}}
              delay={850}
            />
          </SettingSectionV2>

          {/* Support */}
          <SettingSectionV2
            title={lang === "es" ? "Soporte" : "Support"}
            delay={900}
          >
            <SettingItemV2
              icon={HelpCircle}
              iconColor="#6366f1"
              iconBgColor="rgba(99, 102, 241, 0.15)"
              title={
                lang === "es" ? "Ayuda y Preguntas Frecuentes" : "Help & FAQ"
              }
              subtitle={
                lang === "es"
                  ? "¿Necesitas ayuda? Encuentra respuestas aquí"
                  : "Need help? Find answers here"
              }
              onPress={() => {}}
              delay={950}
            />
            <SettingItemV2
              icon={Shield}
              iconColor="#ec4899"
              iconBgColor="rgba(236, 72, 153, 0.15)"
              title={
                lang === "es" ? "Privacidad y Seguridad" : "Privacy & Security"
              }
              subtitle={
                lang === "es"
                  ? "Gestiona tu privacidad y datos"
                  : "Manage your privacy and data"
              }
              onPress={() => {}}
              delay={1000}
            />
          </SettingSectionV2>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <SettingItemV2
              icon={LogOut}
              iconColor={colors.error[500]}
              iconBgColor={`${colors.error[500]}15`}
              title={lang === "es" ? "Cerrar Sesión" : "Sign Out"}
              onPress={handleLogout}
              isDestructive
              delay={1050}
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

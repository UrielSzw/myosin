import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserProfile } from "@/shared/hooks/use-user-profile";
import { useAuth } from "@/shared/providers/auth-provider";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
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
import React from "react";
import { Alert, ScrollView, Switch, View } from "react-native";
import { ProfileSection } from "../../shared/ui/profile-section";
import { SettingItem } from "../../shared/ui/setting-item";

export const ProfileFeature = () => {
  const { user, signOut } = useAuth();
  const { setColorScheme, colors, isDarkMode } = useColorScheme();
  const { profile } = useUserProfile(user);

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar Sesión",
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
    if (!user?.created_at) return "Miembro desde 2025";
    const date = new Date(user.created_at);
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `Miembro desde ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <ScreenWrapper withGradient fullscreen>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 32 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
            Mi Perfil
          </Typography>
          <Typography variant="body2" color="textMuted">
            Configuración y estadísticas personales
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
              {profile.displayName || user?.email?.split("@")[0] || "Usuario"}
            </Typography>

            {/* Email - smaller and more subtle */}
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 12, opacity: 0.7 }}
            >
              {user?.email || "usuario@ejemplo.com"}
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
              Editar Perfil
            </Button>
          </View>
        </Card>

        <ProfileSection title="Preferencias">
          <SettingItem
            icon={
              isDarkMode ? (
                <Moon size={20} color={colors.textMuted} />
              ) : (
                <Sun size={20} color={colors.textMuted} />
              )
            }
            title="Modo Oscuro"
            subtitle="Cambia el tema de la aplicación"
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
        <ProfileSection title="Entrenamiento">
          <SettingItem
            icon={<Settings size={20} color={colors.textMuted} />}
            title="Configuración de Entrenamiento"
            subtitle="Unidades, RPE, Tempo"
            onPress={handleNavigateWorkoutConfig}
          />

          <SettingItem
            icon={<User size={20} color={colors.textMuted} />}
            title="Datos Personales"
            subtitle="Peso, altura, nivel de experiencia"
            onPress={() => {}}
          />
        </ProfileSection>

        <ProfileSection title="Soporte">
          <SettingItem
            icon={<HelpCircle size={20} color={colors.textMuted} />}
            title="Ayuda y Preguntas Frecuentes"
            subtitle="¿Necesitas ayuda? Encuentra respuestas aquí"
            onPress={() => {}}
          />

          <SettingItem
            icon={<Shield size={20} color={colors.textMuted} />}
            title="Privacidad y Seguridad"
            subtitle="Gestiona tu privacidad y datos"
            onPress={() => {}}
          />
        </ProfileSection>

        <View style={{ marginBottom: 32 }}>
          <SettingItem
            icon={<LogOut size={20} color={colors.error[500]} />}
            title="Cerrar Sesión"
            onPress={handleLogout}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

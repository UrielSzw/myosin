import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSection } from "../../shared/ui/profile-section";
import { SettingItem } from "../../shared/ui/setting-item";

export const ProfileFeature = () => {
  const { user, signOut } = useAuth();
  const { setColorScheme, colors, isDarkMode } = useColorScheme();

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary[500],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <User size={40} color="#ffffff" />
            </View>

            <Typography variant="h4" weight="bold" style={{ marginBottom: 4 }}>
              {"Usuario"}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 4 }}
            >
              {"usuario@ejemplo.com"}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 16 }}
            >
              Miembro desde Enero 2025
            </Typography>

            <Button variant="outline" size="sm">
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
    </SafeAreaView>
  );
};

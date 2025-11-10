import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ProfileSection } from "@/shared/ui/profile-section";
import { SettingItem } from "@/shared/ui/setting-item";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Activity, ArrowLeft, Clock } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileWorkoutConfigFeature: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useColorScheme();

  const prefs = useUserPreferences();
  const { setUnit, setShowRpe, setShowTempo } = useUserPreferencesActions();

  const unit = prefs?.weight_unit ?? "kg";
  const rpeEnabled = !!prefs?.show_rpe;
  const tempoEnabled = !!prefs?.show_tempo;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
        />

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            Configuración de Entrenamiento
          </Typography>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection title="Unidades">
          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="semibold">
                  Unidad de Peso
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Elige tu unidad preferida para pesos
                </Typography>
              </View>

              {/* Segmented control: equal width buttons */}
              <View style={{ width: 160 }}>
                <View
                  style={{
                    flexDirection: "row",
                    borderRadius: 8,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Seleccionar kilogramos"
                    onPress={() => {
                      if (user?.id) setUnit(user.id, "kg");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor:
                        unit === "kg" ? colors.primary[500] : colors.background,
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Typography
                      variant="body2"
                      weight="semibold"
                      style={{ color: unit === "kg" ? "#ffffff" : colors.text }}
                    >
                      kg
                    </Typography>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Seleccionar libras"
                    onPress={() => {
                      if (user?.id) setUnit(user.id, "lbs");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor:
                        unit === "lbs"
                          ? colors.primary[500]
                          : colors.background,
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Typography
                      variant="body2"
                      weight="semibold"
                      style={{
                        color: unit === "lbs" ? "#ffffff" : colors.text,
                      }}
                    >
                      lbs
                    </Typography>
                  </Pressable>
                </View>
              </View>
            </View>
          </Card>
        </ProfileSection>

        <ProfileSection title="Preferencias de Entrenamiento">
          <SettingItem
            icon={
              <Activity
                size={20}
                color={rpeEnabled ? colors.primary[500] : colors.textMuted}
              />
            }
            title="Usar RPE"
            subtitle="Mostrar RPE en las rutinas"
            rightElement={
              <Switch
                value={rpeEnabled}
                onValueChange={(v) => {
                  if (user?.id) setShowRpe(user.id, v);
                }}
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[500],
                }}
                thumbColor="#ffffff"
              />
            }
          />

          <SettingItem
            icon={
              <Clock
                size={20}
                color={tempoEnabled ? colors.primary[500] : colors.textMuted}
              />
            }
            title="Usar Tempo"
            subtitle="Mostrar tempo en las repeticiones"
            rightElement={
              <Switch
                value={tempoEnabled}
                onValueChange={(v) => {
                  if (user?.id) setShowTempo(user.id, v);
                }}
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[500],
                }}
                thumbColor="#ffffff"
              />
            }
          />
        </ProfileSection>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

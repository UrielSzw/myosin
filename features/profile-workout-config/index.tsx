import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations } from "@/shared/translations/profile";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ProfileSection } from "@/shared/ui/profile-section";
import { SettingItem } from "@/shared/ui/setting-item";
import { RestTimeBottomSheet } from "@/shared/ui/sheets/rest-time-sheet";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  Activity,
  ArrowLeft,
  Clock,
  Smartphone,
  Timer,
  Vibrate,
} from "lucide-react-native";
import React, { useRef } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileWorkoutConfigFeature: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useColorScheme();

  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = profileTranslations;
  const tShared = sharedUiTranslations;

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

  const restTimeSheetRef = useRef<BottomSheetModal>(null);

  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
            {t.workoutConfig[lang]}
          </Typography>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection title={t.unitsSection[lang]}>
          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="semibold">
                  {t.weightUnitTitle[lang]}
                </Typography>
                <Typography variant="body2" color="textMuted">
                  {t.weightUnitSubtitle[lang]}
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
                    accessibilityLabel={tShared.selectKilograms[lang]}
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
                    accessibilityLabel={tShared.selectPounds[lang]}
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

          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="semibold">
                  {t.distanceUnitTitle[lang]}
                </Typography>
                <Typography variant="body2" color="textMuted">
                  {t.distanceUnitSubtitle[lang]}
                </Typography>
              </View>

              {/* Segmented control: metric/imperial */}
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
                    accessibilityLabel={tShared.selectMetric[lang]}
                    onPress={() => {
                      if (user?.id) setDistanceUnit(user.id, "metric");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor:
                        distUnit === "metric"
                          ? colors.primary[500]
                          : colors.background,
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Typography
                      variant="body2"
                      weight="semibold"
                      style={{
                        color: distUnit === "metric" ? "#ffffff" : colors.text,
                      }}
                    >
                      {tShared.metric[lang]}
                    </Typography>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={tShared.selectImperial[lang]}
                    onPress={() => {
                      if (user?.id) setDistanceUnit(user.id, "imperial");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor:
                        distUnit === "imperial"
                          ? colors.primary[500]
                          : colors.background,
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Typography
                      variant="body2"
                      weight="semibold"
                      style={{
                        color:
                          distUnit === "imperial" ? "#ffffff" : colors.text,
                      }}
                    >
                      {tShared.imperial[lang]}
                    </Typography>
                  </Pressable>
                </View>
              </View>
            </View>
          </Card>
        </ProfileSection>

        <ProfileSection title={t.workoutPreferencesSection[lang]}>
          <SettingItem
            icon={
              <Activity
                size={20}
                color={rpeEnabled ? colors.primary[500] : colors.textMuted}
              />
            }
            title={t.rpeTitle[lang]}
            subtitle={t.rpeSubtitle[lang]}
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
              <Timer
                size={20}
                color={tempoEnabled ? colors.primary[500] : colors.textMuted}
              />
            }
            title={t.tempoTitle[lang]}
            subtitle={t.tempoSubtitle[lang]}
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

          <SettingItem
            icon={<Clock size={20} color={colors.primary[500]} />}
            title={t.defaultRestTimeTitle[lang]}
            subtitle={t.defaultRestTimeSubtitle[lang]}
            onPress={() => restTimeSheetRef.current?.present()}
            rightElement={
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: colors.gray[100],
                }}
              >
                <Typography
                  variant="body2"
                  weight="semibold"
                  style={{ color: colors.primary[500] }}
                >
                  {formatRestTime(defaultRestTime)}
                </Typography>
              </View>
            }
          />

          <SettingItem
            icon={
              <Smartphone
                size={20}
                color={keepScreenAwake ? colors.primary[500] : colors.textMuted}
              />
            }
            title={t.keepScreenAwakeTitle[lang]}
            subtitle={t.keepScreenAwakeSubtitle[lang]}
            rightElement={
              <Switch
                value={keepScreenAwake}
                onValueChange={(v) => {
                  if (user?.id) setKeepScreenAwake(user.id, v);
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
              <Vibrate
                size={20}
                color={hapticEnabled ? colors.primary[500] : colors.textMuted}
              />
            }
            title={t.hapticFeedbackTitle[lang]}
            subtitle={t.hapticFeedbackSubtitle[lang]}
            rightElement={
              <Switch
                value={hapticEnabled}
                onValueChange={(v) => {
                  if (user?.id) setHapticFeedback(user.id, v);
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

      <RestTimeBottomSheet
        ref={restTimeSheetRef}
        currentRestTime={defaultRestTime}
        onSelectRestTime={(seconds) => {
          if (user?.id) {
            setDefaultRestTime(user.id, seconds);
          }
          restTimeSheetRef.current?.dismiss();
        }}
      />
    </SafeAreaView>
  );
};

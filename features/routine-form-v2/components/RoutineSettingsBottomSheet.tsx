import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineSettingsTranslations } from "@/shared/translations/routine-settings";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { Settings, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../hooks/use-routine-form-store";

export const RoutineSettingsBottomSheet = forwardRef<BottomSheetModal>(
  // eslint-disable-next-line no-empty-pattern
  ({}, ref) => {
    const { colors, isDarkMode } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = routineSettingsTranslations;
    const { setRoutineFlags } = useMainActions();
    const { routine } = useRoutineFormState();

    const [showRpe, setShowRpe] = useState<boolean | null>(null);
    const [showTempo, setShowTempo] = useState<boolean | null>(null);

    const renderShowRpe = showRpe ?? routine?.show_rpe ?? false;
    const renderShowTempo = showTempo ?? routine?.show_tempo ?? false;

    const handleRpeChange = useCallback(
      (value: boolean) => {
        setShowRpe(value);
        setRoutineFlags({ show_rpe: value, show_tempo: renderShowTempo });
      },
      [setRoutineFlags, renderShowTempo]
    );

    const handleTempoChange = useCallback(
      (value: boolean) => {
        setShowTempo(value);
        setRoutineFlags({ show_rpe: renderShowRpe, show_tempo: value });
      },
      [setRoutineFlags, renderShowRpe]
    );

    const handleDismiss = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          style={[props.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["45%"]}
        backgroundStyle={{
          backgroundColor: isDarkMode
            ? "rgba(20, 20, 25, 0.95)"
            : "rgba(255, 255, 255, 0.98)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.15)",
          width: 40,
          height: 4,
        }}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView style={styles.container}>
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <Settings size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography variant="h4" weight="bold">
                  {t.title[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.advancedRoutineOptions[lang]}
                </Typography>
              </View>
            </View>
            <Pressable
              onPress={handleDismiss}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Settings Cards */}
          <View style={styles.settingsContainer}>
            {/* RPE Setting */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <View style={styles.settingInfo}>
                <Typography variant="body1" weight="medium">
                  {t.showRpe[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.rpeDescription[lang]}
                </Typography>
              </View>
              <Switch
                value={renderShowRpe}
                onValueChange={handleRpeChange}
                accessibilityLabel={t.showRpe[lang]}
                trackColor={{
                  false: isDarkMode
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.1)",
                  true: colors.primary[500],
                }}
                thumbColor="#ffffff"
                ios_backgroundColor={
                  isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                }
              />
            </View>

            {/* Tempo Setting */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <View style={styles.settingInfo}>
                <Typography variant="body1" weight="medium">
                  {t.showTempo[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.tempoDescription[lang]}
                </Typography>
              </View>
              <Switch
                value={renderShowTempo}
                onValueChange={handleTempoChange}
                accessibilityLabel={t.showTempo[lang]}
                trackColor={{
                  false: isDarkMode
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.1)",
                  true: colors.primary[500],
                }}
                thumbColor="#ffffff"
                ios_backgroundColor={
                  isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                }
              />
            </View>
          </View>

          <View style={{ height: 34 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
});

RoutineSettingsBottomSheet.displayName = "RoutineSettingsBottomSheet";

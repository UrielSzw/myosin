import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { Check, Minus, Plus, Timer, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Typography } from "../../typography";

type Props = {
  currentRestTime: number; // in seconds
  onSelectRestTime: (seconds: number) => void;
};

export const RestTimeBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ currentRestTime, onSelectRestTime }, ref) => {
    const { colors, isDarkMode } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = routineFormTranslations;

    const [selectedTime, setSelectedTime] = useState<number | null>(null);

    const showSelectedTime =
      selectedTime !== null ? selectedTime : currentRestTime;

    // Predefined rest time options (in seconds)
    const quickOptions = [
      { label: t.noRest[lang], value: 0 },
      { label: "30s", value: 30 },
      { label: "45s", value: 45 },
      { label: "1:00", value: 60 },
      { label: "1:30", value: 90 },
      { label: "2:00", value: 120 },
      { label: "2:30", value: 150 },
      { label: "3:00", value: 180 },
      { label: "4:00", value: 240 },
      { label: "5:00", value: 300 },
    ];

    const formatTime = (seconds: number) => {
      if (seconds === 0) return lang === "es" ? "Sin descanso" : "No rest";
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0
        ? `${mins}:${secs.toString().padStart(2, "0")}`
        : `${mins}:00`;
    };

    const handleIncrease = () => {
      const newTime = showSelectedTime + 5;
      if (newTime <= 600) {
        setSelectedTime(newTime);
      }
    };

    const handleDecrease = () => {
      const newTime = showSelectedTime - 5;
      if (newTime >= 0) {
        setSelectedTime(newTime);
      }
    };

    const handleSave = () => {
      onSelectRestTime(showSelectedTime);
      setSelectedTime(null);
    };

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
        snapPoints={["65%"]}
        enablePanDownToClose
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
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.container}>
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
                <Timer size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography variant="h4" weight="bold">
                  {t.restTime[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.customTime[lang]}
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

          {/* Time Display */}
          <View
            style={[
              styles.timeDisplay,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.02)",
                borderColor: `${colors.primary[500]}30`,
              },
            ]}
          >
            <Pressable
              onPress={handleDecrease}
              style={({ pressed }) => [
                styles.timeButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Minus size={22} color="#fff" strokeWidth={2.5} />
            </Pressable>

            <View style={styles.timeValue}>
              <Typography
                variant="h1"
                weight="bold"
                style={{ color: colors.primary[500], fontSize: 48 }}
              >
                {formatTime(showSelectedTime)}
              </Typography>
            </View>

            <Pressable
              onPress={handleIncrease}
              style={({ pressed }) => [
                styles.timeButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Plus size={22} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Quick Options */}
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginLeft: 20, marginBottom: 12 }}
          >
            {lang === "es" ? "Opciones rápidas" : "Quick options"}
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickScroll}
            contentContainerStyle={styles.quickContent}
          >
            {quickOptions.map((option) => {
              const isSelected = showSelectedTime === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedTime(option.value)}
                  style={({ pressed }) => [
                    styles.quickOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary[500]
                        : isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                      borderColor: isSelected
                        ? colors.primary[500]
                        : isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    },
                  ]}
                >
                  <Typography
                    variant="body2"
                    weight={isSelected ? "bold" : "medium"}
                    style={{ color: isSelected ? "#fff" : colors.text }}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Check size={20} color="#fff" strokeWidth={2.5} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: "#fff", marginLeft: 8 }}
              >
                {lang === "es" ? "Aplicar" : "Apply"}
              </Typography>
            </Pressable>
          </View>
        </BottomSheetView>
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
    paddingBottom: 24,
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
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  timeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    flex: 1,
    alignItems: "center",
  },
  quickScroll: {
    marginBottom: 24,
  },
  quickContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickOption: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
});

RestTimeBottomSheet.displayName = "RestTimeBottomSheet";

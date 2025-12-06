import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { profileTranslations as t } from "@/shared/translations/profile";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Clock, Minus, Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Quick time options (labels are translation keys or literal values)
const QUICK_OPTIONS = [
  { labelKey: "noRest", value: 0 },
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "1 min", value: 60 },
  { label: "1:30", value: 90 },
  { label: "2 min", value: 120 },
  { label: "2:30", value: 150 },
  { label: "3 min", value: 180 },
  { label: "4 min", value: 240 },
  { label: "5 min", value: 300 },
];

type Props = {
  visible: boolean;
  currentValue: number;
  onSelect: (seconds: number) => void;
  onClose: () => void;
};

export const RestTimeSheetV2 = ({
  visible,
  currentValue,
  onSelect,
  onClose,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const [selectedTime, setSelectedTime] = useState<number>(currentValue);

  // Sync selectedTime when currentValue changes or sheet opens
  useEffect(() => {
    if (visible) {
      setSelectedTime(currentValue);
    }
  }, [visible, currentValue]);

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${mins} min`;
  };

  const handleIncrease = () => {
    if (selectedTime < 600) {
      setSelectedTime((prev) => prev + 5);
    }
  };

  const handleDecrease = () => {
    if (selectedTime > 0) {
      setSelectedTime((prev) => prev - 5);
    }
  };

  const handleApply = () => {
    onSelect(selectedTime);
    onClose();
  };

  const handleQuickSelect = (value: number) => {
    setSelectedTime(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.6)",
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.sheetContent,
            {
              backgroundColor: isDarkMode
                ? "rgba(20, 20, 25, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <Clock size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {t.restTimeSheetTitle[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.restTimeSheetSubtitle[lang]}
                </Typography>
              </View>
            </View>
            <Pressable
              onPress={onClose}
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

          {/* Time Selector */}
          <View style={styles.selectorContainer}>
            <Typography
              variant="caption"
              weight="medium"
              color="textMuted"
              style={{ marginBottom: 12, marginLeft: 4 }}
            >
              {t.customTime[lang]}
            </Typography>

            <View
              style={[
                styles.timeInputContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: `${colors.primary[500]}30`,
                },
              ]}
            >
              {/* Decrease Button */}
              <Pressable
                onPress={handleDecrease}
                disabled={selectedTime <= 0}
                style={({ pressed }) => [
                  styles.controlButton,
                  {
                    backgroundColor: colors.primary[500],
                    opacity: selectedTime <= 0 ? 0.4 : pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <Minus size={22} color="#fff" strokeWidth={2.5} />
              </Pressable>

              {/* Time Display */}
              <View style={styles.timeDisplay}>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{
                    color: colors.primary[500],
                    fontSize: 36,
                  }}
                >
                  {formatTime(selectedTime)}
                </Typography>
              </View>

              {/* Increase Button */}
              <Pressable
                onPress={handleIncrease}
                disabled={selectedTime >= 600}
                style={({ pressed }) => [
                  styles.controlButton,
                  {
                    backgroundColor: colors.primary[500],
                    opacity: selectedTime >= 600 ? 0.4 : pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <Plus size={22} color="#fff" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          {/* Quick Options */}
          <View style={styles.quickOptionsContainer}>
            <Typography
              variant="caption"
              weight="medium"
              color="textMuted"
              style={{ marginBottom: 12, marginLeft: 4 }}
            >
              {t.quickOptions[lang]}
            </Typography>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickOptionsScroll}
            >
              {QUICK_OPTIONS.map((option) => {
                const isSelected = selectedTime === option.value;
                const displayLabel = option.labelKey
                  ? t[option.labelKey as keyof typeof t][lang]
                  : option.label;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleQuickSelect(option.value)}
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
                      variant="caption"
                      weight="semibold"
                      style={{
                        color: isSelected ? "#fff" : colors.text,
                      }}
                    >
                      {displayLabel}
                    </Typography>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Apply Button */}
          <View style={styles.applyContainer}>
            <Pressable
              onPress={handleApply}
              style={({ pressed }) => [
                styles.applyButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: "#fff" }}
              >
                {t.applyTime[lang]}
              </Typography>
            </Pressable>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 20 }} />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
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
    marginRight: 12,
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
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  timeDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickOptionsContainer: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  quickOptionsScroll: {
    paddingRight: 20,
    gap: 8,
  },
  quickOption: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  applyContainer: {
    paddingHorizontal: 20,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

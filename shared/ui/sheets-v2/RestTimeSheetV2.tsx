import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Clock, Minus, Plus, Timer, X, Zap } from "lucide-react-native";
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

const QUICK_OPTIONS = [
  { label: { es: "Sin descanso", en: "No rest" }, value: 0 },
  { label: { es: "30s", en: "30s" }, value: 30 },
  { label: { es: "45s", en: "45s" }, value: 45 },
  { label: { es: "1 min", en: "1 min" }, value: 60 },
  { label: { es: "1:30", en: "1:30" }, value: 90 },
  { label: { es: "2 min", en: "2 min" }, value: 120 },
  { label: { es: "2:30", en: "2:30" }, value: 150 },
  { label: { es: "3 min", en: "3 min" }, value: 180 },
  { label: { es: "4 min", en: "4 min" }, value: 240 },
  { label: { es: "5 min", en: "5 min" }, value: 300 },
];

export type RestTimeType =
  | "between-exercises"
  | "between-rounds"
  | "between-sets";

type Props = {
  visible: boolean;
  currentValue: number;
  restTimeType?: RestTimeType;
  onSelect: (seconds: number) => void;
  onClose: () => void;
};

export const RestTimeSheetV2 = ({
  visible,
  currentValue,
  restTimeType = "between-sets",
  onSelect,
  onClose,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const [selectedTime, setSelectedTime] = useState<number>(currentValue);

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
  }, [visible, backdropAnim, slideAnim]);

  const getHeaderInfo = () => {
    switch (restTimeType) {
      case "between-exercises":
        return {
          title:
            lang === "es"
              ? "Descanso entre Ejercicios"
              : "Rest Between Exercises",
          subtitle:
            lang === "es"
              ? "Tiempo entre ejercicios del superset"
              : "Time between superset exercises",
          icon: <Zap size={22} color={colors.primary[500]} />,
        };
      case "between-rounds":
        return {
          title:
            lang === "es" ? "Descanso entre Rondas" : "Rest Between Rounds",
          subtitle:
            lang === "es"
              ? "Tiempo después de completar la ronda"
              : "Time after completing the round",
          icon: <Timer size={22} color={colors.primary[500]} />,
        };
      default:
        return {
          title: lang === "es" ? "Tiempo de Descanso" : "Rest Time",
          subtitle:
            lang === "es"
              ? "Ajusta el tiempo entre series"
              : "Adjust time between sets",
          icon: <Clock size={22} color={colors.primary[500]} />,
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const formatTime = (seconds: number) => {
    if (seconds === 0) return lang === "es" ? "Sin descanso" : "No rest";
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
                {headerInfo.icon}
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {headerInfo.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {headerInfo.subtitle}
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

          {/* Time Selector Card */}
          <View style={styles.selectorContainer}>
            <Typography
              variant="caption"
              weight="medium"
              color="textMuted"
              style={{ marginBottom: 12, marginLeft: 4 }}
            >
              {lang === "es" ? "Tiempo personalizado" : "Custom time"}
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
              {lang === "es" ? "Opciones rápidas" : "Quick options"}
            </Typography>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickOptionsScroll}
            >
              {QUICK_OPTIONS.map((option) => {
                const isSelected = selectedTime === option.value;

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
                      variant="caption"
                      weight="semibold"
                      style={{
                        color: isSelected ? "#fff" : colors.text,
                      }}
                    >
                      {option.label[lang]}
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
                {lang === "es" ? "Aplicar Tiempo" : "Apply Time"}
              </Typography>
            </Pressable>
          </View>

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

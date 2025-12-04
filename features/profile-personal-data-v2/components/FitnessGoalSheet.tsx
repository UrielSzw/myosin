import { toSupportedLanguage } from "@/shared/types/language";
import { usersRepository } from "@/shared/db/repository/user";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesStore,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { personalDataTranslations as t } from "@/shared/translations/personal-data";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Check, Flame, Scale, TrendingUp, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type FitnessGoalType = "lose_fat" | "maintain" | "gain_muscle";

type Props = {
  visible: boolean;
  currentValue?: FitnessGoalType | null;
  onClose: () => void;
};

const GOALS: {
  id: FitnessGoalType;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "lose_fat",
    icon: <Flame size={24} color="#EF4444" />,
    color: "#EF4444",
  },
  {
    id: "maintain",
    icon: <Scale size={24} color="#3B82F6" />,
    color: "#3B82F6",
  },
  {
    id: "gain_muscle",
    icon: <TrendingUp size={24} color="#10B981" />,
    color: "#10B981",
  },
];

export const FitnessGoalSheet: React.FC<Props> = ({
  visible,
  currentValue,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const [selected, setSelected] = useState<FitnessGoalType | null>(
    currentValue ?? null
  );

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelected(currentValue ?? null);
      slideAnim.setValue(0);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentValue]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [onClose, backdropAnim, slideAnim]);

  const handleConfirm = useCallback(async () => {
    if (!user?.id || !selected) return;

    try {
      // Update local store
      useUserPreferencesStore.setState((state) => ({
        prefs: state.prefs
          ? { ...state.prefs, fitness_goal: selected }
          : state.prefs,
      }));

      // Persist to database
      await usersRepository.updateUserPreferences(user.id, {
        fitness_goal: selected,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating fitness goal:", error);
    }
  }, [user?.id, selected, handleClose]);

  const sheetBg = isDarkMode
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.98)";
  const cardBg = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(0, 0, 0, 0.03)";
  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheetContainer, { transform: [{ translateY }] }]}
      >
        <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
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
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.2)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Typography
              variant="h5"
              weight="bold"
              style={{ color: colors.text }}
            >
              {t.fitnessGoalSheetTitle[lang]}
            </Typography>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: cardBg }]}
            >
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {GOALS.map((goal) => {
              const isSelected = selected === goal.id;
              const goalTranslation = t.goals[goal.id];
              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => setSelected(goal.id)}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? `${goal.color}15` : cardBg,
                      borderColor: isSelected ? goal.color : borderColor,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      {
                        backgroundColor: isSelected
                          ? `${goal.color}20`
                          : isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    {goal.icon}
                  </View>
                  <View style={styles.optionText}>
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{ color: isSelected ? goal.color : colors.text }}
                    >
                      {goalTranslation.title[lang]}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ color: colors.textMuted, marginTop: 2 }}
                    >
                      {goalTranslation.subtitle[lang]}
                    </Typography>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: goal.color },
                      ]}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selected}
            style={[
              styles.confirmButton,
              {
                backgroundColor: selected
                  ? colors.primary[500]
                  : isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
            activeOpacity={0.8}
          >
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: selected ? "#fff" : colors.textMuted }}
            >
              {t.confirm[lang]}
            </Typography>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingBottom: 40,
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

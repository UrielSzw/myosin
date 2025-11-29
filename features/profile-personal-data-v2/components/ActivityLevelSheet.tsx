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
import {
  Armchair,
  Briefcase,
  Check,
  Footprints,
  HardHat,
  PersonStanding,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ActivityLevelType =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Props = {
  visible: boolean;
  currentValue?: ActivityLevelType | null;
  onClose: () => void;
};

const ACTIVITY_LEVELS: {
  id: ActivityLevelType;
  icon: (color: string) => React.ReactNode;
  color: string;
}[] = [
  {
    id: "sedentary",
    icon: (color) => <Armchair size={22} color={color} />,
    color: "#94A3B8",
  },
  {
    id: "light",
    icon: (color) => <Briefcase size={22} color={color} />,
    color: "#60A5FA",
  },
  {
    id: "moderate",
    icon: (color) => <PersonStanding size={22} color={color} />,
    color: "#34D399",
  },
  {
    id: "active",
    icon: (color) => <Footprints size={22} color={color} />,
    color: "#FBBF24",
  },
  {
    id: "very_active",
    icon: (color) => <HardHat size={22} color={color} />,
    color: "#F87171",
  },
];

export const ActivityLevelSheet: React.FC<Props> = ({
  visible,
  currentValue,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  const [selected, setSelected] = useState<ActivityLevelType | null>(
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
          ? { ...state.prefs, activity_level: selected }
          : state.prefs,
      }));

      // Persist to database
      await usersRepository.updateUserPreferences(user.id, {
        activity_level: selected,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating activity level:", error);
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
    outputRange: [500, 0],
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
              {t.activityLevelSheetTitle[lang]}
            </Typography>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: cardBg }]}
            >
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {ACTIVITY_LEVELS.map((level) => {
              const isSelected = selected === level.id;
              const levelTranslation = t.activityLevels[level.id];
              return (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setSelected(level.id)}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? `${level.color}15` : cardBg,
                      borderColor: isSelected ? level.color : borderColor,
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
                          ? `${level.color}20`
                          : isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    {level.icon(isSelected ? level.color : colors.textMuted)}
                  </View>
                  <View style={styles.optionText}>
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{
                        color: isSelected ? level.color : colors.text,
                      }}
                    >
                      {levelTranslation.title[lang]}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ color: colors.textMuted, marginTop: 2 }}
                      numberOfLines={2}
                    >
                      {levelTranslation.subtitle[lang]}
                    </Typography>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: level.color },
                      ]}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
    maxHeight: "80%",
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
  scrollView: {
    maxHeight: 350,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingTop: 8,
    paddingBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

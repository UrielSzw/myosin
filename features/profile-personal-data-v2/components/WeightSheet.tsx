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
import { Check, Minus, Plus, X } from "lucide-react-native";
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

type Props = {
  visible: boolean;
  currentValue?: number | null;
  onClose: () => void;
};

export const WeightSheet: React.FC<Props> = ({
  visible,
  currentValue,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const unit = prefs?.weight_unit ?? "kg";

  // Convert to display unit
  const toDisplayValue = (kg: number | null | undefined) => {
    if (!kg) return 70;
    return unit === "lbs" ? Math.round(kg * 2.205) : kg;
  };

  const toKg = (value: number) => {
    return unit === "lbs" ? Math.round(value / 2.205) : value;
  };

  const [value, setValue] = useState(toDisplayValue(currentValue));

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setValue(toDisplayValue(currentValue));
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
    if (!user?.id) return;

    const valueInKg = toKg(value);

    try {
      // Update local store
      useUserPreferencesStore.setState((state) => ({
        prefs: state.prefs
          ? { ...state.prefs, initial_weight_kg: valueInKg }
          : state.prefs,
      }));

      // Persist to database
      await usersRepository.updateUserPreferences(user.id, {
        initial_weight_kg: valueInKg,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating weight:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, value, handleClose]);

  const increment = () => setValue((v) => v + 1);
  const decrement = () => setValue((v) => Math.max(1, v - 1));

  const sheetBg = isDarkMode
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.98)";
  const cardBg = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(0, 0, 0, 0.03)";

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
              {t.weightSheetTitle[lang]}
            </Typography>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: cardBg }]}
            >
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Value Selector */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={decrement}
              style={[styles.adjustButton, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <Minus size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.valueContainer}>
              <Typography
                variant="h1"
                weight="bold"
                style={{ color: colors.text, fontSize: 56, lineHeight: 70 }}
              >
                {value}
              </Typography>
              <Typography
                variant="body1"
                weight="medium"
                style={{ color: colors.textMuted }}
              >
                {unit}
              </Typography>
            </View>

            <TouchableOpacity
              onPress={increment}
              style={[styles.adjustButton, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <Plus size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            style={[
              styles.confirmButton,
              { backgroundColor: colors.primary[500] },
            ]}
            activeOpacity={0.8}
          >
            <Check size={20} color="#fff" style={{ marginRight: 8 }} />
            <Typography variant="body1" weight="bold" style={{ color: "#fff" }}>
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
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 24,
  },
  adjustButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    alignItems: "center",
    minWidth: 120,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

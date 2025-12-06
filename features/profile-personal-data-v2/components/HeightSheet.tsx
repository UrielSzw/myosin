import { dataService } from "@/shared/data/data-service";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesStore,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { personalDataTranslations as t } from "@/shared/translations/personal-data";
import { toSupportedLanguage } from "@/shared/types/language";
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

export const HeightSheet: React.FC<Props> = ({
  visible,
  currentValue,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const distanceUnit = prefs?.distance_unit ?? "metric";

  // Convert to display values
  const toDisplayValue = (cm: number | null | undefined) => {
    if (!cm) return { feet: 5, inches: 7, cm: 170 };
    if (distanceUnit === "imperial") {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return { feet, inches, cm };
    }
    return { feet: 0, inches: 0, cm };
  };

  const toCm = (feet: number, inches: number) => {
    const totalInches = feet * 12 + inches;
    return Math.round(totalInches * 2.54);
  };

  const initialValues = toDisplayValue(currentValue);
  const [cmValue, setCmValue] = useState(currentValue ?? 170);
  const [feet, setFeet] = useState(initialValues.feet);
  const [inches, setInches] = useState(initialValues.inches);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const values = toDisplayValue(currentValue);
      setCmValue(currentValue ?? 170);
      setFeet(values.feet);
      setInches(values.inches);
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

    const finalCm = distanceUnit === "imperial" ? toCm(feet, inches) : cmValue;

    try {
      // Update local store
      useUserPreferencesStore.setState((state) => ({
        prefs: state.prefs
          ? { ...state.prefs, height_cm: finalCm }
          : state.prefs,
      }));

      // Persist to database with auto-sync
      await dataService.userPreferences.upsert(user.id, {
        height_cm: finalCm,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating height:", error);
    }
  }, [user?.id, distanceUnit, feet, inches, cmValue, handleClose]);

  const incrementCm = () => setCmValue((v) => Math.min(250, v + 1));
  const decrementCm = () => setCmValue((v) => Math.max(100, v - 1));

  const incrementFeet = () => setFeet((v) => Math.min(8, v + 1));
  const decrementFeet = () => setFeet((v) => Math.max(3, v - 1));

  const incrementInches = () =>
    setInches((v) => {
      if (v >= 11) {
        setFeet((f) => Math.min(8, f + 1));
        return 0;
      }
      return v + 1;
    });
  const decrementInches = () =>
    setInches((v) => {
      if (v <= 0) {
        setFeet((f) => Math.max(3, f - 1));
        return 11;
      }
      return v - 1;
    });

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
              {t.heightSheetTitle[lang]}
            </Typography>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: cardBg }]}
            >
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Value Selector */}
          {distanceUnit === "imperial" ? (
            <View style={styles.imperialContainer}>
              {/* Feet */}
              <View style={styles.imperialUnit}>
                <TouchableOpacity
                  onPress={decrementFeet}
                  style={[
                    styles.adjustButtonSmall,
                    { backgroundColor: cardBg },
                  ]}
                  activeOpacity={0.7}
                >
                  <Minus size={20} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.valueContainerSmall}>
                  <Typography
                    variant="h2"
                    weight="bold"
                    style={{ color: colors.text, lineHeight: 44 }}
                  >
                    {feet}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{ color: colors.textMuted }}
                  >
                    ft
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={incrementFeet}
                  style={[
                    styles.adjustButtonSmall,
                    { backgroundColor: cardBg },
                  ]}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Inches */}
              <View style={styles.imperialUnit}>
                <TouchableOpacity
                  onPress={decrementInches}
                  style={[
                    styles.adjustButtonSmall,
                    { backgroundColor: cardBg },
                  ]}
                  activeOpacity={0.7}
                >
                  <Minus size={20} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.valueContainerSmall}>
                  <Typography
                    variant="h2"
                    weight="bold"
                    style={{ color: colors.text, lineHeight: 44 }}
                  >
                    {inches}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{ color: colors.textMuted }}
                  >
                    in
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={incrementInches}
                  style={[
                    styles.adjustButtonSmall,
                    { backgroundColor: cardBg },
                  ]}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.selectorContainer}>
              <TouchableOpacity
                onPress={decrementCm}
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
                  {cmValue}
                </Typography>
                <Typography
                  variant="body1"
                  weight="medium"
                  style={{ color: colors.textMuted }}
                >
                  cm
                </Typography>
              </View>

              <TouchableOpacity
                onPress={incrementCm}
                style={[styles.adjustButton, { backgroundColor: cardBg }]}
                activeOpacity={0.7}
              >
                <Plus size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}

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
  imperialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 32,
  },
  imperialUnit: {
    alignItems: "center",
    gap: 12,
  },
  adjustButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    alignItems: "center",
    minWidth: 120,
  },
  valueContainerSmall: {
    alignItems: "center",
    minWidth: 60,
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

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useExercisesSync } from "@/shared/hooks/use-exercises-sync";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations as t } from "@/shared/translations/profile";
import { AVAILABLE_LANGUAGES } from "@/shared/ui/language-selector-sheet";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Check, Globe, X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const LanguageSelectorSheetV2 = ({ visible, onClose }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const { setLanguage } = useUserPreferencesActions();
  const { syncExercises } = useExercisesSync();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const currentLanguage = prefs?.language ?? "es";

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    AVAILABLE_LANGUAGES.map(() => new Animated.Value(0))
  ).current;

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
      ]).start(() => {
        Animated.stagger(
          60,
          optionsAnim.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    } else {
      optionsAnim.forEach((anim) => anim.setValue(0));
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

  const handleSelectLanguage = async (languageCode: "en" | "es") => {
    if (user?.id && languageCode !== currentLanguage) {
      setLanguage(user.id, languageCode);
      syncExercises(languageCode, { force: true }).catch((error) => {
        console.warn("⚠️ Error sincronizando ejercicios:", error);
      });
    }
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
                <Globe size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {t.languageSelectorTitle[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.languageSelectorSubtitle[lang]}
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

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            {AVAILABLE_LANGUAGES.map((language, index) => {
              const isSelected = currentLanguage === language.code;
              const animatedStyle = {
                opacity: optionsAnim[index],
                transform: [
                  {
                    translateY: optionsAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: optionsAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              };

              return (
                <Animated.View key={language.code} style={animatedStyle}>
                  <Pressable
                    onPress={() => handleSelectLanguage(language.code)}
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected
                          ? `${colors.primary[500]}15`
                          : isDarkMode
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                        borderColor: isSelected
                          ? colors.primary[500]
                          : isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                  >
                    {/* Flag emoji */}
                    <View
                      style={[
                        styles.flagContainer,
                        {
                          backgroundColor: isSelected
                            ? `${colors.primary[500]}20`
                            : isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                        },
                      ]}
                    >
                      <Typography style={{ fontSize: 28 }}>
                        {language.code === "es" ? "🇪🇸" : "🇺🇸"}
                      </Typography>
                    </View>

                    {/* Text */}
                    <View style={styles.optionText}>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        style={{
                          color: isSelected ? colors.primary[500] : colors.text,
                        }}
                      >
                        {language.nativeName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textMuted"
                        style={{ marginTop: 2 }}
                      >
                        {language.name}
                      </Typography>
                    </View>

                    {/* Check indicator */}
                    {isSelected && (
                      <View
                        style={[
                          styles.checkContainer,
                          { backgroundColor: colors.primary[500] },
                        ]}
                      >
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 34 }} />
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
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  flagContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    marginLeft: 14,
  },
  checkContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
});

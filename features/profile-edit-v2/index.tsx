import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useUserProfile } from "@/shared/hooks/use-user-profile";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations } from "@/shared/translations/profile";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ArrowLeft, Check, Mail, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";

const AVATAR_COLORS = [
  "#0ea5e9", // Primary blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#ef4444", // Red
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f97316", // Orange
];

export const ProfileEditFeatureV2 = () => {
  const { user } = useAuth();
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = profileTranslations;

  const { profile, updateDisplayName, updateAvatarColor } =
    useUserProfile(user);

  const [name, setName] = useState(profile.displayName || "");
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor);
  const [saving, setSaving] = useState(false);

  // Sync selectedColor when profile changes
  useEffect(() => {
    setSelectedColor(profile.avatarColor);
  }, [profile.avatarColor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const nameSuccess = await updateDisplayName(name.trim());
      const colorSuccess = await updateAvatarColor(selectedColor);

      if (nameSuccess && colorSuccess) {
        router.back();
      } else {
        Alert.alert(t.error[lang], t.errorSavingProfile[lang]);
      }
    } catch {
      Alert.alert(t.error[lang], t.errorOccurred[lang]);
    } finally {
      setSaving(false);
    }
  };

  const initial = (name || user?.email?.charAt(0) || "?")
    .charAt(0)
    .toUpperCase();

  // Calculate header height
  const headerHeight = insets.top + 8 + 40 + 24;

  return (
    <View style={styles.container}>
      <AuroraBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 25 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.headerContent}>
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.headerButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Typography
              variant="h5"
              weight="bold"
              style={{ color: colors.text }}
            >
              {t.editProfileTitle[lang]}
            </Typography>
          </View>

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: colors.primary[500],
                opacity: saving ? 0.6 : pressed ? 0.8 : 1,
              },
            ]}
          >
            {saving ? (
              <Typography
                variant="caption"
                weight="semibold"
                style={{ color: "#fff" }}
              >
                ...
              </Typography>
            ) : (
              <Check size={20} color="#fff" strokeWidth={2.5} />
            )}
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: headerHeight + 20,
              paddingBottom: insets.bottom + 40,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Preview Card */}
          <Animated.View entering={FadeIn.duration(400).delay(100)}>
            <View
              style={[
                styles.avatarCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.85)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              {Platform.OS === "ios" && (
                <BlurView
                  intensity={isDarkMode ? 20 : 40}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
              )}

              {/* Decorative glow */}
              <View
                style={[styles.avatarGlow, { backgroundColor: selectedColor }]}
              />

              <View style={styles.avatarContent}>
                {/* Avatar */}
                <View
                  style={[
                    styles.avatarOuter,
                    {
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <View
                    style={[styles.avatar, { backgroundColor: selectedColor }]}
                  >
                    <Typography
                      style={{
                        fontSize: 44,
                        color: "#fff",
                        fontWeight: "700",
                      }}
                    >
                      {initial}
                    </Typography>
                  </View>
                </View>

                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 16 }}
                >
                  {t.yourAvatar[lang]}
                </Typography>
              </View>
            </View>
          </Animated.View>

          {/* Color Picker */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <View style={styles.section}>
              <Typography
                variant="caption"
                weight="semibold"
                style={{
                  color: colors.textMuted,
                  marginBottom: 12,
                  marginLeft: 4,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {t.avatarColor[lang]}
              </Typography>

              <View
                style={[
                  styles.colorPickerCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.7)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                {Platform.OS === "ios" && (
                  <BlurView
                    intensity={isDarkMode ? 8 : 20}
                    tint={isDarkMode ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                  />
                )}

                <View style={styles.colorGrid}>
                  {AVATAR_COLORS.map((color) => {
                    const isSelected = selectedColor === color;

                    return (
                      <Pressable
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={({ pressed }) => [
                          styles.colorOption,
                          {
                            backgroundColor: color,
                            borderWidth: isSelected ? 3 : 0,
                            borderColor: "#fff",
                            transform: [
                              { scale: pressed ? 0.9 : isSelected ? 1.1 : 1 },
                            ],
                          },
                        ]}
                      >
                        {isSelected && (
                          <Check size={20} color="#fff" strokeWidth={3} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Name Input */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <View style={styles.section}>
              <Typography
                variant="caption"
                weight="semibold"
                style={{
                  color: colors.textMuted,
                  marginBottom: 12,
                  marginLeft: 4,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {t.name[lang]}
              </Typography>

              <View
                style={[
                  styles.inputCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.7)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                {Platform.OS === "ios" && (
                  <BlurView
                    intensity={isDarkMode ? 8 : 20}
                    tint={isDarkMode ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                  />
                )}

                <View style={styles.inputContent}>
                  <View
                    style={[
                      styles.inputIcon,
                      { backgroundColor: `${colors.primary[500]}15` },
                    ]}
                  >
                    <User size={20} color={colors.primary[500]} />
                  </View>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t.yourName[lang]}
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Email (Read-only) */}
          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <View style={styles.section}>
              <Typography
                variant="caption"
                weight="semibold"
                style={{
                  color: colors.textMuted,
                  marginBottom: 12,
                  marginLeft: 4,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {t.email[lang]}
              </Typography>

              <View
                style={[
                  styles.inputCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.5)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)",
                    opacity: 0.7,
                  },
                ]}
              >
                {Platform.OS === "ios" && (
                  <BlurView
                    intensity={isDarkMode ? 5 : 15}
                    tint={isDarkMode ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                  />
                )}

                <View style={styles.inputContent}>
                  <View
                    style={[
                      styles.inputIcon,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    <Mail size={20} color={colors.textMuted} />
                  </View>

                  <View style={styles.emailContainer}>
                    <Typography
                      variant="body1"
                      style={{ color: colors.textMuted }}
                      numberOfLines={1}
                    >
                      {user?.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textMuted"
                      style={{ marginTop: 2, opacity: 0.7 }}
                    >
                      {t.emailCannotBeModified[lang]}
                    </Typography>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  avatarCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 28,
  },
  avatarGlow: {
    position: "absolute",
    top: -60,
    left: "50%",
    marginLeft: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.2,
  },
  avatarContent: {
    paddingVertical: 32,
    alignItems: "center",
  },
  avatarOuter: {
    padding: 4,
    borderRadius: 56,
    borderWidth: 2,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  section: {
    marginBottom: 24,
  },
  colorPickerCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    padding: 20,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  colorOption: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  inputIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
  },
  emailContainer: {
    flex: 1,
    marginLeft: 14,
  },
});

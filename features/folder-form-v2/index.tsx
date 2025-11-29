import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  ArrowLeft,
  Check,
  Folder,
  Palette,
  Sparkles,
  Trash2,
  Type,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFolderForm } from "./hooks/use-folder-form";

// Modern muted color palette - sophisticated and cohesive
const FOLDER_COLORS = [
  "#6366f1", // Indigo (primary feel)
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Amber
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#0ea5e9", // Sky
  "#64748b", // Slate
  "#78716c", // Stone
];

type Props = {
  isEditMode?: boolean;
};

export const FolderFormV2 = ({ isEditMode }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const haptic = useHaptic();

  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Aurora animation
  const auroraAnim = useRef(new RNAnimated.Value(0)).current;

  // Preview animation
  const previewScale = useSharedValue(1);

  const {
    folderName,
    folderColor,
    isDeleting,
    isSaving,
    nameValidation,
    isFormValid,
    setFolderName,
    setFolderColor,
    handleSaveFolder,
    handleDeleteFolder,
  } = useFolderForm({ isEditMode });

  // Smart button state
  const [stableButtonState, setStableButtonState] = useState(false);

  useEffect(() => {
    const currentlyValid = isFormValid && !nameValidation?.isValidating;
    if (currentlyValid && !stableButtonState) {
      setStableButtonState(true);
    } else if (!currentlyValid && stableButtonState) {
      const timeout = setTimeout(() => setStableButtonState(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isFormValid, nameValidation?.isValidating, stableButtonState]);

  // Aurora animation loop
  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(auroraAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(auroraAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      haptic.light();
      setFolderColor(color);
      previewScale.value = withSpring(1.05, { damping: 10 }, () => {
        previewScale.value = withSpring(1);
      });
    },
    [setFolderColor, haptic, previewScale]
  );

  const previewAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: previewScale.value }],
  }));

  const isSaveDisabled = !stableButtonState || isSaving;

  const auroraTranslateX = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const auroraTranslateY = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <RNAnimated.View
          style={[
            styles.auroraOrb,
            {
              backgroundColor: folderColor,
              top: "10%",
              left: "20%",
              transform: [
                { translateX: auroraTranslateX },
                { translateY: auroraTranslateY },
              ],
            },
          ]}
        />
        <RNAnimated.View
          style={[
            styles.auroraOrb,
            {
              backgroundColor: isDarkMode ? "#8b5cf6" : "#06b6d4",
              top: "60%",
              right: "10%",
              width: 200,
              height: 200,
              transform: [
                {
                  translateX: RNAnimated.multiply(auroraTranslateX, -0.7),
                },
                {
                  translateY: RNAnimated.multiply(auroraTranslateY, -0.5),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 40 : 60}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}
        {Platform.OS === "android" && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDarkMode
                  ? "rgba(3, 5, 8, 0.85)"
                  : "rgba(248, 250, 252, 0.9)",
              },
            ]}
          />
        )}

        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            disabled={isSaving || isDeleting}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Sparkles
              size={18}
              color={folderColor}
              style={{ marginRight: 8 }}
            />
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {isEditMode
                ? lang === "es"
                  ? "Editar Carpeta"
                  : "Edit Folder"
                : lang === "es"
                ? "Nueva Carpeta"
                : "New Folder"}
            </Typography>
          </View>

          <Pressable
            onPress={handleSaveFolder}
            disabled={isSaveDisabled}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isSaveDisabled
                  ? isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)"
                  : folderColor,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Check
              size={20}
              color={isSaveDisabled ? colors.textMuted : "#fff"}
              strokeWidth={2.5}
            />
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Preview Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[previewAnimatedStyle]}
        >
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.8)",
                borderColor: `${folderColor}40`,
                overflow: "hidden",
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

            <View style={styles.previewContent}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: `${folderColor}20` },
                ]}
              >
                <Folder size={48} color={folderColor} />{" "}
              </View>
              <Typography
                variant="h3"
                weight="bold"
                align="center"
                style={{ color: colors.text, marginTop: 16 }}
                numberOfLines={1}
              >
                {folderName || (lang === "es" ? "Mi Carpeta" : "My Folder")}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                align="center"
                style={{ marginTop: 4 }}
              >
                {lang === "es" ? "0 rutinas" : "0 routines"}
              </Typography>
            </View>
          </View>
        </Animated.View>

        {/* Name Input Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Type size={18} color={colors.primary[500]} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, marginLeft: 10 }}
              >
                {lang === "es" ? "Nombre" : "Name"}
              </Typography>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: nameValidation?.error
                    ? colors.error[500]
                    : nameValidation?.isValid && folderName.length > 0
                    ? colors.success[500]
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              {Platform.OS === "ios" && (
                <BlurView
                  intensity={isDarkMode ? 15 : 30}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <TextInput
                ref={inputRef}
                value={folderName}
                onChangeText={setFolderName}
                placeholder={
                  lang === "es" ? "Nombre de la carpeta" : "Folder name"
                }
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text }]}
                maxLength={50}
                autoFocus={!isEditMode}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <Typography
                variant="caption"
                color="textMuted"
                style={styles.charCount}
              >
                {folderName.length}/50
              </Typography>
            </View>

            {nameValidation?.error && (
              <Typography
                variant="caption"
                style={{
                  color: colors.error[500],
                  marginTop: 8,
                  marginLeft: 4,
                }}
              >
                {nameValidation.error}
              </Typography>
            )}
          </View>
        </Animated.View>

        {/* Color Selection */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette size={18} color={colors.primary[500]} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, marginLeft: 10 }}
              >
                {lang === "es" ? "Color" : "Color"}
              </Typography>
            </View>

            <View style={styles.colorsGrid}>
              {FOLDER_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => handleColorSelect(color)}
                  style={({ pressed }) => [
                    styles.colorButton,
                    {
                      backgroundColor: color,
                      borderColor:
                        folderColor === color ? colors.text : "transparent",
                      borderWidth: folderColor === color ? 3 : 0,
                      transform: [{ scale: pressed ? 0.9 : 1 }],
                    },
                  ]}
                >
                  {folderColor === color && (
                    <Check size={20} color="#fff" strokeWidth={3} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Delete Button (Edit Mode) */}
        {isEditMode && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Pressable
              onPress={handleDeleteFolder}
              disabled={isSaving || isDeleting}
              style={({ pressed }) => [
                styles.deleteButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(239, 68, 68, 0.08)",
                  borderColor: `${colors.error[500]}30`,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Trash2 size={20} color={colors.error[500]} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.error[500], marginLeft: 10 }}
              >
                {isDeleting
                  ? lang === "es"
                    ? "Eliminando..."
                    : "Deleting..."
                  : lang === "es"
                  ? "Eliminar Carpeta"
                  : "Delete Folder"}
              </Typography>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  auroraOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  header: {
    position: "relative",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  previewCard: {
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: 32,
  },
  previewContent: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  previewIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  charCount: {
    paddingRight: 16,
  },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
});

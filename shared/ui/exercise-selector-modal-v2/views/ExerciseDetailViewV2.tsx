import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { mediaUrlCache } from "@/shared/services/secure-media-service";
import {
  exerciseEquipmentTranslations,
  exerciseMuscleTranslations,
} from "@/shared/translations/exercise-labels";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { IExerciseEquipment, IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  ChevronLeft,
  Dumbbell,
  ListOrdered,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

type Props = {
  exercise: BaseExercise;
  onClose: () => void;
};

export const ExerciseDetailViewV2: React.FC<Props> = ({
  exercise,
  onClose,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = exerciseSelectorTranslations;
  const muscleT = exerciseMuscleTranslations;
  const equipmentT = exerciseEquipmentTranslations;

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load signed URL for media
  useEffect(() => {
    if (!exercise.primary_media_url) return;

    const loadSignedUrl = async () => {
      setIsLoading(true);
      try {
        const url = await mediaUrlCache.getCachedUrl(
          exercise.primary_media_url!
        );
        setSignedUrl(url);
      } catch (error) {
        console.error("[ExerciseDetailV2] Error loading signed URL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSignedUrl();
  }, [exercise.primary_media_url]);

  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const translations = {
    instructions: { es: "Instrucciones", en: "Instructions" },
    muscle: { es: "Músculo Principal", en: "Main Muscle" },
    equipment: { es: "Equipamiento", en: "Equipment" },
    noInstructions: {
      es: "No hay instrucciones disponibles",
      en: "No instructions available",
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      {/* Compact Header */}
      <BlurView
        intensity={Platform.OS === "ios" ? 60 : 0}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.header,
          {
            paddingTop: 16,
            backgroundColor:
              Platform.OS === "android"
                ? isDark
                  ? "rgba(20, 20, 25, 0.95)"
                  : "rgba(255, 255, 255, 0.95)"
                : "transparent",
            borderBottomColor: cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Typography variant="body1" weight="semibold" numberOfLines={1}>
            {exercise.name}
          </Typography>
        </View>

        {/* Spacer for balance */}
        <View style={{ width: 40 }} />
      </BlurView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Media Section */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.mediaSection}
        >
          <View
            style={[
              styles.mediaContainer,
              {
                backgroundColor: isDark
                  ? "rgba(30, 30, 35, 1)"
                  : "rgba(240, 240, 245, 1)",
              },
            ]}
          >
            {isLoading ? (
              <View style={styles.mediaPlaceholder}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
              </View>
            ) : signedUrl ? (
              <>
                <Image
                  source={{ uri: signedUrl }}
                  style={styles.mediaImage}
                  contentFit="contain"
                  autoplay={true}
                  cachePolicy="memory-disk"
                />
                {exercise.primary_media_type === "gif" && (
                  <View
                    style={[
                      styles.gifBadge,
                      { backgroundColor: colors.primary[500] },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      weight="bold"
                      style={{ color: "#fff", fontSize: 10 }}
                    >
                      GIF
                    </Typography>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.mediaPlaceholder}>
                <Dumbbell
                  size={56}
                  color={colors.textMuted}
                  strokeWidth={1.5}
                />
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginTop: 12 }}
                >
                  {t.noImagesAvailable[lang]}
                </Typography>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Exercise Name & Source Badge */}
        <Animated.View
          entering={FadeInRight.delay(100).duration(300)}
          style={styles.titleSection}
        >
          <Typography variant="h3" weight="bold" style={{ marginBottom: 8 }}>
            {exercise.name}
          </Typography>
          <View
            style={[
              styles.sourceBadge,
              {
                backgroundColor:
                  exercise.source === "system"
                    ? `${colors.success[500]}20`
                    : `${colors.secondary[500]}20`,
              },
            ]}
          >
            <Sparkles
              size={12}
              color={
                exercise.source === "system"
                  ? colors.success[500]
                  : colors.secondary[500]
              }
            />
            <Typography
              variant="caption"
              weight="semibold"
              style={{
                color:
                  exercise.source === "system"
                    ? colors.success[500]
                    : colors.secondary[500],
                marginLeft: 4,
              }}
            >
              {exercise.source === "system" ? t.system[lang] : t.custom[lang]}
            </Typography>
          </View>
        </Animated.View>

        {/* Quick Info Cards Row */}
        <Animated.View
          entering={FadeInRight.delay(150).duration(300)}
          style={styles.quickInfoRow}
        >
          {/* Muscle Card */}
          <View
            style={[
              styles.quickInfoCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View
              style={[
                styles.quickInfoIcon,
                { backgroundColor: `${colors.error[500]}15` },
              ]}
            >
              <Target size={18} color={colors.error[500]} />
            </View>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 8 }}
            >
              {translations.muscle[lang]}
            </Typography>
            <Typography
              variant="body2"
              weight="semibold"
              style={{ marginTop: 2 }}
            >
              {muscleT[exercise.main_muscle_group as IExerciseMuscle]?.[lang] ||
                exercise.main_muscle_group}
            </Typography>
          </View>

          {/* Equipment Card */}
          <View
            style={[
              styles.quickInfoCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View
              style={[
                styles.quickInfoIcon,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Wrench size={18} color={colors.primary[500]} />
            </View>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 8 }}
            >
              {translations.equipment[lang]}
            </Typography>
            <Typography
              variant="body2"
              weight="semibold"
              style={{ marginTop: 2 }}
            >
              {equipmentT[exercise.primary_equipment as IExerciseEquipment]?.[
                lang
              ] || exercise.primary_equipment}
            </Typography>
          </View>
        </Animated.View>

        {/* Instructions Section */}
        {exercise.instructions && exercise.instructions.length > 0 ? (
          <Animated.View
            entering={FadeInRight.delay(200).duration(300)}
            style={[
              styles.instructionsCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View
              style={[styles.cardAccentBar, { backgroundColor: "#10b981" }]}
            />
            <View style={styles.instructionsContent}>
              {/* Header */}
              <View style={styles.instructionsHeader}>
                <View
                  style={[
                    styles.instructionsIconWrapper,
                    { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                  ]}
                >
                  <ListOrdered size={18} color="#10b981" />
                </View>
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ marginLeft: 10 }}
                >
                  {translations.instructions[lang]}
                </Typography>
              </View>

              {/* Steps */}
              <View style={styles.stepsList}>
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} style={styles.stepRow}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: colors.primary[500] },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{ color: "#fff", fontSize: 11 }}
                      >
                        {index + 1}
                      </Typography>
                    </View>
                    <Typography
                      variant="body2"
                      style={{
                        flex: 1,
                        lineHeight: 22,
                        color: colors.text,
                        opacity: 0.9,
                      }}
                    >
                      {instruction}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInRight.delay(200).duration(300)}
            style={[
              styles.emptyInstructions,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <ListOrdered size={32} color={colors.textMuted} strokeWidth={1.5} />
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginTop: 12, textAlign: "center" }}
            >
              {translations.noInstructions[lang]}
            </Typography>
          </Animated.View>
        )}

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // Media Section
  mediaSection: {
    marginBottom: 20,
  },
  mediaContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gifBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  // Title Section
  titleSection: {
    marginBottom: 16,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  // Quick Info
  quickInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  quickInfoCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  quickInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  // Instructions
  instructionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardAccentBar: {
    width: 4,
  },
  instructionsContent: {
    flex: 1,
    padding: 16,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  instructionsIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  emptyInstructions: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
});

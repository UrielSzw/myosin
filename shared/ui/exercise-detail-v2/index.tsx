import { progressionPathsRepository } from "@/shared/db/repository/progressions";
import { BaseExercise } from "@/shared/db/schema";
import type {
  ProgressionPath,
  UnlockCriteria,
} from "@/shared/db/schema/progressions";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { mediaUrlCache } from "@/shared/services/secure-media-service";
import {
  exerciseEquipmentTranslations,
  exerciseMuscleTranslations,
  exerciseTypeTranslations,
} from "@/shared/translations/exercise-labels";
import { toSupportedLanguage } from "@/shared/types/language";
import { IExerciseEquipment, IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Layers,
  ListOrdered,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wrench,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================================
// Types
// ============================================================================

export interface ProgressionContext {
  pathId: string;
  pathName: string;
  pathColor: string;
  currentLevel: number;
  maxLevel: number;
  status: "locked" | "unlocking" | "unlocked" | "mastered";
  /** Legacy: simple text description */
  unlockCriteria?: string;
  /** Structured unlock criteria for the next exercise */
  unlockCriteriaForNext?: UnlockCriteria;
  /** Name of the next exercise to unlock */
  nextExerciseName?: string;
}

interface Props {
  exercise: BaseExercise;
  onClose: () => void;
  /** Optional context when viewing from progression paths */
  progressionContext?: ProgressionContext;
}

// ============================================================================
// Translations
// ============================================================================

const translations = {
  instructions: {
    es: "Instrucciones",
    en: "Instructions",
  },
  noInstructions: {
    es: "No hay instrucciones disponibles para este ejercicio.",
    en: "No instructions available for this exercise.",
  },
  commonMistakes: {
    es: "Errores Comunes",
    en: "Common Mistakes",
  },
  noMedia: {
    es: "Sin imagen",
    en: "No image",
  },
  system: {
    es: "Sistema",
    en: "System",
  },
  custom: {
    es: "Personalizado",
    en: "Custom",
  },
  muscle: {
    es: "Músculo",
    en: "Muscle",
  },
  equipment: {
    es: "Equipo",
    en: "Equipment",
  },
  type: {
    es: "Tipo",
    en: "Type",
  },
  partOf: {
    es: "Parte de",
    en: "Part of",
  },
  level: {
    es: "Nivel",
    en: "Level",
  },
  of: {
    es: "de",
    en: "of",
  },
  unlockRequirement: {
    es: "Para desbloquear",
    en: "To unlock",
  },
  nextUp: {
    es: "Siguiente",
    en: "Next up",
  },
  toUnlockNext: {
    es: "Para desbloquear el siguiente nivel",
    en: "To unlock the next level",
  },
  goal: {
    es: "Meta",
    en: "Goal",
  },
  achievementUnlocked: {
    es: "Logro completado",
    en: "Achievement unlocked",
  },
  unlocks: {
    es: "Desbloquea",
    en: "Unlocks",
  },
  criteriaDescriptions: {
    reps: {
      es: (value: number) => `Lograr ${value} repeticiones`,
      en: (value: number) => `Achieve ${value} reps`,
    },
    time: {
      es: (value: number) => `Aguantar ${value} segundos`,
      en: (value: number) => `Hold for ${value} seconds`,
    },
    weight: {
      es: (value: number) => `Levantar ${value}kg`,
      en: (value: number) => `Lift ${value}kg`,
    },
    weight_reps: {
      es: (weight: number, reps: number) =>
        `${weight}kg x ${reps} repeticiones`,
      en: (weight: number, reps: number) => `${weight}kg x ${reps} reps`,
    },
    sets_reps: {
      es: (sets: number, reps: number) =>
        `${sets} series de ${reps} repeticiones`,
      en: (sets: number, reps: number) => `${sets} sets of ${reps} reps`,
    },
    manual: {
      es: "Completar manualmente",
      en: "Complete manually",
    },
  },
  pathComplete: {
    es: "¡Has completado este ejercicio!",
    en: "You've completed this exercise!",
  },
  statusLabels: {
    locked: { es: "Bloqueado", en: "Locked" },
    unlocking: { es: "En progreso", en: "In progress" },
    unlocked: { es: "Disponible", en: "Available" },
    mastered: { es: "Dominado", en: "Mastered" },
  },
  pathNames: {
    "progressions.paths.pullup.name": {
      es: "Progresión de Dominadas",
      en: "Pull-up Progression",
    },
    "progressions.paths.pushup.name": {
      es: "Progresión de Flexiones",
      en: "Push-up Progression",
    },
    "progressions.paths.dip.name": {
      es: "Progresión de Fondos",
      en: "Dip Progression",
    },
  } as Record<string, { es: string; en: string }>,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format unlock criteria into a human-readable string
 */
function formatUnlockCriteria(
  criteria: UnlockCriteria,
  lang: "es" | "en",
  t: typeof translations
): string {
  const { type, primary_value, secondary_value, sets } = criteria;

  switch (type) {
    case "reps":
      return t.criteriaDescriptions.reps[lang](primary_value);
    case "time":
      return t.criteriaDescriptions.time[lang](primary_value);
    case "weight":
      return t.criteriaDescriptions.weight[lang](primary_value);
    case "weight_reps":
      return t.criteriaDescriptions.weight_reps[lang](
        primary_value,
        secondary_value || 1
      );
    case "sets_reps":
      return t.criteriaDescriptions.sets_reps[lang](sets || 3, primary_value);
    case "manual":
      return t.criteriaDescriptions.manual[lang];
    default:
      return `${primary_value}`;
  }
}

// ============================================================================
// Component
// ============================================================================

export const ExerciseDetailViewV2: React.FC<Props> = ({
  exercise,
  onClose,
  progressionContext,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;
  const muscleT = exerciseMuscleTranslations;
  const equipmentT = exerciseEquipmentTranslations;
  const typeT = exerciseTypeTranslations;

  // Media state
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Progression paths (auto-detect if not provided via context)
  const [detectedPaths, setDetectedPaths] = useState<ProgressionPath[]>([]);

  // Scroll animation (for future use)
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Load signed URL for media
  useEffect(() => {
    if (!exercise.primary_media_url) return;

    const loadSignedUrl = async () => {
      setIsLoadingMedia(true);
      try {
        const url = await mediaUrlCache.getCachedUrl(
          exercise.primary_media_url!
        );
        setSignedUrl(url);
      } catch (error) {
        console.error("[ExerciseDetailV2] Error loading signed URL:", error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    loadSignedUrl();
  }, [exercise.primary_media_url]);

  // Auto-detect progression paths if not provided
  useEffect(() => {
    if (progressionContext) return; // Skip if context already provided

    const loadPaths = async () => {
      try {
        const paths = await progressionPathsRepository.getPathsForExercise(
          exercise.id
        );
        setDetectedPaths(paths);
      } catch (error) {
        console.error("[ExerciseDetailV2] Error loading paths:", error);
      }
    };

    loadPaths();
  }, [exercise.id, progressionContext]);

  // Colors
  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  // Get first detected path for badge (if no context provided)
  const mainPath = detectedPaths[0];
  const pathColor =
    progressionContext?.pathColor || mainPath?.color || colors.secondary[500];
  const pathName =
    progressionContext?.pathName ||
    (mainPath
      ? t.pathNames[mainPath.name_key]?.[lang] || mainPath.name_key
      : null);

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      {/* Fixed Header - consistent with rest of app */}
      <View style={[styles.header, { paddingTop: 8 }]}>
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDark ? 25 : 40}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}
        {Platform.OS === "android" && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? "rgba(10, 10, 12, 0.95)"
                  : "rgba(250, 250, 252, 0.95)",
              },
            ]}
          />
        )}

        <View style={styles.headerContent}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.headerBackButton,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Title Section */}
          <View style={styles.headerTitleContainer}>
            <Typography
              variant="h5"
              weight="bold"
              numberOfLines={1}
              style={{ color: colors.text }}
            >
              {exercise.name}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {muscleT[exercise.main_muscle_group as IExerciseMuscle]?.[lang] ||
                exercise.main_muscle_group}
            </Typography>
          </View>

          {/* Dumbbell Icon */}
          <View
            style={[
              styles.headerIconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <Dumbbell size={18} color={colors.primary[500]} />
          </View>
        </View>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32, paddingTop: insets.top + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Media Section */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.mediaSection}
        >
          {isLoadingMedia ? (
            <View style={[styles.mediaContainer, { backgroundColor: cardBg }]}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
          ) : signedUrl ? (
            <View style={[styles.mediaContainer, { backgroundColor: cardBg }]}>
              <Image
                source={{ uri: signedUrl }}
                style={styles.mediaImage}
                contentFit="contain"
                autoplay={true}
                cachePolicy="memory-disk"
              />
              {/* GIF Badge */}
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
                    style={styles.gifText}
                  >
                    GIF
                  </Typography>
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.mediaContainer,
                styles.mediaPlaceholder,
                { backgroundColor: cardBg },
              ]}
            >
              <Dumbbell size={48} color={colors.textMuted} strokeWidth={1.5} />
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginTop: 12 }}
              >
                {t.noMedia[lang]}
              </Typography>
            </View>
          )}

          {/* Source badge below media */}
          <Animated.View
            entering={FadeIn.delay(200).duration(300)}
            style={styles.sourceBadgeContainer}
          >
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
        </Animated.View>

        {/* Quick Stats Cards */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          style={styles.statsRow}
        >
          {/* Muscle Card */}
          <View
            style={[
              styles.statCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDark ? 15 : 30}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View
              style={[styles.statGlow, { backgroundColor: colors.error[500] }]}
            />
            <View style={styles.statContent}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: `${colors.error[500]}15` },
                ]}
              >
                <Target size={18} color={colors.error[500]} />
              </View>
              <Typography
                variant="caption"
                color="textMuted"
                style={styles.statLabel}
              >
                {t.muscle[lang]}
              </Typography>
              <Typography variant="body2" weight="semibold" numberOfLines={1}>
                {muscleT[exercise.main_muscle_group as IExerciseMuscle]?.[
                  lang
                ] || exercise.main_muscle_group}
              </Typography>
            </View>
          </View>

          {/* Equipment Card */}
          <View
            style={[
              styles.statCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDark ? 15 : 30}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View
              style={[
                styles.statGlow,
                { backgroundColor: colors.primary[500] },
              ]}
            />
            <View style={styles.statContent}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <Wrench size={18} color={colors.primary[500]} />
              </View>
              <Typography
                variant="caption"
                color="textMuted"
                style={styles.statLabel}
              >
                {t.equipment[lang]}
              </Typography>
              <Typography variant="body2" weight="semibold" numberOfLines={1}>
                {equipmentT[exercise.primary_equipment as IExerciseEquipment]?.[
                  lang
                ] || exercise.primary_equipment}
              </Typography>
            </View>
          </View>

          {/* Type Card */}
          <View
            style={[
              styles.statCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDark ? 15 : 30}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View
              style={[
                styles.statGlow,
                { backgroundColor: colors.secondary[500] },
              ]}
            />
            <View style={styles.statContent}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: `${colors.secondary[500]}15` },
                ]}
              >
                <Layers size={18} color={colors.secondary[500]} />
              </View>
              <Typography
                variant="caption"
                color="textMuted"
                style={styles.statLabel}
              >
                {t.type[lang]}
              </Typography>
              <Typography variant="body2" weight="semibold" numberOfLines={1}>
                {typeT[exercise.exercise_type as "compound" | "isolation"]?.[
                  lang
                ] || exercise.exercise_type}
              </Typography>
            </View>
          </View>
        </Animated.View>

        {/* Progression Path Section - Clean redesign */}
        {progressionContext && (
          <Animated.View
            entering={FadeInRight.delay(200).duration(300)}
            style={styles.progressionSection}
          >
            {/* Path Info Row */}
            <View
              style={[
                styles.pathInfoRow,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <View
                style={[
                  styles.pathIconSmall,
                  { backgroundColor: `${pathColor}20` },
                ]}
              >
                <TrendingUp size={16} color={pathColor} />
              </View>
              <View style={styles.pathTextContainer}>
                <Typography variant="body2" weight="semibold" numberOfLines={1}>
                  {pathName}
                </Typography>
                <Typography variant="caption" color="textMuted">
                  {t.level[lang]} {progressionContext.currentLevel} {t.of[lang]}{" "}
                  {progressionContext.maxLevel}
                </Typography>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      progressionContext.status === "mastered"
                        ? `${colors.warning[500]}15`
                        : progressionContext.status === "unlocked"
                        ? `${colors.success[500]}15`
                        : progressionContext.status === "unlocking"
                        ? `${colors.primary[500]}15`
                        : `${colors.textMuted}15`,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{
                    color:
                      progressionContext.status === "mastered"
                        ? colors.warning[500]
                        : progressionContext.status === "unlocked"
                        ? colors.success[500]
                        : progressionContext.status === "unlocking"
                        ? colors.primary[500]
                        : colors.textMuted,
                  }}
                >
                  {t.statusLabels[progressionContext.status][lang]}
                </Typography>
              </View>
            </View>

            {/* Goal/Milestone Card */}
            {progressionContext.unlockCriteriaForNext && (
              <View
                style={[
                  styles.goalCard,
                  {
                    backgroundColor:
                      progressionContext.status === "mastered"
                        ? `${colors.warning[500]}08`
                        : `${colors.primary[500]}08`,
                    borderColor:
                      progressionContext.status === "mastered"
                        ? `${colors.warning[500]}25`
                        : `${colors.primary[500]}25`,
                  },
                ]}
              >
                <View style={styles.goalHeader}>
                  <View
                    style={[
                      styles.goalIcon,
                      {
                        backgroundColor:
                          progressionContext.status === "mastered"
                            ? `${colors.warning[500]}20`
                            : `${colors.primary[500]}20`,
                      },
                    ]}
                  >
                    {progressionContext.status === "mastered" ? (
                      <Trophy size={18} color={colors.warning[500]} />
                    ) : (
                      <Target size={18} color={colors.primary[500]} />
                    )}
                  </View>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{
                      color:
                        progressionContext.status === "mastered"
                          ? colors.warning[500]
                          : colors.primary[500],
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {progressionContext.status === "mastered"
                      ? t.achievementUnlocked[lang]
                      : t.goal[lang]}
                  </Typography>
                </View>

                <Typography
                  variant="h6"
                  weight="bold"
                  style={{
                    color:
                      progressionContext.status === "mastered"
                        ? colors.warning[600]
                        : colors.text,
                    marginTop: 8,
                  }}
                >
                  {formatUnlockCriteria(
                    progressionContext.unlockCriteriaForNext,
                    lang,
                    t
                  )}
                </Typography>

                {progressionContext.nextExerciseName &&
                  progressionContext.status !== "mastered" && (
                    <View style={styles.nextExerciseIndicator}>
                      <ChevronRight size={14} color={colors.textMuted} />
                      <Typography
                        variant="caption"
                        color="textMuted"
                        style={{ marginLeft: 2 }}
                      >
                        {t.unlocks[lang]}{" "}
                        <Typography variant="caption" weight="semibold">
                          {progressionContext.nextExerciseName}
                        </Typography>
                      </Typography>
                    </View>
                  )}
              </View>
            )}

            {/* Final exercise in path - no next goal */}
            {!progressionContext.unlockCriteriaForNext &&
              progressionContext.status === "mastered" && (
                <View
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: `${colors.warning[500]}08`,
                      borderColor: `${colors.warning[500]}25`,
                    },
                  ]}
                >
                  <View style={styles.goalHeader}>
                    <View
                      style={[
                        styles.goalIcon,
                        { backgroundColor: `${colors.warning[500]}20` },
                      ]}
                    >
                      <Sparkles size={18} color={colors.warning[500]} />
                    </View>
                    <Typography
                      variant="body2"
                      weight="semibold"
                      style={{ color: colors.warning[500] }}
                    >
                      {t.pathComplete[lang]}
                    </Typography>
                  </View>
                </View>
              )}
          </Animated.View>
        )}

        {/* Auto-detected path (when not from progression context) */}
        {!progressionContext && pathName && (
          <Animated.View
            entering={FadeInRight.delay(200).duration(300)}
            style={styles.progressionSection}
          >
            <View
              style={[
                styles.pathInfoRow,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <View
                style={[
                  styles.pathIconSmall,
                  { backgroundColor: `${pathColor}20` },
                ]}
              >
                <TrendingUp size={16} color={pathColor} />
              </View>
              <View style={styles.pathTextContainer}>
                <Typography variant="caption" color="textMuted">
                  {t.partOf[lang]}
                </Typography>
                <Typography variant="body2" weight="semibold" numberOfLines={1}>
                  {pathName}
                </Typography>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Instructions Section */}
        {exercise.instructions && exercise.instructions.length > 0 ? (
          <Animated.View
            entering={FadeInDown.duration(400).delay(250)}
            style={styles.instructionsSection}
          >
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionHeaderIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <ListOrdered size={16} color={colors.textMuted} />
              </View>
              <Typography variant="body2" weight="semibold" color="textMuted">
                {t.instructions[lang]}
              </Typography>
            </View>

            {/* Steps */}
            <View
              style={[
                styles.instructionsCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              {exercise.instructions.map((instruction, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.duration(300).delay(300 + index * 40)}
                  style={[
                    styles.stepRow,
                    index < exercise.instructions!.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stepNumber,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.08)",
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      weight="bold"
                      style={{ color: colors.textMuted }}
                    >
                      {index + 1}
                    </Typography>
                  </View>
                  <Typography
                    variant="body2"
                    style={[styles.stepText, { color: colors.text }]}
                  >
                    {instruction}
                  </Typography>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(400).delay(250)}
            style={styles.instructionsSection}
          >
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionHeaderIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <ListOrdered size={16} color={colors.textMuted} />
              </View>
              <Typography variant="body2" weight="semibold" color="textMuted">
                {t.instructions[lang]}
              </Typography>
            </View>

            <View
              style={[
                styles.emptyInstructions,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Typography variant="body2" color="textMuted" align="center">
                {t.noInstructions[lang]}
              </Typography>
            </View>
          </Animated.View>
        )}

        {/* Common Mistakes Section */}
        {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={styles.instructionsSection}
          >
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionHeaderIcon,
                  {
                    backgroundColor: `${colors.warning[500]}15`,
                  },
                ]}
              >
                <AlertTriangle size={16} color={colors.warning[500]} />
              </View>
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: colors.warning[500] }}
              >
                {t.commonMistakes[lang]}
              </Typography>
            </View>

            {/* Mistakes List */}
            <View
              style={[
                styles.instructionsCard,
                {
                  backgroundColor: `${colors.warning[500]}08`,
                  borderColor: `${colors.warning[500]}20`,
                },
              ]}
            >
              {exercise.common_mistakes.map((mistake, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.duration(300).delay(350 + index * 40)}
                  style={[
                    styles.stepRow,
                    index < exercise.common_mistakes!.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: `${colors.warning[500]}15`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.mistakeBullet,
                      {
                        backgroundColor: `${colors.warning[500]}25`,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.mistakeBulletInner,
                        { backgroundColor: colors.warning[500] },
                      ]}
                    />
                  </View>
                  <Typography
                    variant="body2"
                    style={[styles.stepText, { color: colors.text }]}
                  >
                    {mistake}
                  </Typography>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  // Header (consistent with rest of app)
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  mediaPlaceholder: {
    backgroundColor: "transparent",
  },
  gifBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  gifText: {
    color: "#fff",
    fontSize: 11,
  },
  sourceBadgeContainer: {
    marginTop: 12,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  statGlow: {
    position: "absolute",
    top: -20,
    left: "50%",
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.15,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    marginBottom: 2,
  },

  // Progression Section - New Clean Design
  progressionSection: {
    marginBottom: 20,
    gap: 12,
  },
  pathInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  pathIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pathTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  goalCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  nextExerciseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  // Legacy styles (keeping for backwards compatibility)
  progressionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressionAccent: {
    width: 4,
  },
  progressionContent: {
    flex: 1,
    padding: 16,
  },
  progressionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  progressionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlockCriteriaCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  unlockCriteriaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  unlockCriteriaIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  unlockCriteriaContent: {
    paddingLeft: 38,
  },
  nextExerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  // Instructions Section - Clean Design
  instructionsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  instructionsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepText: {
    flex: 1,
    lineHeight: 22,
  },
  mistakeBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  mistakeBulletInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyInstructions: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
});

export default ExerciseDetailViewV2;

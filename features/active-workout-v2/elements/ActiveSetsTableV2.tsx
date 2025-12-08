import {
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkout,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { toSupportedLanguage } from "@/shared/types/language";
import { getMeasurementTemplate } from "@/shared/types/measurement";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  exerciseInBlockId: string;
  blockType: IBlockType;
  children: React.ReactNode;
  onOpenMeasurementTemplate?: () => void;
};

export const ActiveSetsTableV2: React.FC<Props> = ({
  exerciseInBlockId,
  blockType,
  children,
  onOpenMeasurementTemplate,
}) => {
  const { sets, setsByExercise, session } = useActiveWorkout();
  const { setCurrentState } = useActiveMainActions();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = activeWorkoutTranslations;
  const { getBlockColors } = useBlockStyles();
  const { addSet } = useActiveSetActions();

  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  const blockColors = getBlockColors(blockType);
  const setId = setsByExercise[exerciseInBlockId]?.[0] || "";
  const measurementTemplate =
    sets[setId]?.measurement_template || "weight_reps";

  const template = getMeasurementTemplate(
    measurementTemplate,
    weightUnit,
    distanceUnit
  );

  // Check if any set has been completed (prevents template change)
  const hasAnyCompletedSet = useMemo(() => {
    const setIds = setsByExercise[exerciseInBlockId] || [];
    return setIds.some((setId) => sets[setId]?.completed_at != null);
  }, [setsByExercise, exerciseInBlockId, sets]);

  // Animation for add button
  const addButtonScale = useSharedValue(1);

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const handleAddSet = () => {
    addButtonScale.value = withSpring(0.95, { damping: 15 }, () => {
      addButtonScale.value = withSpring(1);
    });
    addSet(exerciseInBlockId);
  };

  const handleOpenMeasurementTemplate = useCallback(() => {
    if (hasAnyCompletedSet || !onOpenMeasurementTemplate) return;

    setCurrentState({
      currentExerciseInBlockId: exerciseInBlockId,
    });
    onOpenMeasurementTemplate();
  }, [
    hasAnyCompletedSet,
    onOpenMeasurementTemplate,
    setCurrentState,
    exerciseInBlockId,
  ]);

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[
          styles.headerRow,
          {
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {/* SET column */}
        <View style={styles.setColumn}>
          <Typography
            variant="caption"
            weight="semibold"
            color="textMuted"
            style={styles.headerText}
          >
            SET
          </Typography>
        </View>

        {/* PREV column */}
        <View style={styles.prevColumn}>
          <Typography
            variant="caption"
            weight="semibold"
            color="textMuted"
            style={styles.headerText}
          >
            {t.prev[lang].toUpperCase()}
          </Typography>
        </View>

        {/* Measurement columns - Adaptive layout */}
        <Pressable
          onPress={handleOpenMeasurementTemplate}
          disabled={hasAnyCompletedSet || !onOpenMeasurementTemplate}
          style={[
            styles.measurementHeaders,
            template?.fields.length === 1
              ? { width: "40%" }
              : { flex: template?.fields.length || 1 },
          ]}
        >
          {template?.fields.map((field) => (
            <View key={field.id} style={styles.measurementColumn}>
              <Typography
                variant="caption"
                weight="semibold"
                color="textMuted"
                style={styles.headerText}
              >
                {field.label.toUpperCase()}
              </Typography>
            </View>
          ))}
          {!hasAnyCompletedSet && onOpenMeasurementTemplate && (
            <ChevronDown
              size={12}
              color={colors.textMuted}
              style={{ marginLeft: 2 }}
            />
          )}
        </Pressable>

        {/* RPE column */}
        {session?.routine?.show_rpe && (
          <View style={styles.rpeColumn}>
            <Typography
              variant="caption"
              weight="semibold"
              color="textMuted"
              style={styles.headerText}
            >
              RPE
            </Typography>
          </View>
        )}

        {/* CHECK column */}
        <View style={styles.checkColumn}>
          <Check size={14} color={colors.textMuted} />
        </View>
      </Animated.View>

      {/* Set Rows */}
      <View style={styles.rowsContainer}>{children}</View>

      {/* Add Set Button */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(300)}
        style={addButtonAnimatedStyle}
      >
        <Pressable
          onPress={handleAddSet}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <BlurView
            intensity={isDarkMode ? 20 : 15}
            tint={isDarkMode ? "dark" : "light"}
            style={[
              styles.addButton,
              {
                borderColor: blockColors.primary,
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            <View
              style={[
                styles.addIconContainer,
                { backgroundColor: blockColors.light },
              ]}
            >
              <Plus size={14} color={blockColors.primary} />
            </View>
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: blockColors.primary }}
            >
              {t.addSet[lang]}
            </Typography>
          </BlurView>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  headerText: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  setColumn: {
    width: 38,
    alignItems: "center",
  },
  prevColumn: {
    width: 55,
    alignItems: "center",
  },
  measurementHeaders: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  measurementColumn: {
    flex: 1,
    alignItems: "center",
  },
  rpeColumn: {
    width: 44,
    alignItems: "center",
  },
  checkColumn: {
    width: 40,
    alignItems: "center",
  },
  rowsContainer: {
    gap: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    gap: 6,
    overflow: "hidden",
  },
  addIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

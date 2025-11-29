import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import {
  getDefaultTemplate,
  getMeasurementTemplate,
} from "@/shared/types/measurement";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronDown, Plus, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IToogleSheet } from "../hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
  useSetActions,
} from "../hooks/use-routine-form-store";
import { SetRowV2 } from "./SetRowV2";

type Props = {
  blockType: IBlockType;
  exerciseInBlockId: string;
  setIds: string[];
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const SetsTableV2: React.FC<Props> = ({
  blockType,
  exerciseInBlockId,
  setIds,
  onToggleSheet,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { sets, routine, setsByExercise } = useRoutineFormState();
  const { addSet } = useSetActions();
  const { setCurrentState } = useMainActions();
  const { getBlockColors } = useBlockStyles();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = routineFormTranslations;
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  const { show_rpe, show_tempo } = routine;
  const blockColors = getBlockColors(blockType);

  // Get template from first set
  const firstSetId = setsByExercise[exerciseInBlockId]?.[0];
  const currentSet = sets[firstSetId];
  const template = getMeasurementTemplate(
    currentSet?.measurement_template || getDefaultTemplate(),
    weightUnit,
    distanceUnit
  );

  // Animation for add button
  const addButtonScale = useSharedValue(1);

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const handleMeasurementTemplate = () => {
    setCurrentState({
      currentExerciseInBlockId: exerciseInBlockId,
      currentMeasurementTemplate: template.id,
    });
    onToggleSheet("measurementTemplate");
  };

  const handleAddSet = () => {
    addButtonScale.value = withSpring(0.95, { damping: 15 }, () => {
      addButtonScale.value = withSpring(1);
    });
    addSet(exerciseInBlockId, template.id);
  };

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

        {/* Measurement columns - Tappable */}
        <Pressable
          onPress={handleMeasurementTemplate}
          style={({ pressed }) => [
            styles.measurementHeaders,
            template.fields.length === 1
              ? { width: "50%" }
              : { flex: template.fields.length },
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          {template.fields.map((field, index) => (
            <View key={field.id} style={styles.measurementColumn}>
              <View style={styles.headerWithChevron}>
                <Typography
                  variant="caption"
                  weight="semibold"
                  color="textMuted"
                  style={styles.headerText}
                >
                  {field.label}
                </Typography>
                {index === template.fields.length - 1 && (
                  <ChevronDown
                    size={10}
                    color={colors.textMuted}
                    style={{ marginLeft: 2 }}
                  />
                )}
              </View>
            </View>
          ))}
        </Pressable>

        {/* RPE column */}
        {show_rpe && (
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

        {/* Tempo column */}
        {show_tempo && (
          <View style={styles.tempoColumn}>
            <Timer size={12} color={colors.textMuted} />
          </View>
        )}
      </Animated.View>

      {/* Set Rows */}
      <View style={styles.rowsContainer}>
        {setIds.map((setId, index) => (
          <SetRowV2
            key={setId}
            setId={setId}
            exerciseInBlockId={exerciseInBlockId}
            template={template}
            showRpe={show_rpe}
            showTempo={show_tempo}
            onToggleSheet={onToggleSheet}
            index={index}
          />
        ))}
      </View>

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
  setColumn: {
    width: 38,
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
  headerWithChevron: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  rpeColumn: {
    width: 44,
    alignItems: "center",
  },
  tempoColumn: {
    width: 36,
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

import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { reorderTranslations } from "@/shared/translations/reorder";
import { ReorderExercise } from "@/shared/types/reorder";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  Check,
  Dumbbell,
  GripVertical,
  ListOrdered,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  block: BlockInsert & { tempId: string };
  exercises: ReorderExercise[];
  onReorder: (reorderedExercises: ReorderExercise[]) => void;
  onCancel: () => void;
};

export const ReorderExercisesV2Feature: React.FC<Props> = ({
  block,
  exercises,
  onReorder,
  onCancel,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = reorderTranslations;
  const { getBlockTypeLabel, getBlockColors } = useBlockStyles();

  const [reorderedExercises, setReorderedExercises] =
    useState<ReorderExercise[]>(exercises);

  const blockColors = getBlockColors(block.type);

  const handleReorder = ({ data }: { data: ReorderExercise[] }) => {
    const updatedExercises: ReorderExercise[] = data.map((exercise, index) => ({
      ...exercise,
      order_index: index,
    }));
    setReorderedExercises(updatedExercises);
  };

  const handleSave = () => {
    onReorder(reorderedExercises);
  };

  const screenBg = isDarkMode
    ? "rgba(10, 10, 12, 1)"
    : "rgba(250, 250, 252, 1)";
  const headerBg = isDarkMode
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.95)";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const renderExerciseItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<ReorderExercise>) => {
    return (
      <ScaleDecorator>
        <ReorderExerciseItemV2
          exercise={item}
          drag={drag}
          isActive={isActive}
          index={getIndex() ?? 0}
          blockColors={blockColors}
        />
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: screenBg }]}>
        {/* Header */}
        <BlurView
          intensity={Platform.OS === "ios" ? 60 : 0}
          tint={isDarkMode ? "dark" : "light"}
          style={[
            styles.header,
            {
              paddingTop: insets.top,
              backgroundColor:
                Platform.OS === "android" ? headerBg : "transparent",
              borderBottomColor: cardBorder,
            },
          ]}
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.headerContent}
          >
            {/* Cancel Button */}
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.text} />
            </Pressable>

            {/* Title */}
            <View style={styles.headerTitleContainer}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${blockColors.primary}20` },
                ]}
              >
                <ListOrdered size={18} color={blockColors.primary} />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Typography variant="body1" weight="bold">
                  {t.reorderExercises[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: blockColors.primary }}
                >
                  {getBlockTypeLabel(block.type)}
                </Typography>
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: blockColors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Check size={18} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </Animated.View>
        </BlurView>

        {/* Instructions */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.instructionsContainer}
        >
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ lineHeight: 20 }}
          >
            {t.reorderExercisesInstructions[lang]}
          </Typography>
        </Animated.View>

        {/* Draggable List */}
        <View style={styles.listContainer}>
          <DraggableFlatList
            data={reorderedExercises}
            onDragEnd={handleReorder}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            activationDistance={15}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

// Inline ReorderExerciseItemV2 component
type ExerciseItemProps = {
  exercise: ReorderExercise;
  drag: () => void;
  isActive: boolean;
  index: number;
  blockColors: { primary: string; light: string; border: string };
};

const ReorderExerciseItemV2: React.FC<ExerciseItemProps> = ({
  exercise,
  drag,
  isActive,
  index,
  blockColors,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const haptic = useHaptic();

  const cardBg = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const hasImage = !!exercise.exercise.primary_media_url;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <TouchableOpacity
        onLongPress={() => {
          haptic.drag();
          drag();
        }}
        delayLongPress={200}
        activeOpacity={0.9}
        style={[
          styles.exerciseCard,
          {
            backgroundColor: isActive ? `${blockColors.primary}15` : cardBg,
            borderColor: isActive ? blockColors.primary : cardBorder,
            shadowOpacity: isActive ? 0.3 : 0,
            shadowColor: blockColors.primary,
            transform: [{ scale: isActive ? 1.02 : 1 }],
          },
        ]}
      >
        {/* Type indicator bar */}
        <View
          style={[
            styles.typeIndicator,
            { backgroundColor: blockColors.primary },
          ]}
        />

        <View style={styles.exerciseContent}>
          {/* Drag Handle */}
          <View
            style={[
              styles.dragHandle,
              {
                backgroundColor: isActive
                  ? `${blockColors.primary}20`
                  : isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <GripVertical
              size={18}
              color={isActive ? blockColors.primary : colors.textMuted}
            />
          </View>

          {/* Exercise Number */}
          <View
            style={[
              styles.numberBadge,
              {
                backgroundColor: blockColors.primary,
                borderColor: isDarkMode
                  ? "rgba(0,0,0,0.3)"
                  : "rgba(255,255,255,0.8)",
              },
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

          {/* Exercise Image */}
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
                borderColor: cardBorder,
              },
            ]}
          >
            {hasImage ? (
              <Image
                source={{ uri: exercise.exercise.primary_media_url! }}
                style={styles.exerciseImage}
                contentFit="cover"
              />
            ) : (
              <Dumbbell size={22} color={colors.textMuted} />
            )}
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfo}>
            <Typography variant="body1" weight="semibold" numberOfLines={1}>
              {exercise.exercise.name}
            </Typography>
            <View style={styles.exerciseDetails}>
              <Typography variant="caption" color="textMuted" numberOfLines={1}>
                {exercise.exercise.main_muscle_group}
              </Typography>
              {exercise.exercise.primary_equipment && (
                <>
                  <View style={styles.detailDot} />
                  <Typography
                    variant="caption"
                    color="textMuted"
                    numberOfLines={1}
                    style={{ flex: 1 }}
                  >
                    {exercise.exercise.primary_equipment}
                  </Typography>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsContainer: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  // Exercise Card Styles
  exerciseCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  typeIndicator: {
    width: 4,
  },
  exerciseContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  dragHandle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginRight: 10,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    marginRight: 12,
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  detailDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(150,150,150,0.5)",
    marginHorizontal: 6,
  },
});

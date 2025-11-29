import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useReorderBlocksState } from "@/shared/hooks/use-reorder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { reorderTranslations } from "@/shared/translations/reorder";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Check, GripVertical, Layers, X } from "lucide-react-native";
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
  blocks: (BlockInsert & { tempId: string })[];
  onReorder: (reorderedBlocks: (BlockInsert & { tempId: string })[]) => void;
  onCancel: () => void;
};

export const ReorderBlocksV2Feature: React.FC<Props> = ({
  blocks,
  onReorder,
  onCancel,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = reorderTranslations;

  const [reorderedBlocks, setReorderedBlocks] = useState(blocks);

  const handleReorder = ({
    data,
  }: {
    data: (BlockInsert & { tempId: string })[];
  }) => {
    const updatedBlocks = data.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));
    setReorderedBlocks(updatedBlocks);
  };

  const handleSave = () => {
    onReorder(reorderedBlocks);
  };

  const screenBg = isDarkMode
    ? "rgba(10, 10, 12, 1)"
    : "rgba(250, 250, 252, 1)";
  const headerBg = isDarkMode
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.95)";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const renderBlockItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<BlockInsert & { tempId: string }>) => {
    return (
      <ScaleDecorator>
        <ReorderBlockItemV2
          blockData={item}
          drag={drag}
          isActive={isActive}
          index={getIndex() ?? 0}
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
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <Layers size={18} color={colors.primary[500]} />
              </View>
              <Typography
                variant="body1"
                weight="bold"
                style={{ marginLeft: 8 }}
              >
                {t.reorderBlocks[lang]}
              </Typography>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: colors.primary[500],
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
            {t.reorderBlocksInstructions[lang]}
          </Typography>
        </Animated.View>

        {/* Draggable List */}
        <View style={styles.listContainer}>
          <DraggableFlatList
            data={reorderedBlocks}
            onDragEnd={handleReorder}
            keyExtractor={(item) => item.tempId}
            renderItem={renderBlockItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            activationDistance={15}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

// Inline ReorderBlockItemV2 component
type BlockItemProps = {
  blockData: BlockInsert & { tempId: string };
  drag: () => void;
  isActive: boolean;
  index: number;
};

const ReorderBlockItemV2: React.FC<BlockItemProps> = ({
  blockData,
  drag,
  isActive,
  index,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = sharedUiTranslations;
  const { getBlockTypeLabel, getBlockColors } = useBlockStyles();
  const { exercisesByBlock, exercisesInBlock } = useReorderBlocksState();
  const haptic = useHaptic();

  const blockColors = getBlockColors(blockData.type);
  const exercisesIds = exercisesByBlock[blockData.tempId] || [];

  const exercisesNames = exercisesIds.map((ex) => {
    const exercise = exercisesInBlock[ex];
    return exercise ? exercise.exercise.name : t.deletedExercise[lang];
  });

  const exerciseNames = exercisesNames.length
    ? exercisesNames.join(" • ")
    : t.noExercises[lang];

  const cardBg = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

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
          styles.blockCard,
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

        <View style={styles.blockContent}>
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

          {/* Block Info */}
          <View style={styles.blockInfo}>
            {/* Header Row */}
            <View style={styles.blockHeader}>
              <Typography variant="body1" weight="semibold">
                {t.block[lang]} {index + 1}
              </Typography>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${blockColors.primary}20` },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: blockColors.primary, fontSize: 10 }}
                >
                  {getBlockTypeLabel(blockData.type)}
                </Typography>
              </View>
            </View>

            {/* Exercise Names */}
            <Typography
              variant="body2"
              color="textMuted"
              numberOfLines={2}
              style={{ marginTop: 4, lineHeight: 18 }}
            >
              {exerciseNames}
            </Typography>

            {/* Exercise Count */}
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statBadge,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <Typography variant="caption" color="textMuted">
                  {exercisesIds.length}{" "}
                  {exercisesIds.length === 1
                    ? t.exercise[lang]
                    : t.exercises[lang]}
                </Typography>
              </View>
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
  // Block Card Styles
  blockCard: {
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
  blockContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  dragHandle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  blockInfo: {
    flex: 1,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

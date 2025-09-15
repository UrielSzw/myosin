import { BlockInsert } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { ReorderExercise } from "@/shared/types/reorder";
import { IBlockType } from "@/shared/types/workout";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DraggableList } from "./draggable-list";

type Props = {
  block: BlockInsert & { tempId: string };
  exercises: ReorderExercise[];
  onReorder: (reorderedExercises: ReorderExercise[]) => void;
  onCancel: () => void;
};

export const ReorderExercisesFeature: React.FC<Props> = ({
  block,
  exercises,
  onReorder,
  onCancel,
}) => {
  const { colors } = useColorScheme();

  const [reorderedExercises, setReorderedExercises] =
    useState<ReorderExercise[]>(exercises);

  const getBlockTypeLabel = (type: IBlockType) => {
    switch (type) {
      case "superset":
        return "Superserie";
      case "circuit":
        return "Circuito";
      default:
        return "Individual";
    }
  };

  const handleReorder = ({ data }: { data: ReorderExercise[] }) => {
    // Update orderIndex for each exercise
    const updatedExercises: ReorderExercise[] = data.map((exercise, index) => ({
      ...exercise,
      order_index: index,
    }));

    setReorderedExercises(updatedExercises);
  };

  const handleSave = () => {
    onReorder(reorderedExercises);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Button variant="ghost" size="sm" onPress={handleCancel}>
          <ArrowLeft size={18} color={colors.text} />
        </Button>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Typography variant="h6" weight="semibold">
            Reordenar Ejercicios
          </Typography>
          <Typography variant="caption" color="textMuted">
            {getBlockTypeLabel(block.type)}
          </Typography>
        </View>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Typography
            variant="button"
            style={{ color: "white", marginLeft: 4, fontSize: 14 }}
          >
            Guardar
          </Typography>
        </Button>
      </View>

      {/* Instructions */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          Mantén presionado un ejercicio por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <DraggableList
        reorderedExercises={reorderedExercises}
        blockType={block.type}
        onReorder={handleReorder}
      />
    </SafeAreaView>
  );
};

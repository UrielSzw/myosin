import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IBlockType, IRepsType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { ChevronDown, Plus } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { IToogleSheet } from "../../hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
  useSetActions,
} from "../../hooks/use-routine-form-store";

type Props = {
  children: React.ReactNode;
  blockType: IBlockType;
  exerciseInBlockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const SetsTable: React.FC<Props> = ({
  children,
  blockType,
  exerciseInBlockId,
  onToggleSheet,
}) => {
  const { setsByExercise, sets } = useRoutineFormState();
  const { colors } = useColorScheme();
  const { getRepsColumnTitle, getBlockColors } = useBlockStyles();
  const { addSet } = useSetActions();
  const { setCurrentState } = useMainActions();

  const blockColors = getBlockColors(blockType);

  const setId = setsByExercise[exerciseInBlockId]?.[0];
  const repsType: IRepsType = sets[setId]?.reps_type || "reps";

  const handleRepsType = () => {
    setCurrentState({
      currentExerciseInBlockId: exerciseInBlockId,
      currentRepsType: repsType,
    });
    onToggleSheet("repsType");
  };

  const handleAddSet = () => {
    addSet(exerciseInBlockId, repsType);
  };

  return (
    <View style={{ marginTop: 12 }}>
      {/* Table Headers */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginBottom: 8,
        }}
      >
        <View style={{ width: 40 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            SET
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            KG
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <TouchableOpacity
            onPress={handleRepsType}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              // Área clickeable mínima para accesibilidad
              minHeight: 44,
              paddingVertical: 12,
              paddingHorizontal: 8,
              // Margin negativo para mantener alineación visual
              marginHorizontal: -8,
              marginVertical: -12,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar tipo de repeticiones`}
            accessibilityHint={`Actualmente configurado para ${getRepsColumnTitle(
              repsType
            )}. Toca para cambiar`}
            accessibilityValue={{ text: getRepsColumnTitle(repsType) }}
          >
            <Typography variant="caption" weight="medium" color="textMuted">
              {getRepsColumnTitle(repsType)}
            </Typography>
            <ChevronDown size={12} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Set Rows */}
      {children}

      {/* Add Set Button */}
      <TouchableOpacity
        onPress={handleAddSet}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // Altura mínima mejorada para accesibilidad
          minHeight: 44,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginTop: 4,
          borderWidth: 1,
          borderColor: blockColors.primary,
          borderStyle: "dashed",
          borderRadius: 4,
          backgroundColor: blockColors.light,
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Agregar nueva serie"
        accessibilityHint="Toca para añadir una serie adicional a este ejercicio"
      >
        <Plus size={14} color={blockColors.primary} />
        <Typography
          variant="caption"
          weight="medium"
          style={{
            color: blockColors.primary,
            marginLeft: 4,
          }}
        >
          Agregar Serie
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

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
import { ChevronDown, Plus, Timer } from "lucide-react-native";
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
  const { setsByExercise, sets, routine } = useRoutineFormState();
  const { colors } = useColorScheme();
  const t = routineFormTranslations;
  const { getBlockColors } = useBlockStyles();
  const { addSet } = useSetActions();
  const { setCurrentState } = useMainActions();

  // Get user's weight unit preference
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const lang = prefs?.language ?? "es";

  const { show_rpe, show_tempo } = routine;

  const blockColors = getBlockColors(blockType);

  const setId = setsByExercise[exerciseInBlockId]?.[0];
  const currentSet = sets[setId];
  const template = getMeasurementTemplate(
    currentSet?.measurement_template || getDefaultTemplate(),
    weightUnit
  );

  const handleMeasurementTemplate = () => {
    setCurrentState({
      currentExerciseInBlockId: exerciseInBlockId,
      currentMeasurementTemplate: template.id,
    });
    onToggleSheet("measurementTemplate");
  };

  const handleAddSet = () => {
    addSet(exerciseInBlockId, template.id);
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

        {/* Dynamic Measurement Headers - Single TouchableOpacity covering all fields */}
        <TouchableOpacity
          onPress={handleMeasurementTemplate}
          style={{
            flexDirection: "row",
            // For single columns, use fixed width instead of flex to avoid full width
            ...(template.fields.length === 1
              ? { width: "50%" } // Fixed width for single column
              : { flex: template.fields.length }), // Flex for dual columns
            minHeight: 44,
            paddingVertical: 12,
            paddingHorizontal: 8,
            marginHorizontal: -8,
            marginVertical: -12,
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t.changeMeasurementTemplate[lang]}
          accessibilityHint={t.currentTemplate[lang].replace("{template}", template.name)}
          accessibilityValue={{ text: template.name }}
        >
          {template.fields.map((field, index) => (
            <View key={field.id} style={{ flex: 1, paddingHorizontal: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" weight="medium" color="textMuted">
                  {field.label}
                </Typography>
                {index === template.fields.length - 1 && (
                  <ChevronDown
                    size={12}
                    color={colors.textMuted}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </View>
          ))}
        </TouchableOpacity>

        {show_rpe && (
          <View style={{ width: 50, alignItems: "center" }}>
            <Typography variant="caption" weight="medium" color="textMuted">
              RPE
            </Typography>
          </View>
        )}

        {show_tempo && (
          <View style={{ width: 40, alignItems: "center" }}>
            <Timer size={12} color={colors.textMuted} />
          </View>
        )}
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
        accessibilityLabel={t.addSetAccessibility[lang]}
        accessibilityHint={t.addSetHint[lang]}
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
          {t.addSet[lang]}
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

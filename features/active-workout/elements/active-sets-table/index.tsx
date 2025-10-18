import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { getMeasurementTemplate } from "@/shared/types/measurement";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import {
  Check,
  Dumbbell,
  Footprints,
  Hourglass,
  Plus,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import {
  useActiveSetActions,
  useActiveWorkout,
} from "../../hooks/use-active-workout-store";

type Props = {
  exerciseInBlockId: string;
  blockType: IBlockType;
  children: React.ReactNode;
};

export const ActiveSetsTable: React.FC<Props> = ({
  exerciseInBlockId,
  blockType,
  children,
}) => {
  const { sets, setsByExercise, session } = useActiveWorkout();
  const { colors } = useColorScheme();
  const { getBlockColors } = useBlockStyles();
  const { addSet } = useActiveSetActions();

  const handleAddSet = () => {
    addSet(exerciseInBlockId);
  };

  const blockColors = getBlockColors(blockType);
  const setId = setsByExercise[exerciseInBlockId]?.[0];
  const measurementTemplate =
    sets[setId]?.measurement_template || "weight_reps";

  // Obtener información del template para headers dinámicos
  const template = getMeasurementTemplate(measurementTemplate);

  // Función para obtener los títulos de las columnas basado en el template
  const getTemplateHeaders = () => {
    if (!template) return { primary: "PRIMARY", secondary: "SECONDARY" };

    const primaryLabel = template.fields[0]?.label.toUpperCase() || "PRIMARY";
    const secondaryLabel =
      template.fields[1]?.label.toUpperCase() || "SECONDARY";

    return { primary: primaryLabel, secondary: secondaryLabel };
  };

  const { primary, secondary } = getTemplateHeaders();
  const hasSecondaryField = template?.fields && template.fields.length > 1;

  return (
    <View style={{ marginTop: 12 }}>
      {/* Table Headers */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          marginBottom: 8,
          paddingHorizontal: 8,
        }}
      >
        <View style={{ width: 40, alignItems: "center" }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            SET
          </Typography>
        </View>
        <View style={{ width: 80, alignItems: "center" }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            PREV
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8, alignItems: "center" }}>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
            {primary === "KG" && (
              <Dumbbell size={12} color={colors.textMuted} />
            )}

            {primary === "SEG" && (
              <Hourglass size={12} color={colors.textMuted} />
            )}

            {primary === "KM" && (
              <Footprints size={12} color={colors.textMuted} />
            )}
            <Typography variant="caption" weight="medium" color="textMuted">
              {primary}
            </Typography>
          </View>
        </View>
        {hasSecondaryField && (
          <View style={{ flex: 1, paddingHorizontal: 8, alignItems: "center" }}>
            <Typography variant="caption" weight="medium" color="textMuted">
              {secondary}
            </Typography>
          </View>
        )}

        {session?.routine?.show_rpe && (
          <View
            style={{ flex: 0.8, paddingHorizontal: 8, alignItems: "center" }}
          >
            <Typography variant="caption" weight="medium" color="textMuted">
              RPE
            </Typography>
          </View>
        )}
        <View style={{ width: 40, alignItems: "center" }}>
          <Check size={16} color={colors.textMuted} />
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
          marginTop: 6,
          borderWidth: 1,
          borderColor: blockColors.primary,
          borderStyle: "dashed",
          borderRadius: 4,
          backgroundColor: blockColors.light,
          marginHorizontal: 8,
          opacity: 0.6,
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

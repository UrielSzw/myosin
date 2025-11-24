import { Link2, RotateCcw, Target } from "lucide-react-native";
import {
  MeasurementTemplateId,
  getMeasurementTemplate,
} from "../types/measurement";
import { IBlockType } from "../types/workout";
import { fromKg, type WeightUnit } from "../utils/weight-conversion";
import { useColorScheme } from "./use-color-scheme";
import { useUserPreferences } from "./use-user-preferences-store";

export const useBlockStyles = () => {
  const { colors } = useColorScheme();

  // Get user's weight unit preference
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const getBlockColors = (blockType: IBlockType) => {
    switch (blockType) {
      case "superset":
        return {
          primary: "#FF6B35", // Orange
          light: "#FF6B3520",
          border: "#FF6B3530",
        };
      case "circuit":
        return {
          primary: "#4A90E2", // Blue
          light: "#4A90E220",
          border: "#4A90E230",
        };
      default: // individual
        return {
          primary: colors.primary[500],
          light: colors.primary[500] + "20",
          border: colors.primary[500] + "30",
        };
    }
  };

  const getBlockTypeLabel = (blockType: IBlockType) => {
    switch (blockType) {
      case "superset":
        return "Superserie";
      case "circuit":
        return "Circuito";
      default:
        return "Individual";
    }
  };

  const getSetTypeLabel = (type: string) => {
    switch (type) {
      case "warmup":
        return "W";
      case "drop":
        return "D";
      case "failure":
        return "F";
      case "cluster":
        return "C";
      case "rest-pause":
        return "RP";
      case "mechanical":
        return "M";
      case "eccentric":
        return "E";
      case "partial":
        return "P";
      case "isometric":
        return "I";
      default:
        return "";
    }
  };

  const getSetTypeColor = (type: string) => {
    switch (type) {
      case "warmup":
        return colors.warning[500];
      case "drop":
        return colors.error[500];
      case "failure":
        return colors.error[500];
      case "cluster":
        return colors.info[500];
      case "rest-pause":
        return colors.secondary[500];
      case "mechanical":
        return colors.success[500];
      case "eccentric":
        return "#8B5CF6"; // Purple
      case "partial":
        return "#F97316"; // Orange
      case "isometric":
        return "#06B6D4"; // Cyan
      default:
        return colors.primary[500];
    }
  };

  const getBlockTypeIcon = (blockType: IBlockType) => {
    switch (blockType) {
      case "superset":
        return <Link2 size={18} color={getBlockColors(blockType).primary} />;
      case "circuit":
        return (
          <RotateCcw size={18} color={getBlockColors(blockType).primary} />
        );
      default:
        return <Target size={18} color={getBlockColors(blockType).primary} />;
    }
  };

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0
      ? `${mins}:${secs.toString().padStart(2, "0")} min`
      : `${mins} min`;
  };

  const formatMeasurementValue = (
    value: number | null,
    range: { min: number; max: number } | null,
    templateId: MeasurementTemplateId,
    fieldId: "primary" | "secondary",
    userWeightUnit?: WeightUnit
  ) => {
    const unit = userWeightUnit || weightUnit;
    const template = getMeasurementTemplate(templateId, unit);
    const field = template.fields.find((f) => f.id === fieldId);

    if (!field) return "";

    // Handle range values
    if (range) {
      const min = range.min || "";
      const max = range.max || "";

      // Si es weight, formatear ambos valores
      if (field.type === "weight" && min && max) {
        const minFormatted = fromKg(Number(min), unit, 1);
        const maxFormatted = fromKg(Number(max), unit, 1);
        return `${minFormatted}-${maxFormatted}`;
      }

      if (min && max) {
        return `${min}-${max}`;
      } else if (min) {
        return min.toString();
      } else if (max) {
        return max.toString();
      }
      return "";
    }

    // Handle single values
    if (value === null || value === undefined) return "";

    // Format based on field type
    switch (field.type) {
      case "time":
        if (field.unit === "min") {
          // Convert seconds to minutes for display
          const mins = Math.floor(value / 60);
          const secs = value % 60;
          if (secs === 0) return `${mins}min`;
          return `${mins}:${secs.toString().padStart(2, "0")}`;
        } else {
          // Display as seconds
          return `${value}s`;
        }
      case "distance":
        if (field.unit === "km") {
          return value % 1 === 0 ? `${value}` : `${value.toFixed(1)}`;
        } else {
          return `${value}`;
        }
      case "weight":
        // Convert from kg (stored) to user's preferred unit
        const displayValue = fromKg(value, unit, 1);
        return `${displayValue}${unit}`;
      case "reps":
      default:
        return `${value}`;
    }
  };

  return {
    getBlockColors,
    getBlockTypeLabel,
    getSetTypeLabel,
    getSetTypeColor,
    getBlockTypeIcon,
    formatRestTime,
    formatMeasurementValue,
  };
};

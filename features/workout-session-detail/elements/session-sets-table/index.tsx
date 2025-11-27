import { BaseWorkoutSet } from "@/shared/db/schema/workout-session";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutSessionDetailTranslations } from "@/shared/translations/workout-session-detail";
import {
    getMeasurementTemplate,
    hasWeightMeasurement,
} from "@/shared/types/measurement";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { Check, X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  sets: BaseWorkoutSet[];
  showRpe: boolean;
  lang: "es" | "en";
};

export const SessionSetsTable: React.FC<Props> = ({ sets, showRpe, lang }) => {
  const { colors } = useColorScheme();
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const t = workoutSessionDetailTranslations;

  // Get measurement template for dynamic headers (assume all sets have same template)
  const measurementTemplate =
    sets.length > 0
      ? getMeasurementTemplate(sets[0].measurement_template, weightUnit)
      : null;

  const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const formatActualValues = (set: BaseWorkoutSet): string => {
    if (!set.completed) return t.notCompleted[lang];

    if (!measurementTemplate) return "-";

    let primaryValue = set.actual_primary_value;
    const secondaryValue = set.actual_secondary_value;

    // Convert weight values from kg to user's preferred unit
    if (
      hasWeightMeasurement(set.measurement_template) &&
      primaryValue !== null
    ) {
      primaryValue = fromKg(primaryValue, weightUnit, 1);
    }

    if (measurementTemplate.fields.length === 1) {
      // Single metric template
      const field = measurementTemplate.fields[0];
      return `${formatValue(primaryValue)}${field.unit}`;
    } else {
      // Dual metric template
      const primaryField = measurementTemplate.fields[0];
      const secondaryField = measurementTemplate.fields[1];
      return `${formatValue(primaryValue)}${primaryField.unit} × ${formatValue(
        secondaryValue
      )}${secondaryField.unit}`;
    }
  };

  const getVolumeDisplay = (set: BaseWorkoutSet): string => {
    if (!set.completed || !hasWeightMeasurement(set.measurement_template))
      return "";

    const weight = set.actual_primary_value || 0;
    const reps = set.actual_secondary_value || 0;
    const volumeKg = weight * reps;
    const displayVolume = fromKg(volumeKg, weightUnit, 0);
    return `${t.volume[lang]}: ${displayVolume.toLocaleString()}${weightUnit}`;
  };

  const getRPEColor = (rpe: number | null, planned: number | null) => {
    if (!rpe) return colors.textMuted;
    if (!planned) return colors.text;

    const diff = rpe - planned;
    if (diff > 0.5) return colors.error[600];
    if (diff < -0.5) return colors.success[600];
    return colors.text;
  };

  return (
    <View>
      {/* Table Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
      >
        <View style={{ width: 40, alignItems: "center" }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            {t.set[lang]}
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            {measurementTemplate?.fields.length === 1
              ? measurementTemplate.fields[0].label
              : measurementTemplate?.fields.map((f) => f.label).join(" × ") ||
                t.completed[lang]}
          </Typography>
        </View>
        {showRpe && (
          <View style={{ width: 50, alignItems: "center" }}>
            <Typography variant="caption" weight="medium" color="textMuted">
              RPE
            </Typography>
          </View>
        )}
        <View style={{ width: 40, alignItems: "center" }}>
          <Check size={14} color={colors.textMuted} />
        </View>
      </View>

      {/* Table Rows */}
      {sets.map((set) => (
        <View
          key={set.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 6,
            backgroundColor: "transparent",
            borderRadius: 4,
            marginBottom: 4,
            paddingHorizontal: 4,
          }}
        >
          {/* Set Number */}
          <View style={{ width: 40, alignItems: "center" }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor:
                  set.set_type !== "normal"
                    ? getSetTypeColor(set.set_type)
                    : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color:
                    set.set_type !== "normal"
                      ? "white"
                      : set.completed
                      ? "#ffffff"
                      : colors.text,
                  fontSize: 10,
                }}
              >
                {getSetTypeLabel(set.set_type) ||
                  (set.order_index + 1).toString()}
              </Typography>
            </View>
          </View>

          {/* Actual Values */}
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Typography
              variant="body2"
              weight="semibold"
              style={{
                color: set.completed ? colors.text : colors.textMuted,
              }}
            >
              {formatActualValues(set)}
            </Typography>
            {set.completed &&
              hasWeightMeasurement(set.measurement_template) && (
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 10 }}
                >
                  {getVolumeDisplay(set)}
                </Typography>
              )}
          </View>

          {/* RPE */}
          {showRpe && (
            <View
              style={{
                width: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {set.actual_rpe ? (
                <View style={{ alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    style={{
                      color: getRPEColor(set.actual_rpe, set.planned_rpe),
                    }}
                  >
                    {formatValue(set.actual_rpe)}
                  </Typography>
                  {set.planned_rpe && (
                    <Typography
                      variant="caption"
                      color="textMuted"
                      style={{ fontSize: 9 }}
                    >
                      ({formatValue(set.planned_rpe)})
                    </Typography>
                  )}
                </View>
              ) : (
                <Typography variant="body2" color="textMuted">
                  -
                </Typography>
              )}
            </View>
          )}

          {/* Completion Status */}
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {set.completed ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.success[500],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={12} color="#ffffff" />
              </View>
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.gray[200],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={12} color={colors.gray[500]} />
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

import { BaseWorkoutSet } from "@/shared/db/schema/workout-session";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  getMeasurementTemplate,
  hasWeightMeasurement,
} from "@/shared/types/measurement";
import { Typography } from "@/shared/ui/typography";
import { fromKm, fromMeters } from "@/shared/utils/distance-conversion";
import { fromKg } from "@/shared/utils/weight-conversion";
import { Check, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  set: BaseWorkoutSet;
  index: number;
  showRpe: boolean;
  lang: string;
};

export const SessionSetRowV2: React.FC<Props> = ({
  set,
  index,
  showRpe,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  const measurementTemplate = getMeasurementTemplate(
    set.measurement_template,
    weightUnit,
    distanceUnit
  );

  const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const formatActualValues = (): string => {
    if (!set.completed) return lang === "es" ? "No completado" : "Not completed";

    if (!measurementTemplate) return "-";

    let primaryValue = set.actual_primary_value;
    let secondaryValue = set.actual_secondary_value;

    // Get field types for conversion
    const primaryFieldType = measurementTemplate.fields[0]?.type;
    const secondaryFieldType = measurementTemplate.fields[1]?.type;

    // Convert primary value
    if (primaryValue !== null) {
      if (primaryFieldType === "weight") {
        primaryValue = fromKg(primaryValue, weightUnit, 1);
      } else if (primaryFieldType === "distance") {
        const primaryUnit = measurementTemplate.fields[0]?.unit;
        if (primaryUnit === "km" || primaryUnit === "mi") {
          primaryValue = fromKm(primaryValue, distanceUnit, 2);
        } else {
          primaryValue = fromMeters(primaryValue, distanceUnit, 0);
        }
      }
    }

    // Convert secondary value
    if (secondaryValue !== null && secondaryFieldType) {
      if (secondaryFieldType === "weight") {
        secondaryValue = fromKg(secondaryValue, weightUnit, 1);
      } else if (secondaryFieldType === "distance") {
        const secondaryUnit = measurementTemplate.fields[1]?.unit;
        if (secondaryUnit === "km" || secondaryUnit === "mi") {
          secondaryValue = fromKm(secondaryValue, distanceUnit, 2);
        } else {
          secondaryValue = fromMeters(secondaryValue, distanceUnit, 0);
        }
      }
    }

    if (measurementTemplate.fields.length === 1) {
      const field = measurementTemplate.fields[0];
      return `${formatValue(primaryValue)}${field.unit}`;
    } else {
      const primaryField = measurementTemplate.fields[0];
      const secondaryField = measurementTemplate.fields[1];
      return `${formatValue(primaryValue)}${primaryField.unit} × ${formatValue(
        secondaryValue
      )}${secondaryField.unit}`;
    }
  };

  const getVolumeDisplay = (): string | null => {
    if (!set.completed || !hasWeightMeasurement(set.measurement_template))
      return null;

    const weight = set.actual_primary_value || 0;
    const reps = set.actual_secondary_value || 0;
    const volumeKg = weight * reps;
    const displayVolume = fromKg(volumeKg, weightUnit, 0);
    return `${displayVolume.toLocaleString()}${weightUnit}`;
  };

  const getRPEColor = () => {
    if (!set.actual_rpe) return colors.textMuted;
    if (!set.planned_rpe) return colors.text;

    const diff = set.actual_rpe - set.planned_rpe;
    if (diff > 0.5) return colors.error[500];
    if (diff < -0.5) return colors.success[500];
    return colors.text;
  };

  const setTypeLabel = getSetTypeLabel(set.set_type);
  const setTypeColor = getSetTypeColor(set.set_type);
  const volume = getVolumeDisplay();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? set.completed
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.01)"
            : set.completed
            ? "rgba(0,0,0,0.02)"
            : "rgba(0,0,0,0.01)",
        },
      ]}
    >
      {/* Set Number Badge */}
      <View
        style={[
          styles.setBadge,
          {
            backgroundColor:
              set.set_type !== "normal"
                ? setTypeColor
                : set.completed
                ? colors.success[500]
                : isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        <Typography
          variant="caption"
          weight="bold"
          style={{
            color:
              set.set_type !== "normal" || set.completed ? "#fff" : colors.text,
            fontSize: 10,
          }}
        >
          {setTypeLabel || (set.order_index + 1).toString()}
        </Typography>
      </View>

      {/* Values */}
      <View style={styles.valuesContainer}>
        <Typography
          variant="body2"
          weight={set.completed ? "semibold" : "normal"}
          style={{
            color: set.completed ? colors.text : colors.textMuted,
          }}
        >
          {formatActualValues()}
        </Typography>
        {volume && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ fontSize: 10, marginTop: 1 }}
          >
            Vol: {volume}
          </Typography>
        )}
      </View>

      {/* RPE */}
      {showRpe && (
        <View style={styles.rpeContainer}>
          {set.actual_rpe ? (
            <View style={styles.rpeValue}>
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: getRPEColor() }}
              >
                {formatValue(set.actual_rpe)}
              </Typography>
              {set.planned_rpe && (
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 9 }}
                >
                  /{formatValue(set.planned_rpe)}
                </Typography>
              )}
            </View>
          ) : (
            <Typography variant="caption" color="textMuted">
              -
            </Typography>
          )}
        </View>
      )}

      {/* Status Icon */}
      <View
        style={[
          styles.statusIcon,
          {
            backgroundColor: set.completed
              ? `${colors.success[500]}15`
              : isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
          },
        ]}
      >
        {set.completed ? (
          <Check size={12} color={colors.success[500]} strokeWidth={3} />
        ) : (
          <X size={12} color={colors.textMuted} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 10,
  },
  setBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  valuesContainer: {
    flex: 1,
  },
  rpeContainer: {
    width: 45,
    alignItems: "center",
  },
  rpeValue: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

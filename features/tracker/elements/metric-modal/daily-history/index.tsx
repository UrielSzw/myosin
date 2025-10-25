import { useDeleteEntry } from "@/features/tracker/hooks/use-tracker-data";
import { formatTime, formatValue } from "@/features/tracker/utils/helpers";
import { TrackerDayData } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Clock, Trash2 } from "lucide-react-native";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  selectedMetricId: string | null;
  unit: string | null;
  dayData?: TrackerDayData;
};

export const DailyHistory: React.FC<Props> = ({
  selectedMetricId,
  unit,
  dayData,
}) => {
  const { colors } = useColorScheme();
  const deleteEntryMutation = useDeleteEntry();

  const todayEntries = useMemo(() => {
    if (!dayData || !selectedMetricId) return [];

    // Buscar las entradas específicas de la métrica
    const metricData = dayData.metrics.find((m) => m.id === selectedMetricId);
    return metricData?.entries || [];
  }, [dayData, selectedMetricId]);

  const handleRemoveEntry = async (entryId: string) => {
    try {
      await deleteEntryMutation.mutateAsync(entryId);
    } catch (error) {
      console.error("Error removing entry:", error);
    }
  };

  if (!todayEntries.length) return null;

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Historial de Hoy
      </Typography>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {todayEntries.map((entry, index) => (
          <View
            key={entry.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: index < todayEntries.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            {/* Entry Info */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Clock size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {formatTime(entry.recorded_at)}
                </Typography>
              </View>
              <Typography
                variant="body2"
                weight="medium"
                style={{ marginBottom: 2 }}
              >
                +{formatValue(entry.value)} {unit}
              </Typography>
              {entry.notes && (
                <Typography variant="caption" color="textMuted">
                  {entry.notes}
                </Typography>
              )}
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleRemoveEntry(entry.id)}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: colors.error[50],
              }}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={colors.error[500]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

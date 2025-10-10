import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Zap } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTodaySummary } from "../../hooks/use-tracker-data";

type Props = {
  selectedDate: string;
};

export const TrackerHeader: React.FC<Props> = ({ selectedDate }) => {
  const { colors } = useColorScheme();

  // Obtener resumen del día usando React Query
  const { data: todaySummary } = useTodaySummary();

  // Calcular progreso total del día
  const totalMetrics = todaySummary?.summary.length || 0;
  const completedTargets = todaySummary?.completedTargets || 0;
  const progressPercentage =
    totalMetrics > 0 ? Math.round((completedTargets / totalMetrics) * 100) : 0;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
          Tracker
        </Typography>
        {totalMetrics > 0 && (
          <View
            style={{
              width: "100%",
            }}
          >
            {/* Progress Overview */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Typography variant="body2" color="textMuted">
                  Progreso del día
                </Typography>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Zap size={16} color={colors.secondary[500]} />
                  <Typography
                    variant="h4"
                    weight="bold"
                    style={{ color: colors.secondary[500] }}
                  >
                    {progressPercentage}%
                  </Typography>
                </View>
              </View>

              {/* Progress Bar */}
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.gray[200],
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.secondary[500],
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

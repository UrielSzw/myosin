import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { BarChart3, Target, TrendingUp, Zap } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SessionAnalytics as SessionAnalyticsType } from "../../hooks/use-session-detail";

type Props = {
  analytics: SessionAnalyticsType | null;
};

export const SessionAnalytics: React.FC<Props> = ({ analytics }) => {
  const { colors } = useColorScheme();

  if (!analytics) {
    return null;
  }

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, color = colors.primary[500] }) => (
    <Card variant="outlined" padding="md" style={{ flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {icon}
        </View>
        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginBottom: 2 }}
        >
          {title}
        </Typography>
        <Typography variant="h6" weight="bold" style={{ color }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ textAlign: "center" }}
          >
            {subtitle}
          </Typography>
        )}
      </View>
    </Card>
  );

  return (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Resumen de Sesión
      </Typography>

      {/* Main stats row */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <StatCard
          icon={<TrendingUp size={20} color={colors.primary[500]} />}
          title="Volumen Total"
          value={`${analytics.totalVolume.toLocaleString()}kg`}
          subtitle="Peso × Reps"
        />

        {analytics.averageRPE && (
          <StatCard
            icon={<Zap size={20} color={colors.warning[500]} />}
            title="RPE Promedio"
            value={analytics.averageRPE.toString()}
            subtitle={`${analytics.plannedVsActual.rpeUsage}% sets con RPE`}
            color={colors.warning[500]}
          />
        )}

        {analytics.bestSets.length > 0 && (
          <StatCard
            icon={<Target size={20} color={colors.success[500]} />}
            title="Mejor Set"
            value={`${analytics.bestSets[0].weight}kg`}
            subtitle={`${analytics.bestSets[0].reps} reps - ${analytics.bestSets[0].exerciseName}`}
            color={colors.success[500]}
          />
        )}
      </View>

      {/* Planned vs Actual comparison */}
      {(analytics.plannedVsActual.weightDifference !== 0 ||
        analytics.plannedVsActual.repsDifference !== 0) && (
        <Card variant="outlined" padding="lg" style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <BarChart3 size={18} color={colors.text} />
            <Typography variant="body1" weight="semibold">
              Planificado vs Realizado
            </Typography>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            {analytics.plannedVsActual.weightDifference !== 0 && (
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="textMuted">
                  Diferencia de Peso
                </Typography>
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{
                    color:
                      analytics.plannedVsActual.weightDifference > 0
                        ? colors.success[600]
                        : colors.error[600],
                  }}
                >
                  {analytics.plannedVsActual.weightDifference > 0 ? "+" : ""}
                  {analytics.plannedVsActual.weightDifference}kg
                </Typography>
              </View>
            )}

            {analytics.plannedVsActual.repsDifference !== 0 && (
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="textMuted">
                  Diferencia de Reps
                </Typography>
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{
                    color:
                      analytics.plannedVsActual.repsDifference > 0
                        ? colors.success[600]
                        : colors.error[600],
                  }}
                >
                  {analytics.plannedVsActual.repsDifference > 0 ? "+" : ""}
                  {analytics.plannedVsActual.repsDifference} reps
                </Typography>
              </View>
            )}
          </View>
        </Card>
      )}

      {/* Muscle group distribution */}
      {analytics.muscleGroupVolume.length > 0 && (
        <Card variant="outlined" padding="lg">
          <Typography
            variant="body1"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Distribución por Grupo Muscular
          </Typography>

          {analytics.muscleGroupVolume.map((group, index) => (
            <View
              key={group.group}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom:
                  index === analytics.muscleGroupVolume.length - 1 ? 0 : 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Typography variant="body2">{group.group}</Typography>
                  <Typography variant="body2" weight="semibold">
                    {group.sets} sets ({group.percentage}%)
                  </Typography>
                </View>
                <View
                  style={{
                    height: 4,
                    backgroundColor: colors.gray[200],
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${group.percentage}%`,
                      backgroundColor: colors.primary[500],
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </Card>
      )}
    </View>
  );
};

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { PRHistoryItem } from "../../hooks/use-pr-detail";
import { PRProgressChart } from "../pr-progress-chart";

type Props = {
  history: PRHistoryItem[];
  exerciseName: string;
};

export const PRChartSection: React.FC<Props> = ({ history, exerciseName }) => {
  const { colors } = useColorScheme();

  // Si hay pocos datos, mostrar estado reducido
  if (history.length < 2) {
    return (
      <Card variant="outlined" padding="lg" style={{ margin: 16 }}>
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary[100],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <TrendingUp size={24} color={colors.primary[500]} />
          </View>
          <Typography variant="h6" style={{ marginBottom: 8 }}>
            Progresión de PRs
          </Typography>
          <Typography variant="body2" color="textMuted" align="center">
            {history.length === 0
              ? "No hay PRs registrados aún"
              : "Necesitas al menos 2 PRs para ver el gráfico de progresión"}
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="lg" style={{ margin: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <TrendingUp size={16} color={colors.primary[500]} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="h6">Progresión de PRs</Typography>
          <Typography variant="caption" color="textMuted">
            {history.length} record{history.length !== 1 ? "s" : ""} • Estimado
            1RM
          </Typography>
        </View>
      </View>

      {/* Chart */}
      <PRProgressChart history={history} height={220} />

      {/* Footer con info adicional */}
      <View
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Typography variant="caption" color="textMuted">
            Mejor PR
          </Typography>
          <Typography variant="body2" weight="medium">
            {Math.max(...history.map((h) => h.estimated_1rm)).toFixed(1)}kg
          </Typography>
        </View>
        <View style={{ alignItems: "center" }}>
          <Typography variant="caption" color="textMuted">
            Progreso Total
          </Typography>
          <Typography variant="body2" weight="medium">
            +
            {(
              Math.max(...history.map((h) => h.estimated_1rm)) -
              Math.min(...history.map((h) => h.estimated_1rm))
            ).toFixed(1)}
            kg
          </Typography>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Typography variant="caption" color="textMuted">
            Último PR
          </Typography>
          <Typography variant="body2" weight="medium">
            {history[0]?.estimated_1rm.toFixed(1)}kg
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export default PRChartSection;

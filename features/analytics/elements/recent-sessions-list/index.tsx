import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { ChevronRight, Clock } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SessionData } from "../../types/session";
import { SessionItem } from "./session-item";

type Props = {
  data: SessionData[];
  loading?: boolean;
};

export const RecentSessionsListComponent: React.FC<Props> = ({
  data,
  loading,
}) => {
  const { colors } = useColorScheme();

  if (loading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Sesiones Recientes
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            Cargando...
          </Typography>
        </Card>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Sesiones Recientes
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Clock
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              No hay sesiones recientes
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              Completa tu primer entrenamiento para ver el historial
            </Typography>
          </View>
        </Card>
      </View>
    );
  }

  // Calcular estadísticas rápidas
  const avgCompletion = Math.round(
    (data.reduce(
      (sum, session) =>
        sum + session.total_sets_completed / session.total_sets_planned,
      0
    ) /
      data.length) *
      100
  );

  const totalSetsCompleted = data.reduce(
    (sum, session) => sum + session.total_sets_completed,
    0
  );

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography variant="h5" weight="semibold">
          Sesiones Recientes
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Typography variant="caption" color="textMuted">
            {data.length} sesiones
          </Typography>
          <ChevronRight size={14} color={colors.textMuted} />
        </View>
      </View>

      {data.map((session) => (
        <SessionItem key={session.id} session={session} colors={colors} />
      ))}

      {/* Estadísticas rápidas */}
      <View
        style={{
          marginBottom: 12,
          paddingHorizontal: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="textMuted">
          Promedio: {avgCompletion}% completado
        </Typography>
        <Typography variant="caption" color="textMuted">
          Total: {totalSetsCompleted} sets
        </Typography>
      </View>
    </View>
  );
};

export const RecentSessionsList = React.memo(RecentSessionsListComponent);
export default RecentSessionsList;

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Trophy,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { PRData } from "../../types/pr";
import { PRItem } from "./pr-item";

type Props = {
  data: PRData[];
  loading?: boolean;
  showTop?: number;
  onPRPress?: (exerciseId: string, exerciseName?: string) => void;
};

export const SmartPRDisplayComponent: React.FC<Props> = ({
  data,
  loading,
  showTop = 4,
  onPRPress,
}) => {
  const { colors } = useColorScheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Records Personales
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            Cargando...
          </Typography>
        </Card>
      </View>
    );
  }

  // Ordenar PRs por fecha de logro (más recientes primero)
  const sortedPRs = [...data].sort(
    (a, b) =>
      new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
  );

  const hasMoreThanMax = sortedPRs.length > showTop;
  const displayData = isExpanded ? sortedPRs : sortedPRs.slice(0, showTop);
  const hiddenCount = sortedPRs.length - showTop;

  if (sortedPRs.length === 0) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Records Personales
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Trophy
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              Sin records personales aún
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              Completa entrenamientos para establecer tus primeros PRs
            </Typography>
          </View>
        </Card>
      </View>
    );
  }

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
          Records Personales
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Typography variant="caption" color="textMuted">
            {sortedPRs.length} total
          </Typography>
          <TrendingUp size={14} color={colors.textMuted} />
        </View>
      </View>

      {displayData.map((pr) => (
        <PRItem
          key={pr.id}
          pr={pr}
          onPress={() => onPRPress?.(pr.exercise_id, pr.exercise_name)}
          colors={colors}
        />
      ))}

      {/* Estadística rápida */}
      {!isExpanded && sortedPRs.length > 0 && (
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
            Mejor 1RM:{" "}
            {Math.max(...sortedPRs.map((pr) => pr.estimated_1rm)).toFixed(0)}kg
          </Typography>
          <Typography variant="caption" color="textMuted">
            Esta semana:{" "}
            {
              sortedPRs.filter(
                (pr) =>
                  Date.now() - new Date(pr.achieved_at).getTime() <
                  7 * 24 * 60 * 60 * 1000
              ).length
            }{" "}
            nuevos
          </Typography>
        </View>
      )}

      {/* Botón de expandir/contraer */}
      {hasMoreThanMax && (
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={({ pressed }) => [
            {
              marginTop: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: pressed ? colors.gray[100] : colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            },
          ]}
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} color={colors.primary[500]} />
              <Typography variant="body2" weight="medium" color="primary">
                Ver menos
              </Typography>
            </>
          ) : (
            <>
              <ChevronDown size={16} color={colors.primary[500]} />
              <Typography variant="body2" weight="medium" color="primary">
                Ver todos ({hiddenCount} más)
              </Typography>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
};

export const SmartPRDisplay = React.memo(SmartPRDisplayComponent);
export default SmartPRDisplay;

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { VolumeDisplay } from "@/shared/ui/volume-display";
import type { WeeklyVolumeMap } from "@/shared/utils/volume-calculator";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

type Props = {
  data?: WeeklyVolumeMap;
  loading?: boolean;
  showTop?: number;
};

export const SmartVolumeDisplayComponent: React.FC<Props> = ({
  data,
  loading,
  showTop = 4,
}) => {
  const { colors } = useColorScheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Volumen Semanal
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            Cargando...
          </Typography>
        </Card>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Volumen Semanal
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <TrendingUp
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              No hay datos de volumen disponibles
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              Agrega rutinas con días activos para ver el análisis
            </Typography>
          </View>
        </Card>
      </View>
    );
  }

  // Convertir WeeklyVolumeMap a MuscleVolumeData y ordenar por sets
  const volumeEntries = Object.entries(data)
    .filter(([_, volumeData]) => volumeData.totalSets > 0)
    .map(([category, volumeData]) => ({
      category: getCategoryDisplayName(category),
      sets: volumeData.totalSets,
      percentage: 0, // Se calculará después
    }))
    .sort((a, b) => b.sets - a.sets);

  const totalSets = volumeEntries.reduce((sum, item) => sum + item.sets, 0);

  // Calcular porcentajes
  volumeEntries.forEach((item) => {
    item.percentage = totalSets > 0 ? (item.sets / totalSets) * 100 : 0;
  });

  // Determinar qué mostrar
  const hasMoreThanMax = volumeEntries.length > showTop;
  const displayData = isExpanded
    ? volumeEntries
    : volumeEntries.slice(0, showTop);
  const hiddenCount = volumeEntries.length - showTop;

  if (volumeEntries.length === 0) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Volumen Semanal
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <TrendingUp
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              Sin datos de volumen
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              Programa rutinas con ejercicios para ver el análisis
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
          marginBottom: 10,
        }}
      >
        <Typography variant="h5" weight="semibold">
          Volumen Semanal
        </Typography>
        <Typography variant="caption" color="textMuted">
          {totalSets} sets/semana
        </Typography>
      </View>

      {isExpanded ? (
        // Vista expandida con VolumeDisplay completo
        <VolumeDisplay
          volumeData={displayData}
          totalSets={totalSets}
          title="Distribución Completa por Músculo"
          subtitle="Análisis detallado de volumen semanal"
        />
      ) : (
        // Vista compacta con top músculos
        <Card variant="outlined" padding="lg">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <TrendingUp size={18} color={colors.primary[500]} />
            <Typography variant="body1" weight="medium">
              Top {showTop} Músculos
            </Typography>
          </View>

          {displayData.map((item, index) => (
            <View
              key={item.category}
              style={{
                marginBottom: index === displayData.length - 1 ? 0 : 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Typography variant="body2" weight="medium">
                  {item.category}
                </Typography>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Typography variant="caption" color="textMuted">
                    {item.sets} sets
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{ color: colors.primary[500] }}
                  >
                    {item.percentage.toFixed(1)}%
                  </Typography>
                </View>
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
                    width: `${(item.sets / volumeEntries[0].sets) * 100}%`,
                    backgroundColor: colors.primary[500],
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>
          ))}
        </Card>
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

// Helper para nombres de categorías en español
function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    chest: "Pecho",
    back: "Espalda",
    shoulders: "Hombros",
    arms: "Brazos",
    legs: "Piernas",
    core: "Core",
    other: "Otro",
  };
  return displayNames[category] || category;
}

export const SmartVolumeDisplay = React.memo(SmartVolumeDisplayComponent);
export default SmartVolumeDisplay;

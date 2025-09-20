import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { MUSCLE_CATEGORIES } from "@/shared/utils/muscle-categories";
import { Typography } from "@/shared/ui/typography";
import { Card } from "@/shared/ui/card";
import React from "react";
import { View, ScrollView } from "react-native";
import { TrendingUp, Activity, Target } from "lucide-react-native";

export interface MuscleVolumeData {
  category: string;
  sets: number;
  percentage?: number;
}

export interface VolumeDisplayProps {
  volumeData: MuscleVolumeData[];
  totalSets: number;
  showPercentages?: boolean;
  title?: string;
  subtitle?: string;
}

const VolumeBar: React.FC<{
  category: string;
  sets: number;
  percentage: number;
  maxSets: number;
  color: string;
}> = ({ category, sets, percentage, maxSets, color }) => {
  const { colors } = useColorScheme();
  const barWidth = maxSets > 0 ? (sets / maxSets) * 100 : 0;

  return (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="body2" weight="medium">
          {category}
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Typography variant="caption" color="textMuted">
            {sets} sets
          </Typography>
          <Typography variant="caption" weight="medium" style={{ color }}>
            {percentage.toFixed(1)}%
          </Typography>
        </View>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: colors.gray[200],
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${barWidth}%`,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
};

export const VolumeDisplay: React.FC<VolumeDisplayProps> = ({
  volumeData,
  totalSets,
  showPercentages = true,
  title = "Análisis de Volumen",
  subtitle,
}) => {
  const { colors } = useColorScheme();

  // Filtrar datos con sets > 0 y ordenar por cantidad
  const filteredData = volumeData
    .filter((item) => item.sets > 0)
    .sort((a, b) => b.sets - a.sets);

  const maxSets = filteredData.length > 0 ? filteredData[0].sets : 0;

  // Colores para cada categoría muscular
  const categoryColors: Record<string, string> = {
    Pecho: colors.primary[500],
    Espalda: colors.secondary[500],
    Hombros: colors.success[500],
    Brazos: colors.warning[500],
    Piernas: colors.info[500],
    Core: colors.error[500],
    Otro: colors.gray[500],
  };

  if (filteredData.length === 0) {
    return (
      <Card variant="outlined" padding="lg">
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Activity size={32} color={colors.gray[400]} style={{ marginBottom: 8 }} />
          <Typography variant="body1" color="textMuted" align="center">
            No hay datos de volumen disponibles
          </Typography>
          <Typography variant="caption" color="textMuted" align="center">
            Selecciona rutinas con días activos para ver el análisis
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="lg">
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <TrendingUp size={20} color={colors.primary[500]} />
          <Typography variant="h6" weight="semibold">
            {title}
          </Typography>
        </View>
        {subtitle && (
          <Typography variant="body2" color="textMuted">
            {subtitle}
          </Typography>
        )}
      </View>

      {/* Resumen total */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Target size={16} color={colors.primary[500]} style={{ marginRight: 8 }} />
        <Typography variant="body2" color="textMuted">
          Total: 
        </Typography>
        <Typography variant="body1" weight="semibold" style={{ marginLeft: 4 }}>
          {totalSets} sets semanales
        </Typography>
      </View>

      {/* Barras de volumen */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredData.map((item, index) => (
          <VolumeBar
            key={item.category}
            category={item.category}
            sets={item.sets}
            percentage={item.percentage || 0}
            maxSets={maxSets}
            color={categoryColors[item.category] || colors.gray[500]}
          />
        ))}
      </ScrollView>

      {/* Leyenda de categorías */}
      <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Typography variant="caption" color="textMuted" style={{ marginBottom: 8 }}>
          Distribución por grupos musculares principales
        </Typography>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {Object.keys(MUSCLE_CATEGORIES).map((category) => {
            const hasData = filteredData.some((item) => item.category === category);
            if (!hasData) return null;
            
            return (
              <View
                key={category}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: colors.gray[100],
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: categoryColors[category] || colors.gray[500],
                  }}
                />
                <Typography variant="caption" color="textMuted">
                  {category}
                </Typography>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
};
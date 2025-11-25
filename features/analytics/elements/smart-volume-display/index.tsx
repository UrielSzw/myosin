import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          {t.weeklyVolume[lang]}
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            {t.loading[lang]}
          </Typography>
        </Card>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          {t.weeklyVolume[lang]}
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <TrendingUp
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              {t.noVolumeData[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {t.addRoutinesForAnalysis[lang]}
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
      category: getCategoryDisplayName(category, lang),
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
          {t.weeklyVolume[lang]}
        </Typography>
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <TrendingUp
              size={32}
              color={colors.gray[400]}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" color="textMuted" align="center">
              {t.noVolumeDataShort[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {t.scheduleRoutinesForAnalysis[lang]}
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
          {t.weeklyVolume[lang]}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {totalSets} {t.setsPerWeek[lang]}
        </Typography>
      </View>

      {isExpanded ? (
        // Vista expandida con VolumeDisplay completo
        <VolumeDisplay
          volumeData={displayData}
          totalSets={totalSets}
          title={t.fullDistribution[lang]}
          subtitle={t.detailedWeeklyAnalysis[lang]}
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
              {t.topMuscles[lang].replace("{count}", showTop.toString())}
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
                    {item.sets} {t.sets[lang]}
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
                {t.viewLess[lang]}
              </Typography>
            </>
          ) : (
            <>
              <ChevronDown size={16} color={colors.primary[500]} />
              <Typography variant="body2" weight="medium" color="primary">
                {t.viewAll[lang].replace("{count}", hiddenCount.toString())}
              </Typography>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
};

// Helper para nombres de categorías
function getCategoryDisplayName(category: string, lang: "es" | "en"): string {
  const t = analyticsTranslations;
  const key = category as keyof typeof t.muscleCategories;
  return t.muscleCategories[key]?.[lang] || category;
}

export const SmartVolumeDisplay = React.memo(SmartVolumeDisplayComponent);
export default SmartVolumeDisplay;

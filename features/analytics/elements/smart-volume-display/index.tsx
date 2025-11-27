import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { VolumeDisplay } from "@/shared/ui/volume-display";
import type { WeeklyVolumeMap } from "@/shared/utils/volume-calculator";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <BarChart3 size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.weeklyVolume[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.skeletonBars}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skeletonBarRow}>
                <View style={[styles.skeletonLabel, { backgroundColor: colors.gray[200] }]} />
                <View style={[styles.skeletonBar, { backgroundColor: colors.gray[200], width: `${100 - i * 15}%` }]} />
              </View>
            ))}
          </View>
        </Card>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <BarChart3 size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.weeklyVolume[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.emptyState}>
            <BarChart3 size={32} color={colors.gray[400]} />
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={styles.emptyText}
            >
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <BarChart3 size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.weeklyVolume[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.emptyState}>
            <BarChart3 size={32} color={colors.gray[400]} />
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={styles.emptyText}
            >
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BarChart3 size={20} color={colors.primary[500]} />
          <Typography variant="h5" weight="semibold">
            {t.weeklyVolume[lang]}
          </Typography>
        </View>
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
          {displayData.map((item, index) => (
            <View
              key={item.category}
              style={[
                styles.volumeItem,
                index === displayData.length - 1 && styles.volumeItemLast,
              ]}
            >
              <View style={styles.volumeItemHeader}>
                <Typography variant="body2" weight="medium">
                  {item.category}
                </Typography>
                <View style={styles.volumeStats}>
                  <Typography variant="caption" color="textMuted">
                    {item.sets} {t.sets[lang]}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{ color: colors.primary[500] }}
                  >
                    {item.percentage.toFixed(0)}%
                  </Typography>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.gray[200] }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(item.sets / volumeEntries[0].sets) * 100}%`,
                      backgroundColor: colors.primary[500],
                    },
                  ]}
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
            styles.expandButton,
            {
              backgroundColor: pressed ? colors.gray[100] : colors.surface,
              borderColor: colors.border,
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    marginTop: 4,
  },
  skeletonBars: {
    gap: 12,
  },
  skeletonBarRow: {
    gap: 8,
  },
  skeletonLabel: {
    width: 80,
    height: 14,
    borderRadius: 4,
  },
  skeletonBar: {
    height: 6,
    borderRadius: 3,
  },
  volumeItem: {
    marginBottom: 14,
  },
  volumeItemLast: {
    marginBottom: 0,
  },
  volumeItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  volumeStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  expandButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

export const SmartVolumeDisplay = React.memo(SmartVolumeDisplayComponent);
export default SmartVolumeDisplay;

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutSessionDetailTranslations } from "@/shared/translations/workout-session-detail";
import { StatCard } from "@/shared/ui/stat-card";
import { Typography } from "@/shared/ui/typography";
import { VolumeDisplay } from "@/shared/ui/volume-display";
import { VolumeCalculator } from "@/shared/utils/volume-calculator";
import { fromKg } from "@/shared/utils/weight-conversion";
import { Target, Zap } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SessionAnalytics as SessionAnalyticsType } from "../../hooks/use-session-detail";

type Props = {
  analytics: SessionAnalyticsType | null;
  lang: "es" | "en";
};

export const SessionAnalytics: React.FC<Props> = ({ analytics, lang }) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const t = workoutSessionDetailTranslations;

  if (!analytics) {
    return null;
  }

  // Convert weights to user's preferred unit
  const displayWeight =
    analytics.bestSets.length > 0
      ? fromKg(analytics.bestSets[0].weight, weightUnit, 1)
      : 0;
  const displayVolume = fromKg(analytics.totalVolume, weightUnit, 0);

  return (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {t.sessionSummary[lang]}
      </Typography>

      {/* Main stats row */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        {analytics.averageRPE && (
          <StatCard
            icon={<Zap size={20} color={colors.primary[500]} />}
            title={t.averageRPE[lang]}
            value={analytics.averageRPE.toString()}
            subtitle={t.setsWithRPE[lang].replace(
              "{percentage}",
              analytics.plannedVsActual.rpeUsage.toString()
            )}
            color={colors.primary[500]}
          />
        )}

        {analytics.bestSets.length > 0 && (
          <StatCard
            icon={<Target size={20} color={colors.primary[500]} />}
            title={t.bestSet[lang]}
            value={`${displayWeight}${weightUnit}`}
            subtitle={`${analytics.bestSets[0].reps} ${t.reps[lang]} - ${analytics.bestSets[0].exerciseName}`}
            color={colors.primary[500]}
          />
        )}
      </View>

      {/* Muscle group distribution with VolumeDisplay */}
      {analytics.muscleGroupVolume.length > 0 && (
        <VolumeDisplay
          volumeData={VolumeCalculator.formatSessionVolumeForDisplay(
            analytics.muscleGroupVolume
          )}
          totalSets={analytics.muscleGroupVolume.reduce(
            (sum, group) => sum + group.sets,
            0
          )}
          showPercentages={true}
          title={t.distributionByMuscle[lang]}
          subtitle={t.totalVolume[lang]
            .replace("{volume}", displayVolume.toLocaleString())
            .replace("{unit}", weightUnit)}
        />
      )}
    </View>
  );
};

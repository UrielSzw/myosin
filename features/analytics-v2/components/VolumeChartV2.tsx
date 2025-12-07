/**
 * VolumeChartV2 - Analytics wrapper for VolumeChart
 *
 * Transforms WeeklyVolumeMap to the generic MuscleVolumeData format
 * used by the shared VolumeChart component.
 */

import type { SupportedLanguage } from "@/shared/types/language";

import { MuscleVolumeData, VolumeChart } from "@/shared/ui/volume-chart";
import { WeeklyVolumeMap } from "@/shared/utils/volume-calculator";
import React, { useMemo } from "react";

type Props = {
  weeklyVolume: WeeklyVolumeMap;
  lang: SupportedLanguage;
};

const CATEGORY_KEYS = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "legs",
  "core",
] as const;

export const VolumeChartV2: React.FC<Props> = ({ weeklyVolume, lang }) => {
  const { volumeData, totalSets } = useMemo(() => {
    const data: MuscleVolumeData[] = CATEGORY_KEYS.map((key) => {
      const volume = weeklyVolume[key];
      return {
        category: key,
        sets: Math.round(volume?.totalSets || 0),
      };
    }).filter((item) => item.sets > 0);

    const total = data.reduce((sum, item) => sum + item.sets, 0);

    return { volumeData: data, totalSets: total };
  }, [weeklyVolume]);

  if (volumeData.length === 0) {
    return null;
  }

  return (
    <VolumeChart
      volumeData={volumeData}
      totalSets={totalSets}
      lang={lang}
      animationDelay={400}
    />
  );
};

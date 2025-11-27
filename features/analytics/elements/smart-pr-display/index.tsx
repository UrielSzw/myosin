import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Trophy,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { PRData } from "../../types/pr";
import { PRItem } from "./pr-item";

type Props = {
  data: PRData[];
  loading?: boolean;
  showTop?: number;
};

export const SmartPRDisplayComponent: React.FC<Props> = ({
  data,
  loading,
  showTop = 4,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSeeAllPress = () => {
    router.push("/pr-list" as any);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Trophy size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.personalRecords[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.skeletonRow}>
            <View style={[styles.skeleton, { backgroundColor: colors.gray[200] }]} />
            <View style={[styles.skeletonText, { backgroundColor: colors.gray[200] }]} />
          </View>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Trophy size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.personalRecords[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.emptyState}>
            <Trophy size={32} color={colors.gray[400]} />
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={styles.emptyText}
            >
              {t.noPRsYet[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {t.completeWorkoutsForPRs[lang]}
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
          <Trophy size={20} color={colors.primary[500]} />
          <Typography variant="h5" weight="semibold">
            {t.personalRecords[lang]}
          </Typography>
        </View>
        <Pressable
          style={styles.seeAllButton}
          onPress={handleSeeAllPress}
        >
          <Typography variant="caption" color="textMuted">
            {sortedPRs.length} {t.total[lang]}
          </Typography>
          <ChevronRight size={14} color={colors.textMuted} />
        </Pressable>
      </View>

      {displayData.map((pr) => (
        <PRItem key={pr.id} pr={pr} colors={colors} />
      ))}

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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    marginTop: 4,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skeleton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  skeletonText: {
    flex: 1,
    height: 16,
    borderRadius: 4,
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

export const SmartPRDisplay = React.memo(SmartPRDisplayComponent);
export default SmartPRDisplay;

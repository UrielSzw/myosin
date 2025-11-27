import { PRData } from "@/features/analytics/types/pr";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { useRouter } from "expo-router";
import { ChevronRight, Trophy } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export const PRItem: React.FC<{
  pr: PRData;
  colors: any;
}> = ({ pr, colors }) => {
  const router = useRouter();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const lang = prefs?.language ?? "es";

  const displayWeight = fromKg(pr.best_weight, weightUnit, 1);
  const display1RM = fromKg(pr.estimated_1rm, weightUnit, 1);

  // Calculate time ago (short format)
  const getTimeAgo = (): string => {
    const achievedDate = new Date(pr.achieved_at);
    const now = new Date();
    const diffMs = now.getTime() - achievedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return lang === "es" ? "Hoy" : "Today";
    } else if (diffDays === 1) {
      return lang === "es" ? "Ayer" : "Yesterday";
    } else if (diffDays < 7) {
      return lang === "es" ? `${diffDays}d` : `${diffDays}d ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return lang === "es" ? `${weeks}sem` : `${weeks}w ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return lang === "es" ? `${months}m` : `${months}mo ago`;
    }
  };

  const handlePress = () => {
    router.push(`/pr-detail/${pr.exercise_id}` as any);
  };

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <Card
          variant="outlined"
          padding="md"
          style={[styles.card, { opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.content}>
            {/* Left: Trophy icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary[100] },
              ]}
            >
              <Trophy size={18} color={colors.primary[600]} />
            </View>

            {/* Middle: Info */}
            <View style={styles.info}>
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={styles.title}
              >
                {pr.exercise_name || `Ejercicio ${pr.exercise_id.slice(0, 8)}...`}
              </Typography>
              <View style={styles.metaRow}>
                <Typography variant="caption" color="textMuted" numberOfLines={1}>
                  {displayWeight}{weightUnit} × {pr.best_reps}
                </Typography>
                <View style={[styles.dot, { backgroundColor: colors.gray[300] }]} />
                <Typography variant="caption" color="textMuted" numberOfLines={1} style={styles.timeAgo}>
                  {getTimeAgo()}
                </Typography>
              </View>
            </View>

            {/* Right: 1RM badge + chevron */}
            <View style={styles.rightSection}>
              <View
                style={[
                  styles.rmBadge,
                  { backgroundColor: colors.primary[500] },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="bold"
                  style={styles.rmText}
                >
                  {Math.round(display1RM)}
                </Typography>
                <Typography
                  variant="caption"
                  weight="medium"
                  style={styles.rmUnit}
                >
                  {weightUnit}
                </Typography>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "nowrap",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    flexShrink: 0,
  },
  timeAgo: {
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  rmBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 1,
    minWidth: 55,
    justifyContent: "center",
  },
  rmText: {
    color: "#ffffff",
    fontSize: 14,
  },
  rmUnit: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
  },
});

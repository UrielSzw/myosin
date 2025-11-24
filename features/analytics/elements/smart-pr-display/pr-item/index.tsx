import { PRData } from "@/features/analytics/types/pr";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { Pressable, View } from "react-native";

export const PRItem: React.FC<{
  pr: PRData;
  colors: any;
}> = ({ pr, colors }) => {
  const router = useRouter();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const achievedDate = new Date(pr.achieved_at);
  const isRecent =
    Date.now() - achievedDate.getTime() < 7 * 24 * 60 * 60 * 1000; // Último 7 días

  const displayWeight = fromKg(pr.best_weight, weightUnit, 1);
  const display1RM = fromKg(pr.estimated_1rm, weightUnit, 1);

  const handlePress = () => {
    router.push(`/pr-detail/${pr.exercise_id}` as any);
  };

  return (
    <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              {isRecent && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.success[500],
                  }}
                />
              )}
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {pr.exercise_name ||
                  `Ejercicio ${pr.exercise_id.slice(0, 8)}...`}
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2" color="textMuted">
                {displayWeight}
                {weightUnit} × {pr.best_reps} reps
              </Typography>
              <Typography variant="caption" color="textMuted">
                •
              </Typography>
              <Typography variant="caption" color="textMuted">
                1RM: {display1RM}
                {weightUnit}
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Calendar size={12} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {achievedDate.toLocaleDateString()}
              </Typography>
              {pr.source === "manual" && (
                <>
                  <Typography variant="caption" color="textMuted">
                    •
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    Manual
                  </Typography>
                </>
              )}
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                backgroundColor: colors.warning[100],
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginBottom: 4,
              }}
            >
              <Typography variant="caption" weight="medium" color="warning">
                PR
              </Typography>
            </View>
            <Typography
              variant="h6"
              weight="bold"
              style={{ color: colors.primary[500] }}
            >
              {Math.round(display1RM)}
              {weightUnit}
            </Typography>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

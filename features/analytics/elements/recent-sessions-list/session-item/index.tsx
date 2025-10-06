import { SessionData } from "@/features/analytics/types/session";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar, Clock, Target } from "lucide-react-native";
import { Pressable, View } from "react-native";

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return "Hace unos minutos";
    }
    return `Hace ${diffHours}h`;
  } else if (diffDays === 1) {
    return "Ayer";
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString();
  }
};

export const SessionItem: React.FC<{
  session: SessionData;
  colors: any;
}> = ({ session, colors }) => {
  const completionRate = Math.round(
    (session.total_sets_completed / session.total_sets_planned) * 100
  );
  const isCompleted = completionRate === 100;
  const timeAgo = getTimeAgo(session.started_at);

  const handleSessionPress = () => {};

  return (
    <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
      <Pressable
        onPress={handleSessionPress}
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
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {session.routine_name}
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginBottom: 6,
              }}
            >
              <Calendar size={12} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {timeAgo}
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {formatDuration(session.total_duration_seconds)}
                </Typography>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Target size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {session.total_sets_completed}/{session.total_sets_planned}{" "}
                  sets
                </Typography>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
            <View
              style={{
                backgroundColor: isCompleted
                  ? colors.success[100]
                  : completionRate >= 80
                  ? colors.warning[100]
                  : colors.gray[100],
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginBottom: 4,
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: isCompleted
                    ? colors.success[700]
                    : completionRate >= 80
                    ? colors.warning[700]
                    : colors.gray[700],
                }}
              >
                {completionRate}%
              </Typography>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

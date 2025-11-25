import { WorkoutSessionFull } from "@/shared/db/schema/workout-session";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionAnalytics } from "../../hooks/use-session-detail";

type Props = {
  session: WorkoutSessionFull;
  analytics: SessionAnalytics | null;
  lang: "es" | "en";
};

const formatDate = (dateString: string, lang: "es" | "en"): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const SessionHeader: React.FC<Props> = ({
  session,
  analytics,
  lang,
}) => {
  const { colors } = useColorScheme();
  const router = useRouter();

  const completionRate = Math.round(
    (session.total_sets_completed / session.total_sets_planned) * 100
  );

  const isCompleted = completionRate === 100;

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
        />

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            {session.routine.name}
          </Typography>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {formatDate(session.started_at, lang)}
          </Typography>
        </View>

        <View
          style={{
            backgroundColor: isCompleted
              ? colors.success[100]
              : completionRate >= 80
              ? colors.warning[100]
              : colors.gray[100],
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Typography
            variant="body2"
            weight="semibold"
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
    </SafeAreaView>
  );
};

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { workoutSessionListTranslations } from "@/shared/translations/workout-session-list";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  totalSessions: number;
  recentSessions: number;
  lang: "es" | "en";
};

export const SessionListHeader: React.FC<Props> = ({
  totalSessions,
  recentSessions,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = workoutSessionListTranslations;
  const tShared = sharedUiTranslations;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity
        onPress={handleGoBack}
        style={{
          padding: 8,
          marginRight: 12,
        }}
        accessibilityRole="button"
        accessibilityLabel={tShared.goBack[lang]}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Typography variant="h6" weight="semibold">
          {t.trainingSessions[lang]}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {t.totalSessions[lang].replace("{count}", totalSessions.toString())} ·{" "}
          {t.recentSessions[lang].replace("{count}", recentSessions.toString())}
        </Typography>
      </View>
    </View>
  );
};
